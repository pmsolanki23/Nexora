import React from "react";

import { ArrowUpRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

import Tittle from "../Components/Tittle";

import NewsletterBox from "../Components/NewsletterBox";

import { assets } from "../assets/assets";

const About = () => {
  const reasons = [
    {
      title: "Edited, not dumped",
      desc: "Every product is intentionally selected so the catalog feels curated instead of overcrowded.",
      icon: Sparkles,
    },

    {
      title: "Built for repeat wear",
      desc: "Comfort, structure, and versatility come first — pieces designed to stay in rotation.",
      icon: ShieldCheck,
    },

    {
      title: "Service with taste",
      desc: "Fast support, transparent communication, and smoother delivery experiences from start to finish.",
      icon: Truck,
    },
  ];

  const stats = [
    ["12K+", "Products shipped"],
    ["4.9★", "Customer rating"],
    ["48H", "Average dispatch"],
  ];

  return (
    <div className="relative overflow-hidden bg-[#070a0f] text-white">
      {/* ========================= */}
      {/* BACKGROUND EFFECTS */}
      {/* ========================= */}

      <div className="absolute left-[-120px] top-[10%] h-[320px] w-[320px] rounded-full bg-[#aaff5a]/10 blur-[120px]" />

      <div className="absolute right-[-120px] top-[40%] h-[320px] w-[320px] rounded-full bg-[#48c6ef]/10 blur-[120px]" />

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#aaff5a]/20 bg-[#aaff5a]/10 px-5 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#aaff5a]">
            <Sparkles size={15} />
            About Nexora
          </p>

          <div className="mt-6">
            <Tittle text1="Designed" text2="Differently" />
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Nexora is a modern commerce experience focused on clean essentials,
            elevated styling, and premium everyday products that feel
            intentional.
          </p>
        </div>

        {/* ========================= */}
        {/* MAIN SECTION */}
        {/* ========================= */}

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          {/* IMAGE */}

          <div className="relative">
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[#aaff5a]/20 blur-3xl" />

            <img
              className="relative z-10 h-full max-h-[650px] w-full rounded-[34px] border border-white/10 object-cover shadow-[0_35px_100px_rgba(0,0,0,0.45)]"
              src={assets.about_img1}
              alt="About Nexora"
            />

            <div className="absolute bottom-6 left-6 z-20 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-300">
                Premium essentials for modern wardrobes
              </p>

              <div className="mt-2 flex items-center gap-2 text-[#aaff5a]">
                <ArrowUpRight size={18} />
                <span className="font-black">Curated fashion experience</span>
              </div>
            </div>
          </div>

          {/* CONTENT */}

          <div className="rounded-[34px] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-xl sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#aaff5a]">
              Our Philosophy
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              Less clutter.
              <br />
              More identity.
            </h2>

            <div className="mt-7 space-y-6 text-base leading-8 text-slate-300">
              <p>
                Nexora was created for people who want sharper choices without
                scrolling through endless noise. We focus on quality,
                presentation, and timeless design language.
              </p>

              <p>
                From curated products to premium packaging and smooth delivery,
                every part of the experience is designed to feel elevated.
              </p>
            </div>

            {/* STATS */}

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map(([number, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-[#10151f] p-5 text-center"
                >
                  <h3 className="text-3xl font-black text-[#aaff5a]">
                    {number}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* REASONS */}
        {/* ========================= */}

        <div className="mt-24">
          <div className="mb-10 text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#aaff5a]">
              Why customers stay
            </p>

            <h2 className="mt-3 text-4xl font-black">
              More than just another store
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {reasons.map(({ title, desc, icon: Icon }) => (
              <div
                key={title}
                className="group rounded-[30px] border border-white/10 bg-white/[0.05] p-7 transition duration-500 hover:-translate-y-2 hover:border-[#aaff5a]/40 hover:bg-[#10151f]"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#aaff5a]/10 text-[#aaff5a]">
                  <Icon size={26} />
                </div>

                <h3 className="mt-6 text-2xl font-black">{title}</h3>

                <p className="mt-4 text-base leading-8 text-slate-300">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* NEWSLETTER */}
      {/* ========================= */}

      <div className="relative z-10 pb-16">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;
