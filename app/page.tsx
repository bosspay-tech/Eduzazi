"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import {
  Shield,
  Clock,
  Star,
  Sparkles,
  ArrowRight,
  Brain,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Globe,
  Zap,
  ChevronRight,
  PlayCircle,
  Users,
  Briefcase,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  FileText
} from "lucide-react";
import { apiUrl } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  image: string;
  color: string[];
  size: string[];
  category?: string;
  rating?: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl("/api/products?limit=100"));
        const data = await res.json();
        const all = data.products ?? [];
        setProducts(all.slice(0, 3));
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  const heroSlides = [
    {
      title: "Study Abroad Admissions Counseling",
      description: "Complete advisory for international applications. Secure your student visa, locate matching scholarships, and get admitted to top-ranked global universities.",
      icon: Globe,
      color: "from-violet-500 to-indigo-650",
      badge: "Global Admissions",
      image: "/photo2.jfif",
      stats: "5,000+ Placed",
      enrollLink: "/services?category=Study+Abroad",
      categoryName: "Study Abroad",
    },
    {
      title: "College & University Placement Strategy",
      description: "One-on-one sessions to map your career path, build a competitive profile, shortlist prospective colleges, and prepare winning admission portfolios.",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-650",
      badge: "University Advisory",
      image: "/photo3.jpg",
      stats: "98% Success Rate",
      enrollLink: "/services?category=Admission+Counseling",
      categoryName: "Admission Counseling",
    },
    {
      title: "Premium SOP & Personal Essay Review",
      description: "Polish your Statements of Purpose, college essays, and CV with senior admissions consultants. Structure your story to capture selectors' attention.",
      icon: FileText,
      color: "from-amber-500 to-orange-600",
      badge: "Application Polish",
      image: "/photo1.jfif",
      stats: "10k+ Reviews Done",
      enrollLink: "/services?category=Application+Services",
      categoryName: "Application Services",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pt-20 pb-8 md:pt-24 md:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 shadow-sm">
                <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
                <span className="text-violet-750 text-sm font-bold">{heroSlides[currentSlide].badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] transition-all duration-300">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <Users className="h-5 w-5 text-violet-500" />
                  <span className="text-sm font-semibold text-gray-700">{heroSlides[currentSlide].stats}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
                  <span className="text-sm font-semibold text-gray-700">4.9/5 Student Rating</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/services"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-750 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg shadow-violet-600/10 hover:shadow-xl hover:shadow-violet-600/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore Counseling Services
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-200 bg-white text-gray-700 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Learn Our Method
                  <PlayCircle className="h-4 w-4" />
                </Link>
              </div>

              {/* Indicators */}
              <div className="flex items-center gap-3 pt-6">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx
                      ? "w-8 bg-violet-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Content */}
            <div className="relative lg:block">
              <div className="relative perspective-1000">
                <div className="relative h-[500px] w-full">
                  {heroSlides.map((slide, idx) => {
                    let position = "";
                    let translateX = 0;
                    let scale = 1;
                    let opacity = 1;
                    let translateY = 0;

                    if (idx === currentSlide) {
                      position = "z-30";
                      translateX = 0;
                      scale = 1;
                      opacity = 1;
                      translateY = 0;
                    } else if (idx === (currentSlide + 1) % 3) {
                      position = "z-20";
                      translateX = 120;
                      scale = 0.85;
                      opacity = 0.6;
                      translateY = -20;
                    } else {
                      position = "z-10";
                      translateX = -120;
                      scale = 0.7;
                      opacity = 0.3;
                      translateY = -40;
                    }

                    return (
                      <div
                        key={idx}
                        className={`absolute top-0 left-0 w-full transition-all duration-500 ease-out ${position}`}
                        style={{
                          transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                          opacity: opacity,
                        }}
                      >
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                          <div className={`h-2 w-full bg-gradient-to-r ${slide.color}`} />
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-violet-650 text-xs font-bold border border-slate-100">
                                <slide.icon className="h-3.5 w-3.5" />
                                <span>{slide.categoryName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-semibold">4.9</span>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {slide.title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                              {slide.description}
                            </p>
                            <Link
                              href={slide.enrollLink}
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition shadow-sm hover:shadow-md"
                            >
                              Apply For Consultation
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-40"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-40"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Counseling Process Steps */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-violet-600 text-sm font-bold uppercase tracking-wider">How it works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              Simple 4-Step Application
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2">
              Start your pathway to leading institutions in a few simple clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                title: "Choose Counseling Service",
                desc: "Explore our target modules from Study Abroad to SOP Reviews.",
                icon: GraduationCap,
              },
              {
                step: "02",
                title: "Register Your Profile",
                desc: "Create a secure account on our portal to manage your applications.",
                icon: UserCheck,
              },
              {
                step: "03",
                title: "Submit Profile Details",
                desc: "Fill the quick application form detailing your academic history.",
                icon: FileText,
              },
              {
                step: "04",
                title: "Complete Fee & Match",
                desc: "Pay the nominal registration fee to get matched with a consultant.",
                icon: Calendar,
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md border border-slate-100 relative group transition">
                <div className="absolute top-4 right-6 text-slate-100 group-hover:text-violet-100/50 text-5xl font-black transition-colors select-none">
                  {item.step}
                </div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 mb-6 border border-violet-100/30">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-violet-600 text-sm font-bold uppercase tracking-wider">Premium Programs</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                Popular Admission Support
              </h2>
              <p className="text-gray-600 max-w-2xl mt-2">
                Pre-screened guidance modules designed to ease school, university, and visa workloads.
              </p>
            </div>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-750 text-white rounded-xl font-semibold transition shadow-md"
            >
              View All Services
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-3xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-violet-50/60 via-white to-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-violet-600 text-sm font-bold uppercase tracking-wider">Why choose us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              Empowering Global Aspirations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2">
              Everything you need to secure your seat at your dream campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: UserCheck,
                title: "Certified Counselors",
                desc: "Partner with admission professionals holding years of global placement expertise.",
                color: "bg-violet-50 text-violet-600 border border-violet-100/50",
              },
              {
                icon: Globe,
                title: "Global School Networks",
                desc: "We cover admissions across 45+ countries including US, UK, Canada, and Australia.",
                color: "bg-emerald-50 text-emerald-600 border border-emerald-100/50",
              },
              {
                icon: ShieldCheck,
                title: "High Success Rate",
                desc: "Our strategic review ensures optimized profile drafting and document checklists.",
                color: "bg-amber-50 text-amber-600 border border-amber-100/50",
              },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition border border-slate-100">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${benefit.color} mb-5`}>
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-violet-600 text-sm font-bold uppercase tracking-wider">Student Success</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              Hear from our Alumni
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2">
              Join thousands of students who have realized their study abroad dreams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The study abroad counseling was highly organized. My advisor knew exactly how to highlight my GPA and navigate the UK visa process.",
                author: "Priya Sharma",
                role: "Admitted to University College London (UCL)",
                rating: 5,
              },
              {
                text: "Best decision I made. The SOP review service dramatically improved my personal statement flow. The feedback was professional and quick.",
                author: "Rahul Mehta",
                role: "Admitted to University of Toronto",
                rating: 5,
              },
              {
                text: "Highly structured school and university selection guide. They helped me find matching scholarships that cut my tuition by 30%.",
                author: "Anjali Patel",
                role: "Admitted to NYU Stern School of Business",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-650 text-sm leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-bold text-gray-950 text-base">{testimonial.author}</p>
                  <p className="text-xs text-violet-600 font-semibold mt-0.5">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-750 to-indigo-800 rounded-[32px] p-12 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Ready to secure your educational future?
              </h2>
              <p className="text-violet-100 text-lg max-w-2xl mx-auto font-medium">
                Connect with our advisors today. Let us streamline your admissions, documentation, and visa approvals.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-750 rounded-xl font-bold hover:shadow-lg transition hover:scale-105"
              >
                Apply For Counseling Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}