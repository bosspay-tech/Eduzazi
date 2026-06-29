import { apiUrl, authHeaders } from './api';

export type EasebuzzPaymentInput = {
  applicationId: string;
  amount: number;
  productinfo: string;
  fullName: string;
  email: string;
  phone: string;
};

export async function startEasebuzzPayment(input: EasebuzzPaymentInput, userId?: string | null) {
  const response = await fetch(apiUrl('/api/payments/easebuzz/initiate'), {
    method: 'POST',
    headers: authHeaders(userId),
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok || !data.paymentUrl) {
    throw new Error(data.error || 'Could not start payment');
  }

  window.location.href = data.paymentUrl;
}
