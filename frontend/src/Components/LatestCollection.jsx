import React, { useContext, useEffect, useState } from "react";

import { ShopContext } from "../Context/ShopContext";

import Tittle from "./Tittle";

import ProductItem from "./ProductItem";

import SlideInLeft from "./SlideInLeft";

import { Sparkles } from "lucide-react";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 6));
  }, [products]);

  return (
    <section
      className="
        relative
        my-16
        overflow-hidden
        rounded-[38px]
        border
        border-white/10
        bg-[#0b1018]/90
        px-5
        py-12
        text-white
        backdrop-blur-xl
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
          h-[300px]
          w-[300px]
          rounded-full
          bg-[#aaff5a]/10
          blur-[120px]
        "
      />

      <div
        className="
          absolute
          right-[-120px]
          top-[30%]
          h-[300px]
          w-[300px]
          rounded-full
          bg-[#48c6ef]/10
          blur-[120px]
        "
      />

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <SlideInLeft>
        <div className="relative z-10 text-center">
          <div
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
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-[#aaff5a]
            "
          >
            <Sparkles size={15} />
            Latest Arrivals
          </div>

          <div className="mt-6">
            <Tittle text1="New" text2="Edit" />
          </div>

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
            Fresh arrivals selected for cleaner fits, premium comfort, and
            modern everyday styling.
          </p>
        </div>
      </SlideInLeft>

      {/* ========================= */}
      {/* PRODUCTS GRID */}
      {/* ========================= */}

      <div
        className="
          relative
          z-10
          mt-14
          grid
          grid-cols-1
          md:grid-cols-3
          2xl:grid-cols-3
          gap-10
        "
      >
        {latestProducts.map((item, index) => (
          <SlideInLeft key={index}>
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              averageRating={item.averageRating}
              reviewCount={item.reviewCount}
              totalStock={item.totalStock}
            />
          </SlideInLeft>
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;
