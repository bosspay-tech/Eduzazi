'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import { Star, GraduationCap, Calendar, Users, Award, Shield, FileText, CheckCircle, Clock, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { apiUrl } from '@/lib/api';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category?: string;
  rating?: number;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(apiUrl(`/api/products/${params.id}`));
        const data = await res.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-20 flex-grow w-full flex items-center justify-center">
          <div className="animate-pulse space-y-8 w-full">
            <div className="h-64 bg-slate-100 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-10 bg-slate-100 rounded-xl w-3/4" />
                <div className="h-6 bg-slate-100 rounded-xl w-1/2" />
                <div className="h-32 bg-slate-100 rounded-2xl" />
              </div>
              <div className="h-80 bg-slate-100 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center flex-grow flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Service Not Found</h2>
          <p className="text-sm text-slate-400 mt-1">The counseling service you are looking for does not exist or has been archived.</p>
        </div>
      </div>
    );
  }

  const finalPrice = service.price * (1 - service.discount / 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Service Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-900 to-slate-950 text-white py-12 sm:py-16 md:py-20 border-b border-slate-950">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h20v20H0V0zm20%2020h20v20H20V20z%22%20fill%3D%22%237C3AED%22%20fill-opacity%3D%220.15%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-repeat" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content (7 columns) */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-600/25 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 text-violet-300 animate-pulse" />
                {service.category || 'Counseling Service'}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                {service.name}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-slate-355 font-semibold">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                  <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white text-base">{parseFloat(String(service.rating || '4.9')).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4.5 w-4.5 text-violet-400" />
                  <span>500+ Applicants Guided</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4.5 w-4.5 text-violet-400" />
                  <span>Enrolling for Fall 2026 / Spring 2027</span>
                </div>
              </div>
            </div>

            {/* Right Service Image Banner (5 columns) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border-4 border-white/10 shadow-2xl hover:scale-[1.01] transition-transform duration-300">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 450px"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-grow flex flex-col lg:flex-row gap-10">
        
        {/* Left Column (Overview & Guidance Details) */}
        <div className="flex-1 space-y-10 min-w-0">
          
          {/* Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="h-6 w-6 text-violet-650" />
              Service Overview
            </h2>
            <div className="border-t border-slate-100 my-4" />
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line font-medium">
              {service.description}
            </p>
          </div>

          {/* Benefits Grid Card */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              What This Consultation Offers
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Personalized 1-on-1 counseling session",
                "Strategic profile evaluation and gap analysis",
                "Customized university recommendation list",
                "Assistance with SOP guidelines and essay formats",
                "Detailed visa documentation walkthrough",
                "Post-admission guidance and pre-departure briefings"
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-3 items-start bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation Process Accordions */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-violet-650" />
              Our Guidance Process
            </h2>
            
            <div className="space-y-3">
              {[
                { title: "Step 1: Profile Assessment & Initial Sync", desc: "Fill out the registration form with your academics, preferences, and goals. We review your details and align with a senior counselor." },
                { title: "Step 2: University Shortlisting & SOP Planning", desc: "Receive customized university matches based on eligibility, and plan your statement of purpose essays using expert blueprints." },
                { title: "Step 3: Applications Review & Visa Prep", desc: "A final verification of all documents, drafts, and forms before submission, followed by mock visa interviews and briefings." }
              ].map((step, idx) => (
                <details
                  key={idx}
                  className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
                  open={idx === 0}
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none font-bold text-gray-900 group-hover:text-violet-650 transition-colors">
                    <span className="text-sm sm:text-base flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center text-xs font-black shadow-sm">
                        {idx + 1}
                      </span>
                      {step.title}
                    </span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform flex items-center justify-center bg-slate-50 w-7 h-7 rounded-lg border border-slate-200">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                    <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold">{step.desc}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Sticky Apply Card) */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <div className="sticky top-24 bg-white border border-slate-200 p-6 rounded-3xl shadow-lg space-y-6">
            
            {/* Price section */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Registration Fee</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">₹{Math.round(finalPrice).toLocaleString('en-IN')}</span>
                {service.discount > 0 && (
                  <span className="text-sm text-slate-400 line-through font-bold">₹{service.price.toLocaleString('en-IN')}</span>
                )}
              </div>
              {service.discount > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                  Discount: {service.discount}% OFF
                </span>
              )}
            </div>

            {/* instant delivery banner */}
            <div className="p-4 bg-violet-50/50 rounded-2xl border border-violet-100/50 flex gap-3 items-start">
              <Shield className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0 animate-pulse" />
              <div className="text-xs">
                <p className="font-bold text-violet-850">Secured Enrollment</p>
                <p className="text-violet-755 mt-0.5 leading-snug font-semibold">Your payment is encrypted. Profiling application starts instantly after fee completion.</p>
              </div>
            </div>

            {/* Inclusions checklist */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Guidance Inclusions</p>
              <div className="space-y-3">
                {[
                  { icon: FileText, text: "1-on-1 Consultation Session" },
                  { icon: GraduationCap, text: "University Recommendation List" },
                  { icon: Clock, text: "Ongoing SOP & Essay Support" },
                  { icon: Shield, text: "Visa Processing Guidance" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center text-xs font-bold text-slate-655">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-650 flex items-center justify-center flex-shrink-0 border border-violet-100/30">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply CTA */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href={`/services/${service._id}/apply`}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all duration-300 font-bold shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>Apply Now</span>
                <ArrowRight className="h-5 w-5 animate-pulse" />
              </Link>
            </div>

            {/* Help desk stamp */}
            <div className="text-center text-[10px] font-semibold text-slate-400 leading-relaxed pt-2">
              Need help? Reach support at <a href="mailto:support@educazi.com" className="text-violet-600 hover:underline">support@educazi.com</a> or <a href="tel:+918129870556" className="text-violet-600 hover:underline">+91 8129870556</a>.
            </div>

          </div>
        </aside>

      </section>
    </div>
  );
}

// Custom chevron down icon replacement component inside page
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
