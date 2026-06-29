import type { NextRequest } from 'next/server';
import {
  buildEasebuzzInitiateHash,
  buildEasebuzzReverseHash,
  submitEasebuzzInitiatePayment,
  verifyEasebuzzReverseHash,
  type EasebuzzConfig,
  type EasebuzzEnv,
} from '@dpx/bridge-node';
import { getSiteBaseUrl } from './site-url';

export type { EasebuzzEnv };

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

function trimEnv(value: string | undefined): string {
  return (value ?? '').trim().replace(/^["']|["']$/g, '');
}

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

function sanitizeFirstname(raw: string): string {
  const first = raw.trim().split(/\s+/)[0] || 'Customer';
  const cleaned = first.replace(/[^A-Za-z]/g, '');
  return cleaned || 'Customer';
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

export function getEasebuzzConfig(): EasebuzzConfig & {
  initiateUrl: string;
  paymentBaseUrl: string;
} {
  const key = trimEnv(process.env.EASEBUZZ_KEY);
  const salt = trimEnv(process.env.EASEBUZZ_SALT);
  const env = (trimEnv(process.env.EASEBUZZ_ENV) || 'test') as EasebuzzEnv;

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
  return buildEasebuzzInitiateHash(
    {
      key: config.key,
      txnid: params.txnid,
      amount,
      productinfo: params.productinfo,
      firstname: sanitizeFirstname(params.firstname),
      email: params.email.trim(),
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
    },
    config.salt
  );
}

export function generateReverseHash(
  config: Pick<EasebuzzConfig, 'key' | 'salt'>,
  params: EasebuzzCallbackParams
): string {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) normalized[key] = value;
  }
  return buildEasebuzzReverseHash(normalized, config.salt);
}

export function verifyPaymentResponse(
  config: Pick<EasebuzzConfig, 'key' | 'salt'>,
  params: EasebuzzCallbackParams
): { valid: boolean; params: EasebuzzCallbackParams } {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) normalized[key] = value;
  }
  const valid = verifyEasebuzzReverseHash(normalized, config.salt);
  return { valid, params };
}

export function createTransactionId(prefix = 'EB'): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}${stamp}${random}`.slice(0, 30);
}

export function getCallbackBaseUrl(request?: NextRequest): string {
  return getSiteBaseUrl(request);
}

/** Direct Easebuzz hosted checkout — uses the DollerpayX bridge initiate implementation. */
export async function initiateEasebuzzPayment(params: EasebuzzInitiateParams) {
  const config = getEasebuzzConfig();
  const amount = formatAmount(params.amount);
  const firstname = sanitizeFirstname(params.firstname);
  const phone = normalizePhone(params.phone);
  const email = params.email.trim();
  const productinfo = String(params.productinfo).slice(0, 100);

  if (phone.length !== 10) {
    throw new Error('A valid 10-digit phone number is required for payment.');
  }

  const hashParams: Record<string, string> = {
    key: config.key,
    txnid: params.txnid,
    amount,
    productinfo,
    firstname,
    email,
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
  };

  const hash = buildEasebuzzInitiateHash(hashParams, config.salt);

  const body = new URLSearchParams({
    ...hashParams,
    phone,
    surl: params.surl,
    furl: params.furl,
    hash,
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

/** Two-step UPI intent mint (initiateLink → submitInitiatePayment) for direct deeplink checkout. */
export async function mintEducaziUpiPayment(
  params: Omit<EasebuzzInitiateParams, 'surl' | 'furl'>,
  redirectUrl?: string
) {
  const config = getEasebuzzConfig();
  const amount = formatAmount(params.amount);
  const phone = normalizePhone(params.phone);

  if (phone.length !== 10) {
    throw new Error('A valid 10-digit phone number is required for payment.');
  }

  const base = getSiteBaseUrl();
  const surl = redirectUrl || `${base}/services/pay/success`;
  const furl = redirectUrl || `${base}/services/pay/failed`;

  const initiated = await initiateEasebuzzPayment({
    ...params,
    amount,
    firstname: sanitizeFirstname(params.firstname),
    email: params.email.trim(),
    phone,
    productinfo: String(params.productinfo).slice(0, 100),
    surl,
    furl,
  });

  const submitted = await submitEasebuzzInitiatePayment({
    config,
    accessKey: initiated.accessKey,
  });

  return {
    paymentUrl: initiated.paymentUrl,
    upiIntent: submitted.ok ? submitted.upiIntent : undefined,
    txnid: initiated.txnid,
    amount,
  };
}

/** Thin wrapper around bridge initiateLink with mandatory surl/furl. */
export async function initiateEasebuzzLinkDirect(
  params: Omit<EasebuzzInitiateParams, 'udf1' | 'udf2' | 'udf3' | 'udf4' | 'udf5' | 'udf6' | 'udf7' | 'udf8' | 'udf9' | 'udf10'> & {
    surl: string;
    furl: string;
  }
) {
  const amount = formatAmount(params.amount);
  const phone = normalizePhone(params.phone);

  if (phone.length !== 10) {
    throw new Error('A valid 10-digit phone number is required for payment.');
  }

  const result = await initiateEasebuzzPayment({
    txnid: params.txnid,
    amount,
    firstname: sanitizeFirstname(params.firstname),
    email: params.email.trim(),
    phone,
    productinfo: String(params.productinfo).slice(0, 100),
    surl: params.surl,
    furl: params.furl,
  });

  return {
    paymentUrl: result.paymentUrl,
    accessKey: result.accessKey,
    txnid: params.txnid,
    amount,
  };
}
