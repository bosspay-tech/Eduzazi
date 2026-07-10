import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.MONGODB_URI || '';

type PgCache = {
  pool: Pool | null;
  initialized: boolean;
};

const globalWithPg = global as typeof globalThis & {
  pgPool?: PgCache;
};

if (!globalWithPg.pgPool) {
  globalWithPg.pgPool = { pool: null, initialized: false };
}

const cached = globalWithPg.pgPool;

export function getPool(): Pool {
  if (!cached.pool) {
    if (!connectionString) {
      throw new Error('Please define DATABASE_URL or MONGODB_URI connection string in environment variables');
    }
    cached.pool = new Pool({
      connectionString,
      ssl: connectionString.includes('supabase.co') || connectionString.includes('elephantsql.com') || connectionString.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }
  return cached.pool;
}

async function initializeDatabase(pool: Pool) {
  if (cached.initialized) return;

  const queries = [
    `CREATE TABLE IF NOT EXISTS educcazi_users (
      "id" VARCHAR(255) PRIMARY KEY,
      "email" VARCHAR(255) UNIQUE NOT NULL,
      "password" VARCHAR(255),
      "name" VARCHAR(255),
      "phone" VARCHAR(255),
      "activeSessionId" VARCHAR(255),
      "isVerified" BOOLEAN DEFAULT FALSE,
      "verificationToken" VARCHAR(255),
      "verificationTokenExpires" TIMESTAMP,
      "resetPasswordToken" VARCHAR(255),
      "resetPasswordExpires" TIMESTAMP,
      "addresses" JSONB DEFAULT '[]'::jsonb,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS educcazi_products (
      "id" VARCHAR(255) PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
      "description" TEXT,
      "price" DECIMAL(10,2) NOT NULL,
      "discount" INTEGER DEFAULT 0,
      "category" VARCHAR(255) NOT NULL,
      "size" JSONB DEFAULT '[]'::jsonb,
      "color" JSONB DEFAULT '[]'::jsonb,
      "stock" INTEGER NOT NULL DEFAULT 0,
      "image" VARCHAR(255) NOT NULL,
      "images" JSONB DEFAULT '[]'::jsonb,
      "pdfUrl" VARCHAR(255),
      "downloadLink" VARCHAR(255),
      "rating" DECIMAL(3,2) DEFAULT 0.0,
      "reviews" JSONB DEFAULT '[]'::jsonb,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,


    `CREATE TABLE IF NOT EXISTS educcazi_counseling_applications (
      "id" VARCHAR(255) PRIMARY KEY,
      "applicationId" VARCHAR(255) UNIQUE NOT NULL,
      "userId" VARCHAR(255) NOT NULL,
      "serviceId" VARCHAR(255) NOT NULL,
      "serviceName" VARCHAR(255) NOT NULL,
      "fullName" VARCHAR(255) NOT NULL,
      "email" VARCHAR(255) NOT NULL,
      "phone" VARCHAR(255) NOT NULL,
      "dob" DATE NOT NULL,
      "gender" VARCHAR(50) NOT NULL,
      "highestQualification" VARCHAR(255) NOT NULL,
      "currentInstitution" VARCHAR(255) NOT NULL,
      "passingYear" INTEGER NOT NULL,
      "gpaOrPercentage" VARCHAR(50) NOT NULL,
      "preferredCountry" VARCHAR(255),
      "preferredCourse" VARCHAR(255),
      "sopOrEssayText" TEXT,
      "additionalNotes" TEXT,
      "feeAmount" DECIMAL(10,2) NOT NULL,
      "paymentStatus" VARCHAR(50) DEFAULT 'PENDING',
      "paymentMethod" VARCHAR(50) DEFAULT 'ONLINE',
      "applicationStatus" VARCHAR(50) DEFAULT 'PENDING',
      "razorpayOrderId" VARCHAR(255),
      "razorpayPaymentId" VARCHAR(255),
      "razorpaySignature" VARCHAR(255),
      "deliveryStreet" VARCHAR(500),
      "deliveryCity" VARCHAR(255),
      "deliveryState" VARCHAR(255),
      "deliveryPincode" VARCHAR(10),
      "billingSameAsDelivery" BOOLEAN DEFAULT TRUE,
      "billingStreet" VARCHAR(500),
      "billingCity" VARCHAR(255),
      "billingState" VARCHAR(255),
      "billingPincode" VARCHAR(10),
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `ALTER TABLE educcazi_counseling_applications ADD COLUMN IF NOT EXISTS "deliveryStreet" VARCHAR(500);`,
    `ALTER TABLE educcazi_counseling_applications ADD COLUMN IF NOT EXISTS "deliveryCity" VARCHAR(255);`,
    `ALTER TABLE educcazi_counseling_applications ADD COLUMN IF NOT EXISTS "deliveryState" VARCHAR(255);`,
    `ALTER TABLE educcazi_counseling_applications ADD COLUMN IF NOT EXISTS "deliveryPincode" VARCHAR(10);`,
    `ALTER TABLE educcazi_counseling_applications ADD COLUMN IF NOT EXISTS "billingSameAsDelivery" BOOLEAN DEFAULT TRUE;`,
    `ALTER TABLE educcazi_counseling_applications ADD COLUMN IF NOT EXISTS "billingStreet" VARCHAR(500);`,
    `ALTER TABLE educcazi_counseling_applications ADD COLUMN IF NOT EXISTS "billingCity" VARCHAR(255);`,
    `ALTER TABLE educcazi_counseling_applications ADD COLUMN IF NOT EXISTS "billingState" VARCHAR(255);`,
    `ALTER TABLE educcazi_counseling_applications ADD COLUMN IF NOT EXISTS "billingPincode" VARCHAR(10);`,
  ];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const query of queries) {
      await client.query(query);
    }
    await client.query('COMMIT');
    cached.initialized = true;
    console.log('PostgreSQL database tables initialized successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing database tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function connectDB() {
  const pool = getPool();
  await initializeDatabase(pool);
  return pool;
}

export default connectDB;
