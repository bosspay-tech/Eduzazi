import { redirect } from 'next/navigation';

export default async function PaymentResultRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ applicationId?: string; status?: string; reason?: string }>;
}) {
  const params = await searchParams;
  const applicationId = params.applicationId;
  const status = params.status;
  const reason = params.reason;

  if (!applicationId) {
    redirect('/services');
  }

  if (status === 'success') {
    redirect(`/services/pay/success?applicationId=${encodeURIComponent(applicationId)}`);
  }

  const failedUrl = `/services/pay/failed?applicationId=${encodeURIComponent(applicationId)}${
    reason ? `&reason=${encodeURIComponent(reason)}` : ''
  }`;
  redirect(failedUrl);
}
