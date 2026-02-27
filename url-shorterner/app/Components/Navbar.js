"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-purple-700 text-white px-4 py-3">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg">
          URL Shortener
        </Link>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 items-center">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/shorten">Shorten</Link>
          <Link href="/contact">Contact</Link>

          {!session ? (
            <Link href="/login">
              <button className="bg-purple-500 rounded-lg px-3 py-1 font-bold">
                Sign In / Up
              </button>
            </Link>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-purple-500 rounded-lg px-3 py-1 font-bold"
            >
              Logout
            </button>
          )}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="flex flex-col gap-4 mt-4 md:hidden">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/shorten" onClick={() => setOpen(false)}>Shorten</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>

          {!session ? (
            <Link href="/login" onClick={() => setOpen(false)}>
              <button className="bg-purple-500 rounded-lg px-3 py-1 font-bold w-fit">
                Sign In / Up
              </button>
            </Link>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/login" });
              }}
              className="bg-purple-500 rounded-lg px-3 py-1 font-bold w-fit"
            >
              Logout
            </button>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
