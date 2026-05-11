import React, { useContext, useMemo } from "react";

import { Eye, ShoppingBag, ArrowUpRight } from "lucide-react";

import { ShopContext } from "../../Context/ShopContext";

const ProfileRecentlyViewed = () => {
  const { recentlyViewed, products, currency, navigate, addtocart } =
    useContext(ShopContext);

  // =========================
  // FILTER PRODUCTS
  // =========================

  const viewedProducts = useMemo(() => {
    return recentlyViewed
      .map((id) => products.find((product) => product._id === id))
      .filter(Boolean);
  }, [recentlyViewed, products]);

  return (
    <div
      className="
          rounded-[30px]
          border
          border-white/10
          bg-white/[0.05]
          p-8
          backdrop-blur-xl
        "
    >
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2
            className="
                text-3xl
                font-black
                text-white
              "
          >
            Recently Viewed
          </h2>

          <p className="mt-2 text-slate-400">Products you explored recently</p>
        </div>

        <div
          className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-[#aaff5a]/20
              bg-[#aaff5a]/10
              px-5
              py-3
              text-[#aaff5a]
            "
        >
          <Eye size={18} />

          <span className="font-bold">{viewedProducts.length} Viewed</span>
        </div>
      </div>

      {/* ========================= */}
      {/* PRODUCTS */}
      {/* ========================= */}

      {viewedProducts.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {viewedProducts.map((item) => (
            <div
              key={item._id}
              className="
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/10
                    bg-[#10151f]
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#aaff5a]/30
                  "
            >
              {/* IMAGE */}

              <div
                onClick={() => navigate(`/product/${item._id}`)}
                className="
                      group
                      relative
                      cursor-pointer
                      overflow-hidden
                    "
              >
                <img
                  className="
                        aspect-[4/5]
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                  src={item.image[0]}
                  alt=""
                />

                <div
                  className="
                        absolute
                        right-4
                        top-4
                        rounded-full
                        bg-black/50
                        p-2
                        text-white
                        backdrop-blur
                      "
                >
                  <ArrowUpRight size={18} />
                </div>
              </div>

              {/* CONTENT */}

              <div className="p-5">
                <h3
                  className="
                        line-clamp-1
                        text-lg
                        font-bold
                        text-white
                      "
                >
                  {item.name}
                </h3>

                <p
                  className="
                        mt-3
                        text-2xl
                        font-black
                        text-[#ff6f61]
                      "
                >
                  {currency}
                  {item.price}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => addtocart(item._id, item.sizes?.[0])}
                    className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-full
                          bg-[#aaff5a]
                          px-5
                          py-3
                          font-black
                          text-[#070a0f]
                          transition
                          hover:scale-[1.02]
                        "
                  >
                    <ShoppingBag size={18} />
                    Add To Cart
                  </button>

                  <button
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="
                          rounded-full
                          border
                          border-white/10
                          bg-white/[0.05]
                          p-3
                          text-white
                          transition
                          hover:border-[#aaff5a]
                          hover:text-[#aaff5a]
                        "
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
              mt-10
              rounded-[30px]
              border
              border-dashed
              border-white/10
              p-14
              text-center
            "
        >
          <div
            className="
                mx-auto
                grid
                h-20
                w-20
                place-items-center
                rounded-full
                bg-[#aaff5a]/10
                text-[#aaff5a]
              "
          >
            <Eye size={34} />
          </div>

          <h3
            className="
                mt-6
                text-2xl
                font-black
                text-white
              "
          >
            No Recently Viewed Products
          </h3>

          <p className="mt-3 text-slate-400">
            Explore products and they will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileRecentlyViewed;
