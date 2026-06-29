import type { CollectRequest, PGHandlers, StatusRequest } from '@dpx/bridge-node';
import {
  makeEasebuzzTxnId,
  mapEasebuzzStatus,
  retrieveEasebuzzTransaction,
  submitEasebuzzInitiatePayment,
  type EasebuzzConfig,
} from '@dpx/bridge-node';
import { getSiteBaseUrl } from './site-url';
import { initiateEasebuzzPayment } from './easebuzz';

function paisaToRupeeString(paisa: number): string {
  return (Math.round(paisa) / 100).toFixed(2);
}

function normalizeBridgePhone(raw: string): string {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (digits.length > 10) return digits.slice(-10);
  return digits || '9999999999';
}

function ensureBridgeEmail(raw: string): string {
  const trimmed = (raw ?? '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : 'customer@educazi.in';
}

function ensureBridgeName(raw?: string): string {
  const cleaned = (raw ?? '').replace(/[^A-Za-z]/g, '');
  return cleaned || 'Customer';
}

function defaultCallbackUrls(redirectUrl?: string) {
  const base = getSiteBaseUrl();
  const surl = redirectUrl || `${base}/services/pay/success`;
  const furl = redirectUrl || `${base}/services/pay/failed`;
  return { surl, furl };
}

/**
 * Easebuzz handlers for the DollerpayX / WordPress bridge.
 * Includes mandatory surl/furl — required by Easebuzz initiateLink API.
 */
export function createEducaziEasebuzzHandlers(config: EasebuzzConfig): PGHandlers {
  const productinfo = config.productinfo ?? 'Educazi Payment';
  const retrieveParams = new Map<string, { amount: string; email: string; phone: string }>();

  return {
    createCollection: async (req: CollectRequest) => {
      const txnid = makeEasebuzzTxnId(req.txn_id);
      const amount = paisaToRupeeString(req.amount);
      const email = ensureBridgeEmail(req.customer_email);
      const phone = normalizeBridgePhone(req.customer_phone);
      const firstname = ensureBridgeName(req.payer_first_name);
      const { surl, furl } = defaultCallbackUrls(req.redirect_url);

      const initiated = await initiateEasebuzzPayment({
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone,
        surl,
        furl,
      });

      const submitted = await submitEasebuzzInitiatePayment({
        config,
        accessKey: initiated.accessKey,
      });

      retrieveParams.set(txnid, { amount, email, phone });

      return {
        payment_url: initiated.paymentUrl,
        pg_transaction_id: txnid,
        mode: 's2s' as const,
        ...(submitted.ok && submitted.upiIntent ? { upi_intent_url: submitted.upiIntent } : {}),
      };
    },

    checkStatus: async (req: StatusRequest) => {
      const params = retrieveParams.get(req.pg_txn_id);
      if (!params) {
        return { status: 'pending' as const, pg_transaction_id: req.pg_txn_id, amount: 0 };
      }

      const result = await retrieveEasebuzzTransaction({
        config,
        txnid: req.pg_txn_id,
        amount: params.amount,
        email: params.email,
        phone: params.phone,
      });

      if (!result.ok) {
        return { status: 'pending' as const, pg_transaction_id: req.pg_txn_id, amount: 0 };
      }

      return {
        status: mapEasebuzzStatus(result.statusText ?? ''),
        pg_transaction_id: req.pg_txn_id,
        amount: result.amountPaisa ?? 0,
        ...(result.raw ? { raw_pg_response: result.raw as Record<string, unknown> } : {}),
      };
    },

    isAvailable: async () => Boolean(config.key && config.salt),
  };
}
