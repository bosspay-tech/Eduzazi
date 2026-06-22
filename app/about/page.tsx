'use client';

import Navbar from "@/components/navbar";
import { GraduationCap, Shield, Award, Heart, Globe, Users, Zap, Sparkles, BookOpen, Quote } from "lucide-react";

export default function AboutPage() {

  const sections = [
    {
      icon: <BookOpen className="h-6 w-6 text-violet-600" />,
      title: "Our Story & Vision",
      content: "EDUCAZIONE STUDY ABROAD PRIVATE LIMITED is dedicated to helping students and professionals navigate international admissions. Through our tailored profile evaluations, admissions strategy coaching, and professional SOP and essay reviews, we ensure you are ready to succeed at top global universities."
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-violet-600" />,
      title: "Our Mission",
      content: "Our mission is to equip ambitious students with premium profiling, visa advisory, and university placement strategies that bridge international potential with world-class academic institutions."
    },
    {
      icon: <Shield className="h-6 w-6 text-violet-600" />,
      title: "Academic Rigor",
      content: "Every counseling strategy is structured to highlight your academic potential and align with the criteria of leading international admissions boards, ensuring an optimized path to acceptance."
    },
    {
      icon: <Award className="h-6 w-6 text-violet-600" />,
      title: "World-Class Quality",
      content: "We collaborate with experienced senior consultants to deliver custom university matching, structured document critiques, and mock interview preparations directly to your portal."
    },
    {
      icon: <Heart className="h-6 w-6 text-violet-600" />,
      title: "Student Centricity",
      content: "Your global university placement is our direct mission. We provide end-to-end support for profile building, scholarship matching, and application details so you can apply with confidence."
    },
    {
      icon: <Globe className="h-6 w-6 text-violet-600" />,
      title: "Global Opportunities",
      content: "Our counseling pathways are specifically tailored to placement requirements across major international hubs including the US, UK, Canada, Europe, and Australia."
    },
    {
      icon: <Users className="h-6 w-6 text-violet-600" />,
      title: "Inclusive Learning",
      content: "We offer highly personalized, structured admissions advisory packages so every aspirant can maximize their chances of securing seat offers."
    },
    {
      icon: <Zap className="h-6 w-6 text-violet-600" />,
      title: "Premium Delivery",
      content: "Get matched with your dedicated admissions counselor immediately and track your profiling reviews and application updates directly on your dashboard."
    }
  ];

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
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-slate-800">
                Academic Center
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About Us
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Preparing ambitions for a borderless world with professional admission counseling, profiling, and global placement support.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">

            {/* Introduction */}
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <p className="text-lg text-slate-600 leading-relaxed">
                At <strong>EDUCAZIONE STUDY ABROAD PRIVATE LIMITED</strong>, we aim to deliver high-quality study abroad consulting, SOP review services, and university admission strategy support.
              </p>
            </div>

            {/* Story/Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {sections.map((section, idx) => (
                <div key={idx} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-100 transition-colors">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-900 mb-2">
                        {section.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Note Card */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-violet-50 to-slate-50 rounded-2xl p-8 border border-violet-100 shadow-sm">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Quote className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl mb-3">Academic Board Note</h3>
                    <p className="text-base text-slate-600 leading-relaxed italic">
                      "Education is not just preparation for life; education is life itself. We prepare you to make a lasting impact globally."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}