'use client';

import Navbar from "@/components/navbar";
import { apiUrl } from "@/lib/api";
import {
  Mail,
  Phone,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
  Headphones,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success(data.message || "Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message. Please try again.",
      );
      console.error("Contact form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between text-foreground">
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-50 border-b border-slate-100 py-16 md:py-24">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <Headphones className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-slate-800">
                Student Helpdesk
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about profile match, consultation scheduling, or study abroad admissions? Our team is here to help.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Contact Grid Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
              <div className="grid lg:grid-cols-5 gap-10">

                {/* Form Column */}
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Send a Message</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Fill in the details below and we will get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Full Name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition ${errors.name ? "border-red-500" : "border-slate-200"
                            }`}
                          placeholder="e.g. SN Snow"
                        />
                        {errors.name && (
                          <p className="text-xs text-red-505 flex items-center gap-1 mt-1 font-medium">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition ${errors.email ? "border-red-500" : "border-slate-200"
                            }`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-xs text-red-505 flex items-center gap-1 mt-1 font-medium">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Subject *
                      </label>
                      <input
                        id="subject"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition ${errors.subject ? "border-red-500" : "border-slate-200"
                          }`}
                        placeholder="How can we assist you?"
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-505 flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Detailed Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition resize-none ${errors.message ? "border-red-500" : "border-slate-200"
                          }`}
                        placeholder="Provide detailed description of your query..."
                      />
                      {errors.message && (
                        <p className="text-xs text-red-505 flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full px-6 py-3.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition duration-300 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 pt-1">
                      <CheckCircle className="h-4 w-4 text-violet-600" />
                      <span>We will never share your personal information.</span>
                    </div>
                  </form>
                </div>

                {/* Sidebar Info Column */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Direct Contact Info */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                    <h3 className="font-bold text-gray-900 text-lg">Direct Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Support</span>
                          <a href="mailto:support@educazi.com" className="text-sm font-semibold text-slate-700 hover:text-violet-600 transition truncate block">
                            support@educazi.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Call Helpline</span>
                          <a href="tel:+918129870556" className="text-sm font-semibold text-slate-700 hover:text-violet-600 transition">
                            +91 8129870556
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-violet-600" />
                      <h4 className="font-bold text-gray-900 text-sm">Office Hours</h4>
                    </div>
                    <div className="divide-y divide-slate-200 text-xs font-semibold text-slate-600">
                      <div className="flex justify-between py-2">
                        <span>Mon - Fri</span>
                        <span className="text-gray-900 font-bold">10 AM - 7 PM</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Saturday</span>
                        <span className="text-gray-900 font-bold">10 AM - 5 PM</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Sunday</span>
                        <span className="text-red-500 font-bold">Closed</span>
                      </div>
                    </div>
                  </div>

                  {/* Headquarters HQ */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-wider">
                      Cochin Office
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm">Admissions HQ</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      Bhageeratha Square, First floor, No C 021 67/1717 (old no 41/3197), Banerji Road, Kacheripady, Cochin - 682018
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <Globe className="h-4 w-4 text-violet-600" />
                      <span>GST REG: 32AAJCE2888C1ZQ</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Accordion FAQ Section */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Sparkles className="h-6 w-6 text-violet-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">Admissions FAQ</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Quick answers to common counseling and registration questions.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: "How do I connect with my assigned counselor?",
                    a: "Once you register and pay the fee, a counselor specializing in your destination country is assigned. They will reach out to you via email or phone within 24 hours to schedule the initial consultation.",
                  },
                  {
                    q: "What countries do you support for counseling?",
                    a: "We support admissions and visa counseling for 45+ countries, including the USA, UK, Canada, Australia, Germany, France, Ireland, Singapore, and New Zealand.",
                  },
                  {
                    q: "Can I pay using online banking or cards?",
                    a: "Yes, we support major digital wallets, UPI, and credit/debit cards during registration.",
                  },
                  {
                    q: "Is there any support available for students?",
                    a: "Yes, our admissions office is here to help. Reach out via support@educazi.com or call +91 8129870556.",
                  },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                      <span className="text-sm md:text-base">
                        {faq.q}
                      </span>
                      <div className="w-6 h-6 rounded-lg bg-slate-50 text-slate-500 group-open:rotate-180 transition-transform flex items-center justify-center">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </summary>
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}