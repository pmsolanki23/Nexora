/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import SlideInLeft from "./SlideInLeft";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerRef = useRef(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowButton(entry.isIntersecting),
      { root: null, threshold: 0.1 },
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="relative mt-32 border-t border-white/10 bg-[#080b10] px-4 py-14 text-slate-300 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"
    >
      <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr]">
        <SlideInLeft>
          <div>
            <div className="mb-5 flex items-center gap-3">
              <img className="w-16" src={assets.logo} alt="Nexora logo" />
              <div>
                <p className="text-2xl font-black text-white">NEXORA</p>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#aaff5a]">
                  Curated street essentials
                </p>
              </div>
            </div>
            <p className="max-w-md leading-7 text-slate-400">
              We curate wearable pieces with sharper cuts, cleaner utility, and
              enough attitude to make simple outfits feel intentional.
            </p>
          </div>
        </SlideInLeft>

        <SlideInLeft>
          <div>
            <p className="mb-5 text-lg font-extrabold text-white">Shop</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/collection" className="hover:text-[#aaff5a]">
                  New Edit
                </Link>
              </li>
              <li>
                <Link to="/collection" className="hover:text-[#aaff5a]">
                  Best Picks
                </Link>
              </li>
              <li>
                <Link to="/collection" className="hover:text-[#aaff5a]">
                  Daily Essentials
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#aaff5a]">
                  Your Cart
                </Link>
              </li>
            </ul>
          </div>
        </SlideInLeft>

        <SlideInLeft>
          <div>
            <p className="mb-5 text-lg font-extrabold text-white">Company</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-[#aaff5a]">
                  Our Taste
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#aaff5a]">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/order" className="hover:text-[#aaff5a]">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#aaff5a]">
                  Account
                </Link>
              </li>
            </ul>
          </div>
        </SlideInLeft>

        <SlideInLeft>
          <div>
            <p className="mb-5 text-lg font-extrabold text-white">
              Customer Desk
            </p>
            <ul className="mb-5 flex flex-col gap-2 text-sm text-slate-400">
              <li>+91 98784 56231</li>
              <li>connect@nexora.store</li>
              <li>Prahlad Nagar , Ahmedabad</li>
            </ul> 
            <div className="flex gap-3 text-xl text-[#aaff5a]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/5 p-2 hover:text-[#ff6f61]"
              >
                <FaFacebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/5 p-2 hover:text-[#ff6f61]"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/5 p-2 hover:text-[#ff6f61]"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/5 p-2 hover:text-[#ff6f61]"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </SlideInLeft>
      </div>

      <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-sm text-slate-500 sm:flex-row">
        <SlideInLeft>
          <p>Copyright @2026 Nexora. Curated with intent.</p>
        </SlideInLeft>
        <p>Premium essentials. Clear service. No noise.</p>
      </div>

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-[#aaff5a] px-4 py-3 text-xl font-black text-[#080b10] shadow-md transition hover:bg-white"
          title="Back to Top"
        >
          ^
        </button>
      )}
    </footer>
  );
};

export default Footer;
