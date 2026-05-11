import React from "react";

import {
  ArrowUpRight,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

import Tittle from "../Components/Tittle";

import { assets } from "../assets/assets";

import NewsletterBox from "../Components/NewsletterBox";

import SlideInLeft from "../Components/SlideInLeft";

const Contact = () => {
  // =========================
  // CONTACT DETAILS
  // =========================

  const contactCards = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 98784 56231",
    },

    {
      icon: Mail,
      label: "Email",
      value: "connect@nexora.store",
    },

    {
      icon: MapPin,
      label: "Location",
      value: "Prahlad Nagar, Ahmedabad",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#070a0f] text-white">
      {/* ========================= */}
      {/* BACKGROUND EFFECTS */}
      {/* ========================= */}

      <div className="absolute left-[-120px] top-[10%] h-[320px] w-[320px] rounded-full bg-[#aaff5a]/10 blur-[120px]" />

      <div className="absolute right-[-120px] top-[40%] h-[320px] w-[320px] rounded-full bg-[#48c6ef]/10 blur-[120px]" />

      {/* ========================= */}
      {/* MAIN CONTAINER */}
      {/* ========================= */}

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 lg:px-10">
        {/* ========================= */}
        {/* HERO */}
        {/* ========================= */}

        <SlideInLeft>
          <div className="text-center">
            {/* Badge */}
            <p
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#aaff5a]/20
                bg-[#aaff5a]/10
                px-5
                py-2
                text-sm
                font-black
                uppercase
                tracking-[0.2em]
                text-[#aaff5a]
              "
            >
              <Sparkles size={15} />
              Contact Nexora
            </p>

            {/* Title */}
            <div className="mt-6">
              <Tittle text1="Talk" text2="To Us" />
            </div>

            {/* Description */}
            <p
              className="
                mx-auto
                mt-6
                max-w-3xl
                text-base
                leading-8
                text-slate-300
                sm:text-lg
              "
            >
              Questions about products, delivery, orders, or sizing? We keep
              support fast, clear, and actually helpful.
            </p>
          </div>
        </SlideInLeft>

        {/* ========================= */}
        {/* MAIN SECTION */}
        {/* ========================= */}

        <SlideInLeft>
          <section
            className="
              mt-16
              grid
              gap-8
              lg:grid-cols-[0.95fr_1.05fr]
              lg:items-center
            "
          >
            {/* ========================= */}
            {/* IMAGE */}
            {/* ========================= */}

            <div className="relative">
              {/* Glow */}
              <div
                className="
                  absolute
                  -bottom-10
                  -left-10
                  h-44
                  w-44
                  rounded-full
                  bg-[#aaff5a]/20
                  blur-3xl
                "
              />

              {/* Image */}
              <img
                className="
                  relative
                  z-10
                  h-full
                  min-h-[420px]
                  w-full
                  rounded-[34px]
                  border
                  border-white/10
                  object-cover
                  shadow-[0_35px_100px_rgba(0,0,0,0.45)]
                "
                src={assets.contact_img1}
                alt="Contact Nexora"
              />

              {/* Floating Card */}
              <div
                className="
                  absolute
                  bottom-6
                  left-6
                  z-20
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/40
                  px-5
                  py-4
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-2 text-[#aaff5a]">
                  <Headphones size={18} />

                  <span className="font-black">Premium customer support</span>
                </div>

                <p className="mt-2 text-sm text-slate-300">
                  Real assistance. No robotic replies.
                </p>
              </div>
            </div>

            {/* ========================= */}
            {/* CONTENT */}
            {/* ========================= */}

            <div
              className="
                rounded-[34px]
                border
                border-white/10
                bg-white/[0.05]
                p-6
                backdrop-blur-xl
                sm:p-8
              "
            >
              {/* Small Heading */}
              <p
                className="
                  text-sm
                  font-black
                  uppercase
                  tracking-[0.28em]
                  text-[#aaff5a]
                "
              >
                Customer Desk
              </p>

              {/* Main Heading */}
              <h2
                className="
                  mt-5
                  text-4xl
                  font-black
                  leading-tight
                  sm:text-5xl
                "
              >
                Let’s solve it
                <br />
                properly.
              </h2>

              {/* Description */}
              <p
                className="
                  mt-6
                  text-base
                  leading-8
                  text-slate-300
                "
              >
                Whether it’s a sizing question, order issue, return, or product
                recommendation — our team is here to help without wasting your
                time.
              </p>

              {/* ========================= */}
              {/* CONTACT GRID */}
              {/* ========================= */}

              <div
                className="
                  mt-10
                  grid
                  gap-5
                  sm:grid-cols-2
                "
              >
                {contactCards.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#10151f]
                        p-5
                        transition
                        hover:border-[#aaff5a]/40
                      "
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div
                        className="
                            grid
                            h-11
                            w-11
                            place-items-center
                            rounded-2xl
                            bg-[#aaff5a]/10
                            text-[#aaff5a]
                          "
                      >
                        <Icon size={20} />
                      </div>

                      {/* Content */}
                      <div>
                        <p className="text-sm text-slate-400">{label}</p>

                        <p className="mt-1 font-black text-white">{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ========================= */}
              {/* BUTTONS */}
              {/* ========================= */}

              <div className="mt-10 flex flex-wrap gap-4">
                {/* Main Button */}
                <button
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#aaff5a]
                    px-7
                    py-3
                    text-sm
                    font-black
                    uppercase
                    tracking-wide
                    text-[#070a0f]
                    transition
                    hover:scale-[1.03]
                  "
                >
                  Message Support
                  <ArrowUpRight
                    size={17}
                    className="
                      transition
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  />
                </button>

                {/* Secondary Button */}
                <button
                  className="
                    rounded-full
                    border
                    border-white/15
                    px-7
                    py-3
                    text-sm
                    font-black
                    uppercase
                    tracking-wide
                    text-white
                    transition
                    hover:border-[#aaff5a]/60
                    hover:text-[#aaff5a]
                  "
                >
                  Track Order
                </button>
              </div>
            </div>
          </section>
        </SlideInLeft>

        {/* ========================= */}
        {/* SUPPORT STRIP */}
        {/* ========================= */}

        <SlideInLeft>
          <section
            className="
              mt-20
              grid
              gap-6
              rounded-[34px]
              border
              border-white/10
              bg-white/[0.04]
              p-7
              backdrop-blur-xl
              md:grid-cols-3
            "
          >
            {/* Left */}
            <div>
              <p
                className="
                  text-sm
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-[#aaff5a]
                "
              >
                Fast replies
              </p>

              <h3 className="mt-3 text-2xl font-black">
                Human support, not canned responses.
              </h3>
            </div>

            {/* Middle */}
            <div className="rounded-2xl bg-[#10151f] p-6">
              <p className="text-sm text-slate-400">Average response</p>

              <h3 className="mt-3 text-3xl font-black text-[#aaff5a]">
                &lt; 6 Hours
              </h3>
            </div>

            {/* Right */}
            <div className="rounded-2xl bg-[#10151f] p-6">
              <p className="text-sm text-slate-400">Customer satisfaction</p>

              <h3 className="mt-3 text-3xl font-black text-[#aaff5a]">99%</h3>
            </div>
          </section>
        </SlideInLeft>

        {/* ========================= */}
        {/* NEWSLETTER */}
        {/* ========================= */}

        <SlideInLeft>
          <div className="mt-20">
            <NewsletterBox />
          </div>
        </SlideInLeft>
      </div>
    </div>
  );
};

export default Contact;
