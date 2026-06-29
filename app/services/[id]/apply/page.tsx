'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';
import { Loader, Shield, Sparkles, BookOpen, User, Phone, Mail, Calendar, School, HelpCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { apiUrl, authHeaders } from '@/lib/api';
import { startEasebuzzPayment } from '@/lib/payments';

interface Service {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const COUNTRIES = [
  'United States (USA)',
  'United Kingdom (UK)',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Singapore',
  'Ireland',
  'New Zealand',
  'Other / Domestic',
];

const QUALIFICATIONS = [
  'High School (10th/12th)',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate (PhD)',
  'Other Professional Certifications',
];

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: session, status } = useSession();
  const [service, setService] = useState<Service | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [highestQualification, setHighestQualification] = useState(QUALIFICATIONS[2]);
  const [currentInstitution, setCurrentInstitution] = useState('');
  const [passingYear, setPassingYear] = useState(new Date().getFullYear().toString());
  const [gpaOrPercentage, setGpaOrPercentage] = useState('');
  const [preferredCountry, setPreferredCountry] = useState(COUNTRIES[0]);
  const [preferredCourse, setPreferredCourse] = useState('');
  const [sopOrEssayText, setSopOrEssayText] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const returnUrl = `/services/${id}/apply`;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [status, router, id]);

  useEffect(() => {
    const fetchLastApplication = async () => {
      try {
        const res = await fetch(apiUrl('/api/counseling/applications'), {
          headers: authHeaders(session?.user?.id),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.applications && data.applications.length > 0) {
            const lastApp = data.applications[0];
            
            if (lastApp.fullName) setFullName(lastApp.fullName);
            if (lastApp.email) setEmail(lastApp.email);
            if (lastApp.phone) {
              const rawPhone = lastApp.phone.startsWith('+91') 
                ? lastApp.phone.slice(3) 
                : lastApp.phone;
              setPhone(rawPhone);
            }
            if (lastApp.dob) {
              setDob(lastApp.dob.split('T')[0]);
            }
            if (lastApp.gender) setGender(lastApp.gender);
            if (lastApp.highestQualification) setHighestQualification(lastApp.highestQualification);
            if (lastApp.currentInstitution) setCurrentInstitution(lastApp.currentInstitution);
            if (lastApp.passingYear) setPassingYear(lastApp.passingYear.toString());
            if (lastApp.gpaOrPercentage) setGpaOrPercentage(lastApp.gpaOrPercentage);
            if (lastApp.preferredCountry) setPreferredCountry(lastApp.preferredCountry);
            if (lastApp.preferredCourse) setPreferredCourse(lastApp.preferredCourse);
            if (lastApp.sopOrEssayText) setSopOrEssayText(lastApp.sopOrEssayText);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching past application details:', error);
      }

      if (session?.user) {
        setFullName(session.user.name || '');
        setEmail(session.user.email || '');
      }
    };

    if (status === 'authenticated' && session?.user?.id) {
      fetchLastApplication();
    }
  }, [status, session]);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const res = await fetch(apiUrl(`/api/products/${id}`));
        if (!res.ok) {
          throw new Error('Service detail fetch failed');
        }
        const data = await res.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
        toast.error('Failed to load counseling service details');
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim() || !dob || !highestQualification || !currentInstitution.trim() || !passingYear || !gpaOrPercentage.trim()) {
      toast.error('Please fill in all mandatory profile details');
      return;
    }

    if (fullName.trim().length < 2) {
      toast.error('Name must be at least 2 characters long.');
      return;
    }

    if (phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }

    const yearNum = parseInt(passingYear, 10);
    if (isNaN(yearNum) || yearNum < 1980 || yearNum > 2035) {
      toast.error('Please enter a valid passing/graduation year.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/counseling/apply'), {
        method: 'POST',
        headers: authHeaders(session?.user?.id),
        body: JSON.stringify({
          serviceId: id,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: `+91${phone}`,
          dob,
          gender,
          highestQualification,
          currentInstitution: currentInstitution.trim(),
          passingYear: yearNum,
          gpaOrPercentage: gpaOrPercentage.trim(),
          preferredCountry,
          preferredCourse: preferredCourse.trim(),
          sopOrEssayText: sopOrEssayText.trim(),
          additionalNotes: additionalNotes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to submit application');
        return;
      }

      toast.success('Profile details saved! Opening secure payment gateway...');
      await startEasebuzzPayment(
        {
          applicationId: data.application.applicationId,
          amount: service.price,
          productinfo: service.name,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: `+91${phone}`,
        },
        session?.user?.id
      );
    } catch (error) {
      console.error('Submit application error:', error);
      toast.error('An error occurred during submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || status === 'loading' || pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader className="h-12 w-12 text-primary mx-auto animate-spin" />
          <p className="mt-4 text-muted-foreground text-sm font-semibold">Loading registration form...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !service) {
    return null;
  }

  const isSopReview = service.name.toLowerCase().includes('sop') || service.name.toLowerCase().includes('essay');

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Progress Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest bg-violet-100/60 px-3 py-1 rounded-full border border-violet-200">Step 1 of 2</span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Registration Profile Form</h1>
            <p className="text-sm text-slate-500 mt-1">Provide your academic records & targets to assign your consultant advisor.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-5 py-3 border border-slate-200 rounded-2xl shadow-sm">
            <img src={service.image} className="w-10 h-10 object-cover rounded-xl" alt="" />
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{service.category}</span>
              <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{service.name}</h4>
              <p className="text-sm font-black text-violet-600">Fee: ₹{service.price.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: Candidate Basic details */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <User className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Personal Information</h3>
                    <p className="text-xs text-slate-400">Basic contact profile details.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value.replace(/[0-9]/g, ''))}
                      required
                      placeholder="Enter candidate name"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        readOnly
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-sm font-semibold cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">+91</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          required
                          maxLength={10}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-13 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Date of Birth *</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Gender *</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition cursor-pointer"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Educational Background */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <School className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Academic Background</h3>
                    <p className="text-xs text-slate-400">Your current level and marks checklist.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Highest Qualification *</label>
                      <select
                        value={highestQualification}
                        onChange={(e) => setHighestQualification(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition cursor-pointer"
                      >
                        {QUALIFICATIONS.map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Grade / CGPA / % Marks *</label>
                      <input
                        type="text"
                        value={gpaOrPercentage}
                        onChange={(e) => setGpaOrPercentage(e.target.value)}
                        required
                        placeholder="e.g. 8.5 CGPA or 85%"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Current School / College Name *</label>
                      <input
                        type="text"
                        value={currentInstitution}
                        onChange={(e) => setCurrentInstitution(e.target.value)}
                        required
                        placeholder="Enter school/college name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Graduation / Passing Year *</label>
                      <input
                        type="number"
                        value={passingYear}
                        onChange={(e) => setPassingYear(e.target.value)}
                        required
                        placeholder="e.g. 2026"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Preferences / Targets */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Sparkles className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Admissions Preferences</h3>
                    <p className="text-xs text-slate-400">Target target country and course stream.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Preferred Study Destination</label>
                      <select
                        value={preferredCountry}
                        onChange={(e) => setPreferredCountry(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition cursor-pointer"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Target Course / Major (Optional)</label>
                      <input
                        type="text"
                        value={preferredCourse}
                        onChange={(e) => setPreferredCourse(e.target.value)}
                        placeholder="e.g. MSc Computer Science"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Service Specific (SOP/Essay Draft Area) */}
              {isSopReview && (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                      <FileText className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">SOP / Essay Draft Details</h3>
                      <p className="text-xs text-slate-400">Paste your statement drafts below for evaluation.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">SOP Draft Content (Mandatory for Review)</label>
                    <textarea
                      value={sopOrEssayText}
                      onChange={(e) => setSopOrEssayText(e.target.value)}
                      required={isSopReview}
                      rows={8}
                      placeholder="Paste your current draft essay here (at least 200 words recommended)..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Section 5: Additional Notes */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <HelpCircle className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Questions or Notes for Counselor</h3>
                    <p className="text-xs text-slate-400">Any specific targets you want them to review.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Notes & Additional Requests (Optional)</label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={4}
                    placeholder="Enter any questions regarding profiling, visa, dates, or specific universities..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm font-semibold transition leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 text-white rounded-xl hover:bg-violet-750 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition font-bold text-lg shadow-lg shadow-violet-650/10 cursor-pointer"
              >
                {loading && <Loader className="h-5 w-5 animate-spin" />}
                {loading ? 'Submitting Form...' : `Proceed to Pay Fee - ₹${Math.round(service.price).toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>

          {/* Right Summary Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6 sticky top-24">
              <h3 className="font-bold text-gray-900 border-b border-slate-100 pb-3">Counseling Package</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Assigned Service</span>
                  <p className="text-sm font-extrabold text-gray-800 leading-snug">{service.name}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Admissions Category</span>
                  <p className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg w-fit border border-violet-100">{service.category}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Application Form Fee</span>
                  <span>₹{Math.round(service.price).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Advisory Setup Tax</span>
                  <span className="text-green-600 font-bold">₹0 (Included)</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-gray-900">
                  <span>Total Due</span>
                  <span>₹{Math.round(service.price).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-150 p-4 space-y-3">
                <div className="flex gap-2.5">
                  <Shield className="h-4.5 w-4.5 text-violet-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                    Submitted form profile details are immediately encrypted and forwarded to assigned counselors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
