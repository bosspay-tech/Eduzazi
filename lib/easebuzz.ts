import crypto from 'crypto';

export type EasebuzzEnv = 'test' | 'prod';

export type EasebuzzInitiateParams = {
  txnid: string;
  amount: number | string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  udf6?: string;
  udf7?: string;
  udf8?: string;
  udf9?: string;
  udf10?: string;
};

export type EasebuzzCallbackParams = Record<string, string | undefined>;

export type EasebuzzConfig = {
  key: string;
  salt: string;
  env: EasebuzzEnv;
  initiateUrl: string;
  paymentBaseUrl: string;
};

function getUdfValue(value?: string): string {
  return value ?? '';
}

function formatAmount(amount: number | string): string {
  const parsed = typeof amount === 'number' ? amount : Number.parseFloat(amount);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error('Invalid payment amount');
  }
  return parsed.toFixed(2);
}

export function getEasebuzzConfig(): EasebuzzConfig {
  const key = process.env.EASEBUZZ_KEY;
  const salt = process.env.EASEBUZZ_SALT;
  const env = (process.env.EASEBUZZ_ENV || 'test') as EasebuzzEnv;

  if (!key || !salt) {
    throw new Error('EASEBUZZ_KEY and EASEBUZZ_SALT must be set in environment variables');
  }

  const isProd = env === 'prod';

  return {
    key,
    salt,
    env,
    initiateUrl: isProd
      ? 'https://pay.easebuzz.in/payment/initiateLink'
      : 'https://testpay.easebuzz.in/payment/initiateLink',
    paymentBaseUrl: isProd ? 'https://pay.easebuzz.in' : 'https://testpay.easebuzz.in',
  };
}

export function generateInitiateHash(
  config: Pick<EasebuzzConfig, 'key' | 'salt'>,
  params: EasebuzzInitiateParams
): string {
  const amount = formatAmount(params.amount);
  const hashString = [
    config.key,
    params.txnid,
    amount,
    params.productinfo,
    params.firstname,
    params.email,
    getUdfValue(params.udf1),
    getUdfValue(params.udf2),
    getUdfValue(params.udf3),
    getUdfValue(params.udf4),
    getUdfValue(params.udf5),
    getUdfValue(params.udf6),
    getUdfValue(params.udf7),
    getUdfValue(params.udf8),
    getUdfValue(params.udf9),
    getUdfValue(params.udf10),
    config.salt,
  ].join('|');

  return crypto.createHash('sha512').update(hashString).digest('hex');
}

export function generateReverseHash(
  config: Pick<EasebuzzConfig, 'key' | 'salt'>,
  params: EasebuzzCallbackParams
): string {
  const hashString = [
    config.salt,
    params.status ?? '',
    getUdfValue(params.udf10),
    getUdfValue(params.udf9),
    getUdfValue(params.udf8),
    getUdfValue(params.udf7),
    getUdfValue(params.udf6),
    getUdfValue(params.udf5),
    getUdfValue(params.udf4),
    getUdfValue(params.udf3),
    getUdfValue(params.udf2),
    getUdfValue(params.udf1),
    params.email ?? '',
    params.firstname ?? '',
    params.productinfo ?? '',
    params.amount ?? '',
    params.txnid ?? '',
    config.key,
  ].join('|');

  return crypto.createHash('sha512').update(hashString).digest('hex');
}

export function verifyPaymentResponse(
  config: Pick<EasebuzzConfig, 'key' | 'salt'>,
  params: EasebuzzCallbackParams
): { valid: boolean; params: EasebuzzCallbackParams } {
  const receivedHash = params.hash;
  if (!receivedHash) {
    return { valid: false, params };
  }

  const expectedHash = generateReverseHash(config, params);
  const valid = expectedHash === receivedHash;
  return { valid, params };
}

export function createTransactionId(prefix = 'EB'): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}${stamp}${random}`.slice(0, 30);
}

export function getCallbackBaseUrl(): string {
  const base = process.env.NEXTAUTH_URL || process.env.APP_URL || 'http://localhost:3000';
  return base.replace(/\/$/, '');
}

export async function initiateEasebuzzPayment(params: EasebuzzInitiateParams) {
  const config = getEasebuzzConfig();
  const amount = formatAmount(params.amount);
  const hash = generateInitiateHash(config, { ...params, amount });

  const body = new URLSearchParams({
    key: config.key,
    txnid: params.txnid,
    amount,
    productinfo: params.productinfo,
    firstname: params.firstname,
    email: params.email,
    phone: params.phone,
    surl: params.surl,
    furl: params.furl,
    hash,
    udf1: getUdfValue(params.udf1),
    udf2: getUdfValue(params.udf2),
    udf3: getUdfValue(params.udf3),
    udf4: getUdfValue(params.udf4),
    udf5: getUdfValue(params.udf5),
    udf6: getUdfValue(params.udf6),
    udf7: getUdfValue(params.udf7),
    udf8: getUdfValue(params.udf8),
    udf9: getUdfValue(params.udf9),
    udf10: getUdfValue(params.udf10),
  });

  const response = await fetch(config.initiateUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    throw new Error('Failed to initiate Easebuzz payment');
  }

  if (data.status !== 1 || !data.data) {
    throw new Error(typeof data.data === 'string' ? data.data : 'Easebuzz payment initiation failed');
  }

  const accessKey = data.data as string;

  return {
    accessKey,
    paymentUrl: `${config.paymentBaseUrl}/pay/${accessKey}`,
    txnid: params.txnid,
    amount,
  };
}
