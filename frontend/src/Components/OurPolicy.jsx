import React from "react";
import { assets } from "../assets/assets";
import SlideInLeft from "./SlideInLeft";
import Tittle from "./Tittle";

const policyItems = [
  {
    img: assets.exchange_icon,
    title: "Fit Flex",
    desc: "Size or style missed the mark? Exchanges stay simple and fast.",
    alt: "Exchange Icon",
  },
  {
    img: assets.quality_icon,
    title: "30 Day Window",
    desc: "Try it at home and keep only what genuinely earns a place.",
    alt: "Return Policy Icon",
  },
  {
    img: assets.support_img,
    title: "Real Help",
    desc: "No robotic runaround: clear answers from people who know the catalog.",
    alt: "Support Icon",
  },
];

const OurPolicy = () => {
  return (
    <SlideInLeft>
      <div className="my-10 rounded-[28px] border border-white/10 bg-[#10151f] px-4 py-10 text-white">
        <div className="py-6 text-center text-3xl">
          <Tittle text1="Shop" text2="Safely" />
          <p className="m-auto mt-2 w-11/12 text-xs text-slate-300 sm:w-3/4 sm:text-sm md:text-base">
            Good style should not come with checkout anxiety. We keep the
            after-sale part clean.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {policyItems.map(({ img, title, desc, alt }, index) => (
            <SlideInLeft key={index}>
              <div className="mx-auto flex h-full max-w-xs flex-col items-center rounded-2xl border border-white/10 bg-white/[0.06] p-7 text-center transition duration-300 hover:-translate-y-1 hover:border-[#aaff5a]/50">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#aaff5a]">
                  <img
                    src={img}
                    alt={alt}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-white">
                  {title}
                </h3>
                <p className="text-sm leading-6 text-slate-300">{desc}</p>
              </div>
            </SlideInLeft>
          ))}
        </div>
      </div>
    </SlideInLeft>
  );
};

export default OurPolicy;
