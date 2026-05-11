import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { assets } from "../assets/assets";
import SlideInLeft from "./SlideInLeft";

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1117] text-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(170,255,90,0.16),transparent_38%),radial-gradient(circle_at_82%_22%,rgba(255,111,97,0.22),transparent_30%)]" />
      <div className="relative grid min-h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex items-center px-6 py-14 sm:px-10 lg:px-14">
          <SlideInLeft>
            <div className="max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#aaff5a]/30 bg-[#aaff5a]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#aaff5a]">
                <Sparkles size={16} />
                Limited edit now live
              </div>

              <h1 className="font-serif text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
                Dress like
                <span className="block text-[#aaff5a]">you meant it.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Nexora brings sharp essentials, statement layers, and everyday
                pieces chosen for presence, comfort, and real repeat wear.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/collection"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#aaff5a] px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-[#080b10] transition hover:bg-white"
                >
                  Shop the edit
                  <ArrowUpRight size={18} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:border-[#ff6f61] hover:text-[#ff6f61]"
                >
                  Why Nexora
                </Link>
              </div>

              <div className="mt-12 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-6">
                {[
                  ["500+", "Style picks"],
                  ["24h", "Dispatch window"],
                  ["4.9", "Buyer trust"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-extrabold text-white">
                      {value}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </SlideInLeft>
        </div>

        <div className="relative min-h-[420px]">
          <img
            className="h-full w-full object-cover"
            src={assets.hero_img1}
            alt="Featured fashion collection"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent lg:bg-gradient-to-r" />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-black/45 p-5 text-white backdrop-blur-md lg:left-auto lg:max-w-xs">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#aaff5a]">
              Signature pick
            </p>
            <h3 className="mt-2 text-xl font-extrabold">
              Built for daily impact
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Clean silhouettes, confident details, and fabric choices that hold
              up.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
