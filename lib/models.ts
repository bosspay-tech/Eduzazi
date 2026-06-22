import crypto from 'crypto';
import { getPool } from './db';

// Helper to generate 24-character hexadecimal IDs compatible with MongoDB ObjectId format
export function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// Helper to serialize values for PG JSONB columns and standard fields
function serializeParam(value: any): any {
  if (value instanceof Date) {
    return value;
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
}

// Helper to build WHERE SQL statement from MongoDB-style filter objects
function buildWhereClause(filter: Record<string, any>, startParamIndex = 1) {
  const clauses: string[] = [];
  const params: any[] = [];
  let paramIndex = startParamIndex;

  const cleanFilter = { ...filter };
  if (cleanFilter._id && !cleanFilter.id) {
    cleanFilter.id = cleanFilter._id;
    delete cleanFilter._id;
  }

  for (const [key, value] of Object.entries(cleanFilter)) {
    if (value === undefined) continue;

    // Handle MongoDB operators ($gt, $gte, $lt, $lte, $ne, $in)
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      for (const [op, opVal] of Object.entries(value)) {
        if (op === '$in') {
          if (Array.isArray(opVal)) {
            if (opVal.length === 0) {
              clauses.push('1 = 0'); // force no results
            } else {
              const placeholders = opVal.map((_, idx) => `$${paramIndex + idx}`).join(', ');
              clauses.push(`"${key}" IN (${placeholders})`);
              params.push(...opVal);
              paramIndex += opVal.length;
            }
          }
        } else {
          let sqlOp = '=';
          if (op === '$gt') sqlOp = '>';
          else if (op === '$gte') sqlOp = '>=';
          else if (op === '$lt') sqlOp = '<';
          else if (op === '$lte') sqlOp = '<=';
          else if (op === '$ne') sqlOp = '!=';

          clauses.push(`"${key}" ${sqlOp} $${paramIndex}`);
          params.push(opVal);
          paramIndex++;
        }
      }
    } else {
      if (value === null) {
        clauses.push(`"${key}" IS NULL`);
      } else {
        clauses.push(`"${key}" = $${paramIndex}`);
        params.push(serializeParam(value));
        paramIndex++;
      }
    }
  }

  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  return { whereSql, params };
}

// Helper to build UPDATE set fields statement from MongoDB-style updates
function buildUpdateFields(update: Record<string, any>, startParamIndex = 1) {
  const fields: string[] = [];
  const params: any[] = [];
  let paramIndex = startParamIndex;

  // Support both $set updates and flat updates
  const updateData = update.$set ? { ...update, ...update.$set } : update;
  delete updateData.$set;
  delete updateData._id;
  delete updateData.id;

  for (const [key, value] of Object.entries(updateData)) {
    if (key.startsWith('$')) continue; // skip other MongoDB operators

    fields.push(`"${key}" = $${paramIndex}`);
    params.push(serializeParam(value));
    paramIndex++;
  }

  return { setSql: fields.join(', '), params, nextParamIndex: paramIndex };
}

// Mongoose-compatible Document wrapper that implements .save() and _id aliasing
export class SupabaseDocument {
  [key: string]: any;
  private _tableName: string;
  private _model: any;

  constructor(data: any, tableName: string, model: any) {
    Object.assign(this, data);
    if (data.id && !data._id) {
      this._id = data.id;
    }
    this._tableName = tableName;
    this._model = model;
  }

  async save() {
    const dataToSave = { ...this };
    const id = dataToSave.id || dataToSave._id;
    
    // cast as any to allow deletions of optional/private properties
    const anyData = dataToSave as any;
    delete anyData._tableName;
    delete anyData._model;
    delete anyData._id;
    delete anyData.createdAt;
    delete anyData.updatedAt;

    const { setSql, params } = buildUpdateFields(anyData, 1);
    
    // If setSql is empty (no changes), return directly
    if (!setSql) {
      return this;
    }

    const sql = `UPDATE "${this._tableName}" SET ${setSql}, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = $${params.length + 1} RETURNING *`;
    params.push(id);

    const pool = getPool();
    const res = await pool.query(sql, params);
    if (res.rows.length > 0) {
      Object.assign(this, res.rows[0]);
      this._id = this.id;
    }
    return this;
  }

  toObject() {
    const obj = { ...this } as any;
    delete obj._tableName;
    delete obj._model;
    return obj;
  }

  toJSON() {
    return this.toObject();
  }
}

// Mongoose-compatible single document query builder supporting .lean(), .select(), .populate()
class SupabaseSingleQuery implements PromiseLike<any> {
  private tableName: string;
  private filter: any;
  private model: any;
  private isLean = false;
  private selectFields = '';

  constructor(tableName: string, filter: any, model: any) {
    this.tableName = tableName;
    this.filter = filter;
    this.model = model;
  }

  lean() {
    this.isLean = true;
    return this;
  }

  select(fieldsStr: string) {
    this.selectFields = fieldsStr;
    return this;
  }

  populate() {
    return this; // mock/no-op
  }

  async execute() {
    const pool = getPool();
    const { whereSql, params } = buildWhereClause(this.filter);
    const sql = `SELECT * FROM "${this.tableName}" ${whereSql} LIMIT 1`;
    const res = await pool.query(sql, params);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    row._id = row.id;

    // Apply basic selection simulation (e.g. select('-password') removes password)
    if (this.selectFields && this.selectFields.includes('-')) {
      const fieldToRemove = this.selectFields.replace('-', '').trim();
      delete row[fieldToRemove];
    }

    if (this.isLean) {
      return row;
    }
    return new SupabaseDocument(row, this.tableName, this.model);
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

// Mongoose-compatible list query builder supporting .sort(), .skip(), .limit(), .lean(), .select()
class SupabaseQuery implements PromiseLike<any> {
  private tableName: string;
  private filter: any;
  private sortObj: any = null;
  private skipNum = 0;
  private limitNum = 0;
  private model: any;
  private isLean = false;
  private selectFields = '';

  constructor(tableName: string, filter: any, model: any) {
    this.tableName = tableName;
    this.filter = filter;
    this.model = model;
  }

  sort(sortObj: any) {
    this.sortObj = sortObj;
    return this;
  }

  skip(skipNum: number) {
    this.skipNum = skipNum;
    return this;
  }

  limit(limitNum: number) {
    this.limitNum = limitNum;
    return this;
  }

  lean() {
    this.isLean = true;
    return this;
  }

  select(fieldsStr: string) {
    this.selectFields = fieldsStr;
    return this;
  }

  populate() {
    return this; // mock/no-op
  }

  async execute() {
    const pool = getPool();
    const { whereSql, params } = buildWhereClause(this.filter);

    let sortSql = '';
    if (this.sortObj) {
      const sortParts = Object.entries(this.sortObj).map(([key, val]) => {
        const dir = val === -1 || val === 'desc' ? 'DESC' : 'ASC';
        return `"${key}" ${dir}`;
      });
      sortSql = `ORDER BY ${sortParts.join(', ')}`;
    } else {
      sortSql = `ORDER BY "createdAt" DESC`;
    }

    let limitSql = '';
    if (this.limitNum > 0) {
      limitSql = `LIMIT ${this.limitNum}`;
    }

    let offsetSql = '';
    if (this.skipNum > 0) {
      offsetSql = `OFFSET ${this.skipNum}`;
    }

    const sql = `SELECT * FROM "${this.tableName}" ${whereSql} ${sortSql} ${limitSql} ${offsetSql}`;
    const res = await pool.query(sql, params);

    return res.rows.map(row => {
      row._id = row.id;

      // Apply basic selection simulation (e.g. select('-password') removes password)
      if (this.selectFields && this.selectFields.includes('-')) {
        const fieldToRemove = this.selectFields.replace('-', '').trim();
        delete row[fieldToRemove];
      }

      if (this.isLean) {
        return row;
      }
      return new SupabaseDocument(row, this.tableName, this.model);
    });
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

// Mongoose Model emulator class
export class SupabaseModel {
  tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    
    // Prototype constructor mapping to allow instantiations like `new User(data)`
    const self = this;
    const modelConstructor = function(this: any, data: any) {
      const finalData = { ...data };
      if (!finalData.id && !finalData._id) {
        finalData.id = generateId();
      } else if (finalData._id && !finalData.id) {
        finalData.id = finalData._id;
      }
      // cast as any to allow deletions
      const anyFinalData = finalData as any;
      delete anyFinalData._id;
      return new SupabaseDocument(anyFinalData, self.tableName, modelConstructor);
    };

    Object.setPrototypeOf(modelConstructor, this);
    return modelConstructor as any;
  }

  find(filter: any = {}) {
    return new SupabaseQuery(this.tableName, filter, this);
  }

  findOne(filter: any = {}) {
    return new SupabaseSingleQuery(this.tableName, filter, this);
  }

  findById(id: string) {
    return new SupabaseSingleQuery(this.tableName, { id }, this);
  }

  async create(data: any) {
    const pool = getPool();
    const docData = { ...data };
    if (!docData.id && !docData._id) {
      docData.id = generateId();
    } else if (docData._id && !docData.id) {
      docData.id = docData._id;
    }
    delete docData._id;

    const columns = Object.keys(docData).map(k => `"${k}"`).join(', ');
    const valPlaceholders = Object.keys(docData).map((_, idx) => `$${idx + 1}`).join(', ');
    const params = Object.values(docData).map(serializeParam);

    const sql = `INSERT INTO "${this.tableName}" (${columns}) VALUES (${valPlaceholders}) RETURNING *`;
    const res = await pool.query(sql, params);
    const row = res.rows[0];
    row._id = row.id;
    return new SupabaseDocument(row, this.tableName, this);
  }

  async insertMany(docs: any[]) {
    const inserted: any[] = [];
    for (const doc of docs) {
      const newDoc = await this.create(doc);
      inserted.push(newDoc);
    }
    return inserted;
  }

  async deleteMany(filter: any = {}) {
    const pool = getPool();
    const { whereSql, params } = buildWhereClause(filter);
    const sql = `DELETE FROM "${this.tableName}" ${whereSql}`;
    const res = await pool.query(sql, params);
    return { deletedCount: res.rowCount };
  }

  async deleteOne(filter: any = {}) {
    const pool = getPool();
    const { whereSql, params } = buildWhereClause(filter);
    const sql = `DELETE FROM "${this.tableName}" WHERE "id" IN (SELECT "id" FROM "${this.tableName}" ${whereSql} LIMIT 1)`;
    const res = await pool.query(sql, params);
    return { deletedCount: res.rowCount };
  }

  async findByIdAndUpdate(id: string, update: any, options?: any) {
    return this.findOneAndUpdate({ id }, update, options);
  }

  async findOneAndUpdate(filter: any, update: any, options?: any) {
    const pool = getPool();

    const { whereSql: findWhere, params: findParams } = buildWhereClause(filter);
    const findSql = `SELECT "id" FROM "${this.tableName}" ${findWhere} LIMIT 1`;
    const findRes = await pool.query(findSql, findParams);
    if (findRes.rows.length === 0) return null;
    const docId = findRes.rows[0].id;

    const { setSql, params: updateParams } = buildUpdateFields(update, 1);
    if (!setSql) {
      return this.findById(docId);
    }

    const updateSql = `UPDATE "${this.tableName}" SET ${setSql}, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = $${updateParams.length + 1} RETURNING *`;
    updateParams.push(docId);

    const res = await pool.query(updateSql, updateParams);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    row._id = row.id;

    return new SupabaseDocument(row, this.tableName, this);
  }

  async updateOne(filter: any, update: any) {
    await this.findOneAndUpdate(filter, update);
    return { modifiedCount: 1 };
  }

  async updateMany(filter: any, update: any) {
    const pool = getPool();
    const { setSql, params: updateParams } = buildUpdateFields(update, 1);
    if (!setSql) {
      return { modifiedCount: 0 };
    }

    const { whereSql, params: whereParams } = buildWhereClause(filter, updateParams.length + 1);
    const combinedParams = [...updateParams, ...whereParams];

    const sql = `UPDATE "${this.tableName}" SET ${setSql}, "updatedAt" = CURRENT_TIMESTAMP ${whereSql}`;
    const res = await pool.query(sql, combinedParams);
    return { modifiedCount: res.rowCount };
  }

  async countDocuments(filter: any = {}) {
    const pool = getPool();
    const { whereSql, params } = buildWhereClause(filter);
    const sql = `SELECT COUNT(*)::integer FROM "${this.tableName}" ${whereSql}`;
    const res = await pool.query(sql, params);
    return res.rows[0].count;
  }
}

// Export emulated model objects matching existing schema references (cast to any for constructor/TypeScript support)
export const User = new SupabaseModel('educcazi_users') as any;
export const Product = new SupabaseModel('educcazi_products') as any;
export const CounselingApplication = new SupabaseModel('educcazi_counseling_applications') as any;
