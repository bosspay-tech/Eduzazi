import Navbar from '@/components/navbar';
import Link from 'next/link';

const faqs = [
  {
    question: 'How do I connect with my assigned counselor?',
    answer: 'Once you book a service, we assign a specialized study abroad consultant to your profile. They will reach out to you via email or phone within 24 hours to schedule your initial consultation.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'For counseling and advisory services, refunds are subject to our refund policy. Once profile reviews and document processing have commenced, fees are non-refundable.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept payments via major credit/debit cards, UPI, net banking, and digital wallets securely on our platform.',
  },
  {
    question: 'How can I track my counseling applications?',
    answer: 'You can sign in and visit the "My Applications" page under your account to view all your active counseling submissions, matching status, and receipt history.',
  },
  {
    question: 'Who can I contact if I do not receive my confirmation?',
    answer: 'If you do not receive a booking confirmation email within a few minutes, check your spam folder or contact our helpline at support@educazi.com or +91 8129870556.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-to-r from-secondary to-secondary py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Quick answers about counseling, applications, payments, and support.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-border pb-6">
                <h2 className="mb-2 text-xl font-semibold text-foreground">{faq.question}</h2>
                <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-secondary/50 rounded-2xl p-8 text-center border border-border">
            <h2 className="mb-2 text-2xl font-bold text-foreground">Need more help?</h2>
            <p className="mb-6 text-muted-foreground max-w-md mx-auto text-sm">
              Our team is here to help with counseling selection, profile reviews, applications, and study abroad visa support.
            </p>
            <Link
              href="/contact"
              className="inline-flex px-8 py-3 rounded-full font-medium text-white transition bg-primary hover:bg-blue-600 shadow-md hover:shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
