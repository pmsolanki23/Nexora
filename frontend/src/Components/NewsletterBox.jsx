import React from "react";
import SlideInLeft from "./SlideInLeft";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <SlideInLeft>
      <div className="mx-auto max-w-3xl rounded-[28px] border border-[#aaff5a]/30 bg-[#aaff5a] px-6 py-12 text-center text-[#080b10] shadow-[0_24px_70px_rgba(170,255,90,0.18)]">
        <h3 className="mb-4 text-sm font-black uppercase tracking-[0.28em]">
          Private drop list
        </h3>
        <p className="text-3xl font-black sm:text-4xl">
          First access, sharper picks, fewer inbox fillers.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#1b2512] sm:text-lg">
          We send only the edits worth opening: new arrivals, quiet discounts,
          and limited releases.
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 sm:flex-row"
        >
          <input
            className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-[#080b10] outline-none sm:text-base"
            type="email"
            placeholder="Your email"
            required
          />
          <button
            type="submit"
            className="rounded-xl bg-[#080b10] px-7 py-3 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-[#ff6f61]"
          >
            Join list
          </button>
        </form>
      </div>
    </SlideInLeft>
  );
};

export default NewsletterBox;
