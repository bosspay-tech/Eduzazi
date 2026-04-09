import React from "react";

export default function Contact() {
  return (
    <div className="min-h-[70vh] bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            We’re here to help. Reach out using the details below.
          </p>
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Company Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
            <div className="text-xs font-semibold tracking-widest text-slate-400">
              COMPANY
            </div>
            <h2 className="mt-2 text-lg font-extrabold text-white">
              EDUCAZIONE STUDY ABROAD PRIVATE LIMITED
            </h2>

            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div>
                <div className="text-xs font-semibold tracking-widest text-slate-400">
                  ADDRESS
                </div>
                <p className="mt-1 leading-6">
                  Bhageeratha Square
                  <br />
                  First floor , No C 021 67/1717 (old no 41/3197)
                  <br /> Banerji Road,Kacheripady <br /> Cochin-682018
                </p>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-widest text-slate-400">
                  MOBILE
                </div>
                <a
                  href="tel:+918129870556"
                  className="mt-1 inline-flex items-center gap-2 font-semibold text-white hover:text-cyan-300"
                >
                  +91 8129870556
                </a>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-widest text-slate-400">
                  GST REG
                </div>
                <a className="mt-1 inline-flex items-center gap-2 font-semibold text-white hover:text-cyan-300">
                  32AAJCE2888C1ZQ
                </a>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+917048179839"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
              >
                Call Now
              </a>
            </div>
          </div>

          {/* Contact Form (optional/dummy) */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
            <div className="text-xs font-semibold tracking-widest text-slate-400">
              SEND A MESSAGE
            </div>
            <h3 className="mt-2 text-lg font-extrabold text-white">
              We’ll get back within 24–48 hours
            </h3>

            <form className="mt-5 space-y-3">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10"
              />
              <input
                type="text"
                placeholder="Phone number"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10"
              />
              <textarea
                rows="5"
                placeholder="Your message"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10"
              />

              <button
                type="button"
                className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
                onClick={() => alert("Info submitted")}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
