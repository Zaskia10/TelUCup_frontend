"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import "./Navbar.css";

const BASE_URL = "https://telucup.telkomuniversity.ac.id";

const navLinks = [
  { label: "Home", href: `${BASE_URL}/` },
  { label: "Pertandingan", href: `${BASE_URL}/matches` },
  { label: "Bagan", href: "/chart" },
  { label: "Peserta", href: `${BASE_URL}/participants` },
  { label: "Galeri", href: `${BASE_URL}/gallery` },
  { label: "Log In", href: `/login` },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/self-assessment") ||
    pathname?.startsWith("/match") ||
    pathname?.startsWith("/verifikasi") ||
    pathname?.startsWith("/onboarding")
  ) {
    return null;
  }

  return (
    <>
      <nav
        className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar__container">
          {/* Logo */}
          <a
            href={BASE_URL}
            className="navbar__brand"
            aria-label="Tel-U Cup - Telkom University"
          >
            <Image
              src="/img/logo_telyu_putih.png"
              alt="Telkom University"
              width={180}
              height={60}
              className="navbar__logo"
              unoptimized
            />
          </a>

          {/* Desktop Navigation */}
          <ul className="navbar__menu">
            {navLinks.map((link) => (
              <li key={link.label} className="navbar__menu-item">
                <a
                  href={link.href}
                  className="navbar__menu-link"
                  target="_self"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger Button (Mobile) */}
          <button
            className={`navbar__toggler ${isMenuOpen ? "navbar__toggler--active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className="navbar__toggler-icon" />
            <span className="navbar__toggler-icon" />
            <span className="navbar__toggler-icon" />
          </button>
        </div>

        {/* Mobile Overlay Menu */}
        <div
          id="mobile-menu"
          className={`navbar__mobile ${isMenuOpen ? "navbar__mobile--open" : ""}`}
          aria-hidden={!isMenuOpen}
        >
          <ul className="navbar__mobile-menu">
            {navLinks.map((link, index) => (
              <li
                key={link.label}
                className="navbar__mobile-item"
                style={{ transitionDelay: isMenuOpen ? `${index * 60}ms` : "0ms" }}
              >
                <a
                  href={link.href}
                  className="navbar__mobile-link"
                  onClick={() => setIsMenuOpen(false)}
                  target="_self"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="navbar-spacer" />
    </>
  );
}
