"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CartButton from "./CartButton"; // Your existing cart button
import clsx from "clsx"; // Optional: for conditional class merging

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "Prescriptions", href: "/prescriptions" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Dimples-logo.svg" // You can change to /logo.svg if needed
            alt="Dimples Pharmacy"
            width={40}
            height={40}
          />
          <span className="font-bold text-xl hidden sm:inline">
            Dimples Pharmacy
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "hover:text-accent transition",
                pathname === href && "text-accent font-semibold"
              )}
            >
              {label}
            </Link>
          ))}
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
