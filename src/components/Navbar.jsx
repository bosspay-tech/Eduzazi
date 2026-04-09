// Navbar.jsx (light mode)

import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { signOut } from "../features/auth/auth.service";
import { useCartStore } from "../store/cart.store";
import CourseActionBar from "./CourseActionBar";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { user, loading } = useAuth();
  const items = useCartStore((s) => s.items);
  const [open, setOpen] = useState(false);

  const cartCount = useMemo(
    () => items.reduce((sum, it) => sum + (it.qty ?? it.quantity ?? 1), 0),
    [items],
  );

  if (loading) return null;

  const NavItem = ({ to, children, onClick }) => (
    <NavLink
      to={to}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      className={({ isActive }) =>
        cx(
          "rounded-xl px-3 py-2 text-sm font-medium transition",
          "hover:bg-gray-100 hover:text-violet-600",
          isActive ? "bg-gray-100 text-violet-600" : "text-gray-600",
        )
      }
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* BRAND */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-2 py-1 text-lg font-bold text-violet-600 hover:bg-gray-100"
          >
            EDUCAZIONE STUDY ABROD PRIVATE LIMITED
          </Link>
        </div>

        {/* DESKTOP */}
        <div className="hidden items-center gap-2 md:flex">
          <NavItem to="/products">Courses</NavItem>

          <NavItem to="/cart">
            <span className="flex items-center gap-2">
              Cart
              <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            </span>
          </NavItem>

          {user ? (
            <>
              <NavItem to="/orders">My Orders</NavItem>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login">Login</NavItem>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="relative rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      <div className={cx("md:hidden", open ? "block" : "hidden")}>
        <div className="mx-auto max-w-6xl border-t bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-1">
            <NavItem to="/products">Courses</NavItem>

            {user ? (
              <>
                <NavItem to="/orders">My Orders</NavItem>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="mt-2 w-full rounded-xl bg-violet-600 px-4 py-2 text-left text-sm font-medium text-white hover:bg-violet-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavItem to="/login">Login</NavItem>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="mt-2 w-full rounded-xl bg-violet-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-violet-400"
                >
                  Sign up
                </Link>
              </>
            )}

            <p className="mt-3 text-xs text-gray-500">
              Secure checkout • Lifetime access • Expert instructors
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
