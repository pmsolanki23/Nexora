// import React, { useContext } from 'react';
// import { ShopContext } from '../Context/ShopContext';
// import { useNavigate } from 'react-router-dom';
// import { HiArrowRight } from 'react-icons/hi';
// // eslint-disable-next-line no-unused-vars
// import { motion } from 'framer-motion';
// import SlideInLeft from './SlideInLeft';
// import { Heart } from 'lucide-react';

// const ProductItem = ({ id, image, name, price }) => {
//   const {
//     currency,
//     token,
//     wishlist,
//     addToWishlist,
//     removeFromWishlist,
//     navigate: contextNavigate,
//   } = useContext(ShopContext);
//   const navigate = useNavigate();
//   const activeNavigate = contextNavigate || navigate;
//   const wishlistIds = wishlist.map((item) =>
//     typeof item === "string" ? item : item._id
//   );
//   const isWishlisted = wishlistIds.includes(id);

//   const handleWishlist = (e) => {
//     e.stopPropagation();

//     if (!token) {
//       activeNavigate("/login");
//       return;
//     }

//     if (isWishlisted) {
//       removeFromWishlist(id);
//     } else {
//       addToWishlist(id);
//     }
//   };

//   return (
//     <SlideInLeft>
//       <div
//         className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/95 flex flex-col h-full
//                    shadow-[0_18px_45px_rgba(0,0,0,0.18)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(170,255,90,0.18)]
//                    transition-all duration-300 ease-in-out"
//       >
//         <button
//           type="button"
//           onClick={handleWishlist}
//           className={`absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full shadow-lg backdrop-blur transition ${
//             isWishlisted
//               ? "bg-[#ff6f61] text-white"
//               : "bg-white/90 text-[#10151f] hover:bg-[#ff6f61] hover:text-white"
//           }`}
//           aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//           title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           <Heart size={19} fill={isWishlisted ? "currentColor" : "none"} />
//         </button>

//         <div onClick={() => activeNavigate(`/product/${id}`)} className="cursor-pointer h-full flex flex-col">
//           <div className="overflow-hidden bg-[#10151f] flex-shrink-0">
//             <img
//               className="aspect-[4/5] w-full object-cover transition-transform ease-in-out duration-500 hover:scale-105"
//               src={image[0]}
//               alt={name}
//             />
//           </div>

//           <div className="p-5 flex flex-col flex-grow">
//             <h3 className="text-base font-extrabold mb-2 leading-tight line-clamp-1 text-[#10151f]">
//               {name}
//             </h3>
//             <p className="text-lg font-black text-[#ff6f61]">
//               {currency} {price}
//             </p>

//             <motion.button
//               whileHover={{ x: 6, scale: 1.03 }}
//               transition={{ type: "spring", stiffness: 300 }}
//               className="mt-4 bg-[#10151f] text-white text-sm py-2 px-5 rounded-full
//                          hover:bg-[#aaff5a] hover:text-[#080b10] transition-colors duration-300 w-max
//                          flex items-center gap-2"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 activeNavigate(`/product/${id}`);
//               }}
//             >
//               View Details <HiArrowRight size={18} />
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </SlideInLeft>
//   );
// };

// export default ProductItem;

import React, { useContext } from "react";

import { ShopContext } from "../Context/ShopContext";

import { useNavigate } from "react-router-dom";

import { HiArrowRight } from "react-icons/hi";

import { motion } from "framer-motion";

import SlideInLeft from "./SlideInLeft";

import { Heart } from "lucide-react";

const ProductItem = ({ id, image, name, price }) => {
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

  // =========================
  // WISHLIST
  // =========================

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
          group
          relative
          flex
          h-full
          w-full
          flex-col
          overflow-hidden
          rounded-[24px]
          border
          border-white/10
          bg-white
          shadow-[0_12px_35px_rgba(0,0,0,0.12)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_22px_55px_rgba(170,255,90,0.16)]
        "
      >
        {/* ========================= */}
        {/* WISHLIST BUTTON */}
        {/* ========================= */}

        <button
          type="button"
          onClick={handleWishlist}
          className={`
            absolute
            right-3
            top-3
            z-10
            grid
            h-10
            w-10
            place-items-center
            rounded-full
            shadow-lg
            backdrop-blur
            transition

            ${
              isWishlisted
                ? "bg-[#ff6f61] text-white"
                : "bg-white/90 text-[#10151f] hover:bg-[#ff6f61] hover:text-white"
            }
          `}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* ========================= */}
        {/* CARD */}
        {/* ========================= */}

        <div
          onClick={() => activeNavigate(`/product/${id}`)}
          className="
            flex
            h-full
            cursor-pointer
            flex-col
          "
        >
          {/* IMAGE */}

          <div
            className="
              overflow-hidden
              bg-[#10151f]
            "
          >
            <img
              className="
                h-[290px]
                w-full
                object-cover
                transition-transform
                duration-500
                ease-in-out
                group-hover:scale-105
              "
              src={image[0]}
              alt={name}
            />
          </div>

          {/* CONTENT */}

          <div
            className="
              flex
              flex-grow
              flex-col
              p-4
            "
          >
            {/* NAME */}

            <h3
              className="
                line-clamp-1
                text-[15px]
                font-black
                leading-tight
                text-[#10151f]
              "
            >
              {name}
            </h3>

            {/* PRICE */}

            <p
              className="
                mt-2
                text-[20px]
                font-black
                text-[#ff6f61]
              "
            >
              {currency}
              {price}
            </p>

            {/* BUTTON */}

            <motion.button
              whileHover={{
                x: 4,
                scale: 1.02,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              className="
                mt-4
                flex
                w-max
                items-center
                gap-2
                rounded-full
                bg-[#10151f]
                px-4
                py-2
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-white
                transition-colors
                duration-300
                hover:bg-[#aaff5a]
                hover:text-[#080b10]
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
