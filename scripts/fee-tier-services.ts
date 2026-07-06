/** Fee-tier counseling services — inserted only when no product exists at that price. */
export const FEE_TIER_SERVICES = [
  {
    name: 'Admission Document Review',
    description:
      'Expert review of your admission documents including transcripts, certificates, and supporting papers with actionable feedback.',
    price: 429,
    category: 'Application Services',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
  },
  {
    name: 'University Shortlist Consultation',
    description:
      'Personalized shortlist of universities matched to your profile, budget, and career goals with admission probability insights.',
    price: 529,
    category: 'Admission Counseling',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
  },
  {
    name: 'Profile Assessment Session',
    description:
      'One-on-one assessment of your academic profile, extracurriculars, and goals to identify strengths and improvement areas.',
    price: 539,
    category: 'Admission Counseling',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
  },
  {
    name: 'SOP Drafting Support',
    description:
      'Structured guidance and drafting support for your Statement of Purpose with one revision round included.',
    price: 649,
    category: 'Application Services',
    image: 'https://images.unsplash.com/photo-1455390582260-7046af3c0b3b?w=800&h=600&fit=crop',
  },
  {
    name: 'Visa Document Checklist Session',
    description:
      'Step-by-step visa document preparation session with a customized checklist for your destination country.',
    price: 759,
    category: 'Study Abroad',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
  },
  {
    name: 'Scholarship Application Guidance',
    description:
      'Identify suitable scholarships and receive guided support for eligibility, essays, and application submission.',
    price: 779,
    category: 'Study Abroad',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
  },
  {
    name: 'Complete Profile Building Package',
    description:
      'Build a compelling applicant profile with resume polish, activity framing, and recommendation strategy planning.',
    price: 1069,
    category: 'Application Services',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  },
  {
    name: 'Masters Application Strategy Session',
    description:
      "Targeted strategy session for master's applicants covering program selection, timelines, and application positioning.",
    price: 1079,
    category: 'Admission Counseling',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
  },
  {
    name: 'Premium Study Abroad Counseling',
    description:
      'Extended counseling session covering country selection, university fit, finances, and a personalized application roadmap.',
    price: 1289,
    category: 'Study Abroad',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
  },
  {
    name: 'End-to-End Admission Support Package',
    description:
      'Comprehensive admission support including profile review, university shortlist, essay guidance, and application tracking.',
    price: 1299,
    category: 'Application Services',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop',
  },
  {
    name: 'Multi-University Application Planning',
    description:
      'Plan and coordinate applications across multiple universities with deadline management and document coordination.',
    price: 1399,
    category: 'Application Services',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop',
  },
  {
    name: 'Advanced Essay Editing Package',
    description:
      'In-depth essay editing with structure, tone, and content feedback plus two revision rounds from senior counselors.',
    price: 1409,
    category: 'Application Services',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&h=600&fit=crop',
  },
  {
    name: 'Comprehensive Counseling Bundle',
    description:
      'Full counseling bundle with profile assessment, university shortlist, SOP support, and interview preparation.',
    price: 1999,
    category: 'Admission Counseling',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
  },
  {
    name: 'Premium Application Review Suite',
    description:
      'Senior counselor review of your complete application package before submission with detailed improvement notes.',
    price: 2159,
    category: 'Application Services',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
  },
  {
    name: 'Expert Admission Strategy Program',
    description:
      'Multi-session admission strategy program for competitive programs with personalized milestones and counselor check-ins.',
    price: 2169,
    category: 'Admission Counseling',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
  },
  {
    name: 'Elite Study Abroad Planning Package',
    description:
      'Premium planning for study abroad including university selection, financial planning, visa prep, and pre-departure guidance.',
    price: 2809,
    category: 'Study Abroad',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  },
  {
    name: 'Full-Service Application Management',
    description:
      'Dedicated application management across forms, essays, documents, and deadlines with counselor oversight throughout.',
    price: 3779,
    category: 'Application Services',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
  },
  {
    name: 'Premium Complete Study Abroad Package',
    description:
      'Our most comprehensive package: strategy, applications, visa support, scholarship guidance, and pre-departure counseling.',
    price: 4339,
    category: 'Study Abroad',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
  },
] as const;

export function toSeedProduct(service: (typeof FEE_TIER_SERVICES)[number]) {
  return {
    name: service.name,
    description: service.description,
    price: service.price,
    discount: 0,
    category: service.category,
    size: ['Counseling Session', 'Expert Guidance'],
    color: ['Senior Counselor'],
    stock: 9999,
    image: service.image,
    images: [],
    pdfUrl: '',
    downloadLink: '',
    rating: 4.6,
    reviews: [
      {
        text: 'Professional support that made the process much clearer.',
        rating: 5,
      },
    ],
  };
}
