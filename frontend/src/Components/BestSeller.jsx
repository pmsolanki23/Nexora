import React, { useContext, useEffect, useState } from "react";

import { ShopContext } from "../Context/ShopContext";

import Tittle from "./Tittle";

import ProductItem from "./ProductItem";

import SlideInLeft from "../Components/SlideInLeft";

import { Crown, Flame } from "lucide-react";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);

    setBestSeller(bestProduct.slice(0, 3));
  }, [products]);

  return (
    <SlideInLeft>
      <section
        className="
          relative
          my-16
          overflow-hidden
          rounded-[40px]
          border
          border-[#ff6f61]/15
          bg-[#0b1018]
          px-5
          py-10
          text-white
          shadow-[0_30px_90px_rgba(0,0,0,0.25)]
          sm:px-8
          lg:px-10
        "
      >
        {/* ========================= */}
        {/* BACKGROUND EFFECTS */}
        {/* ========================= */}

        <div
          className="
            absolute
            left-[-120px]
            top-[10%]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[#ff6f61]/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            right-[-120px]
            bottom-[10%]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[#aaff5a]/10
            blur-[120px]
          "
        />

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="relative z-10 text-center">
          {/* TAG */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#ff6f61]/20
              bg-[#ff6f61]/10
              px-5
              py-2
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-[#ff6f61]
            "
          >
            <Flame size={15} />
            Trending Right Now
          </div>

          {/* TITLE */}

          <div className="mt-6">
            <Tittle text1="Most" text2="Wanted" />
          </div>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-5
              max-w-3xl
              text-sm
              leading-7
              text-slate-300
              sm:text-base
            "
          >
            The pieces customers keep selecting: cleaner silhouettes, premium
            comfort, and elevated essentials designed to stay in rotation.
          </p>
        </div>

        {/* ========================= */}
        {/* FEATURE STRIP */}
        {/* ========================= */}

        <div
          className="
            relative
            z-10
            mt-10
            grid
            gap-5
            rounded-[30px]
            border
            border-white/10
            bg-white/[0.04]
            p-4
            backdrop-blur-xl
            md:grid-cols-3
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                grid
                h-14
                w-14
                place-items-center
                rounded-2xl
                bg-[#ff6f61]/10
                text-[#ff6f61]
              "
            >
              <Crown size={24} />
            </div>

            <div>
              <h3 className="text-lg font-black">Premium Picks</h3>

              <p className="mt-1 text-sm text-slate-400">
                Curated for standout everyday wear
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#10151f] p-5 text-center">
            <p className="text-sm text-slate-400">Customer Rating</p>

            <h3 className="mt-2 text-3xl font-black text-[#ff6f61]">4.9★</h3>
          </div>

          <div className="rounded-2xl bg-[#10151f] p-5 text-center">
            <p className="text-sm text-slate-400">Repeat Buyers</p>

            <h3 className="mt-2 text-3xl font-black text-[#aaff5a]">82%</h3>
          </div>
        </div>

        {/* ========================= */}
        {/* PRODUCT GRID */}
        {/* ========================= */}

        <div
          className="
            relative
            z-10
            mt-10
            grid
            grid-cols-1
            md:grid-cols-3
            2xl:grid-cols-3
            gap-6
          "
        >
          {bestSeller.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      </section>
    </SlideInLeft>
  );
};

export default BestSeller;
