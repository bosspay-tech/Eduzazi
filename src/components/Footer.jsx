// Footer.jsx (dark electronics theme)
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Top */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-2 py-1 text-lg font-bold text-violet-600 hover:bg-gray-100"
            >
              EDUCAZIONE STUDY ABROD PRIVATE LIMITED
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Genuine components, secure packing, and quick dispatch. Built for
              makers, students, and production teams.
            </p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="text-xs font-semibold text-white">
                Registered Office
              </div>

              <div className="mt-2 text-xs text-slate-300 leading-5">
                Bhageeratha Square
                <br />
                First floor , No C 021 67/1717 (old no 41/3197)
                <br />
                Banerji Road,Kacheripady
                <br />
                Cochin-682018
              </div>

              <div className="mt-3 text-xs text-slate-300">
                📞 +91 8129870556
              </div>

              <div className="mt-1 text-xs text-slate-300">
                GST REG: 32AAJCE2888C1ZQ
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                🔒 Secure payments
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                ⚡ Fast dispatch
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
                🧯 ESD-safe packing
              </span>
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h4 className="text-sm font-bold text-white">Shop</h4>
                <ul className="mt-4 space-y-2.5 text-sm">
                  <li>
                    <Link
                      className="text-slate-300 hover:text-white"
                      to="/products"
                    >
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-slate-300 hover:text-white"
                      to="/cart"
                    >
                      Cart
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-slate-300 hover:text-white"
                      to="/orders"
                    >
                      Orders
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">Support</h4>
                <ul className="mt-4 space-y-2.5 text-sm">                  
                  <li>
                    <Link
                      className="text-slate-300 hover:text-white"
                      to="/returns-refunds"
                    >
                      Returns & Refunds
                    </Link>
                  </li>
                </ul>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="text-xs font-semibold text-white">
                    Customer care
                  </div>
                  <div className="mt-1 text-xs text-slate-300">
                    Email: support@educazi.com
                  </div>
                  <div className="mt-1 text-xs text-slate-300">
                    Hours: Mon–Sat • 10am–6pm
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">Company</h4>
                <ul className="mt-4 space-y-2.5 text-sm">
                  <li>
                    <Link
                      className="text-slate-300 hover:text-white"
                      to="/privacy-policy"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-slate-300 hover:text-white"
                      to="/terms-of-service"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-slate-300 hover:text-white"
                      to="/contact"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>

                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200 backdrop-blur">
                    ✅ Quality checked
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200 backdrop-blur">
                    🧾 GST invoice
                  </span>
                </div>
              </div>
            </div>

            {/* Mini bar */}
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { t: "Fast dispatch", d: "Within 24–48 hours" },
                { t: "Secure packing", d: "ESD + bubble wrap" },
                { t: "Secure checkout", d: "UPI / Cards / Wallets" },
              ].map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="text-sm font-semibold text-white">{x.t}</div>
                  <div className="mt-1 text-xs text-slate-300">{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            © {year} ElectroStore. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <Link className="hover:text-white" to="/privacy-policy">
              Privacy
            </Link>
            <span className="text-slate-700">•</span>
            <Link className="hover:text-white" to="/terms-of-service">
              Terms
            </Link>
            <span className="text-slate-700">•</span>
            <Link className="hover:text-white" to="/returns-refunds">
              Returns
            </Link>
            <span className="text-slate-700">•</span>                   
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
              Visa / Mastercard / UPI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
