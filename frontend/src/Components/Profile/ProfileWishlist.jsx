import React, { useContext, useMemo } from "react";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { ShopContext } from "../../Context/ShopContext";

const ProfileWishlist = () => {
  const {
    wishlist,
    products,
    removeFromWishlist,
    addtocart,
    currency,
    navigate,
  } = useContext(ShopContext);

  // =========================
  // FILTER PRODUCTS
  // =========================

  const wishlistProducts = useMemo(() => {
    return wishlist
      .map((item) => {
        if (typeof item === "string") {
          return products.find((product) => product._id === item);
        }

        return item;
      })
      .filter(Boolean);
  }, [wishlist, products]);

  return (
    <div
      className="
          rounded-[30px]
          border
          border-white/10
          bg-white/[0.05]
          p-6
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
            Wishlist
          </h2>

          <p className="mt-2 text-slate-400">Your saved premium picks</p>
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
          <Heart size={18} />

          <span className="font-bold">{wishlistProducts.length} Saved</span>
        </div>
      </div>

      {/* ========================= */}
      {/* PRODUCTS */}
      {/* ========================= */}

      {wishlistProducts.length > 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {wishlistProducts.map((item) => (
            <div
              key={item._id}
              className="
                    overflow-hidden
                    rounded-[22px]
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
                      cursor-pointer
                      overflow-hidden
                    "
              >
                <img
                  className="

  h-[260px]
  w-full
  object-cover
  transition
  duration-500
  hover:scale-105

                      "
                  src={item.image[0]}
                  alt=""
                />
              </div>

              {/* CONTENT */}

              <div className="p-4">
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
                        mt-2
                        text-2xl
                        font-black
                        text-[#ff6f61]
                      "
                >
                  {currency}
                  {item.price}
                </p>

                {/* BUTTONS */}

                <div className="mt-4 flex gap-3">
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
                          py-2.5
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
                    onClick={() => removeFromWishlist(item._id)}
                    className="
                          rounded-full
                          border
                          border-red-500/20
                          bg-red-500/10
                          p-2.5
                          text-red-500
                          transition
                          hover:bg-red-500
                          hover:text-white
                        "
                  >
                    <Trash2 size={18} />
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
            <Heart size={34} />
          </div>

          <h3
            className="
                mt-6
                text-2xl
                font-black
                text-white
              "
          >
            Wishlist Empty
          </h3>

          <p className="mt-3 text-slate-400">
            Save products you love and access them anytime.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileWishlist;
