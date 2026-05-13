import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { motion } from "framer-motion";
import SlideInLeft from "./SlideInLeft";
import { Heart, Star } from "lucide-react";

const ProductItem = ({ id, image, name, price, averageRating, reviewCount, totalStock }) => {
  const {
    currency,
    token,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    navigate: contextNavigate,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const activeNavigate = contextNavigate || navigate;

  const wishlistIds = wishlist.map((item) =>
    typeof item === "string" ? item : item._id,
  );
  const isWishlisted = wishlistIds.includes(id);
  const isOutOfStock = totalStock !== undefined && totalStock === 0;

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!token) {
      activeNavigate("/login");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <SlideInLeft>
      <div
        className="
          group relative flex h-full w-full flex-col overflow-hidden
          rounded-[24px] border border-white/10 bg-white
          shadow-[0_12px_35px_rgba(0,0,0,0.12)] transition-all duration-300
          hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(170,255,90,0.16)]
        "
      >
        {/* OUT OF STOCK BADGE */}
        {isOutOfStock && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
            Out of Stock
          </div>
        )}

        {/* WISHLIST BUTTON */}
        <button
          type="button"
          onClick={handleWishlist}
          className={`
            absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center
            rounded-full shadow-lg backdrop-blur transition
            ${isWishlisted
              ? "bg-[#ff6f61] text-white"
              : "bg-white/90 text-[#10151f] hover:bg-[#ff6f61] hover:text-white"
            }
          `}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        <div
          onClick={() => activeNavigate(`/product/${id}`)}
          className="flex h-full cursor-pointer flex-col"
        >
          {/* IMAGE */}
          <div className="overflow-hidden bg-[#10151f]">
            <img
              className={`h-[290px] w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 ${
                isOutOfStock ? "opacity-60" : ""
              }`}
              src={image[0]}
              alt={name}
              loading="lazy"
            />
          </div>

          {/* CONTENT */}
          <div className="flex flex-grow flex-col p-4">
            <h3 className="line-clamp-1 text-[15px] font-black leading-tight text-[#10151f]">
              {name}
            </h3>

            {/* RATING */}
            {(averageRating > 0 || reviewCount > 0) && (
              <div className="mt-1 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className={
                        star <= Math.round(averageRating || 0)
                          ? "fill-[#aaff5a] text-[#aaff5a]"
                          : "fill-slate-200 text-slate-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {averageRating ? averageRating.toFixed(1) : "0"} ({reviewCount || 0})
                </span>
              </div>
            )}

            <p className="mt-2 text-[20px] font-black text-[#ff6f61]">
              {currency}
              {price}
            </p>

            <motion.button
              whileHover={{ x: 4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="
                mt-4 flex w-max items-center gap-2 rounded-full bg-[#10151f]
                px-4 py-2 text-xs font-bold uppercase tracking-wide text-white
                transition-colors duration-300 hover:bg-[#aaff5a] hover:text-[#080b10]
              "
              onClick={(e) => {
                e.stopPropagation();
                activeNavigate(`/product/${id}`);
              }}
            >
              View Details
              <HiArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </SlideInLeft>
  );
};

export default ProductItem;
