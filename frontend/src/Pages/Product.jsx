import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/assets";
import ReleatedProduct from "../Components/ReleatedProduct";
import { Heart } from "lucide-react";

const Product = () => {
  const { id } = useParams();
  const {
    products,
    currency,
    addtocart,
    addToWishlist,
    removeFromWishlist,
    addRecentlyViewed,
    wishlist,
    token,
  } = useContext(ShopContext);

  const [size, setsize] = useState("");
  const [productdata, setproductdata] = useState(false);
  const [image, setimg] = useState("");

  useEffect(() => {
    const found = products.find((item) => item._id === id);
    if (found) {
      setproductdata(found);
      setimg(found.image[0]);

      if (token) {
        addRecentlyViewed(found._id);
      }
    }
  }, [id, products, token]);

  const wishlistIds = wishlist.map((item) =>
    typeof item === "string" ? item : item._id,
  );
  const isWishlisted = productdata && wishlistIds.includes(productdata._id);

  return productdata ? (
    <div className="space-y-12 border-t border-white/10 pt-10 text-white opacity-100 transition-opacity duration-500 ease-in">
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="flex-1 rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex gap-2 overflow-x-auto sm:w-[20%] sm:flex-col sm:overflow-y-auto">
              {productdata.image.map((item, index) => (
                <img
                  onClick={() => setimg(item)}
                  className="h-20 w-20 cursor-pointer rounded-xl border border-white/10 object-cover"
                  src={item}
                  key={index}
                  alt=""
                />
              ))}
            </div>
            <div className="flex-1">
              <img
                className="h-full w-full rounded-2xl object-contain"
                src={image}
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 rounded-[28px] bg-white p-6 text-[#10151f] shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <h1 className="text-2xl font-black">{productdata.name}</h1>

          <div className="flex items-center gap-1">
            {Array(4)
              .fill()
              .map((_, i) => (
                <img
                  key={i}
                  src={assets.star_icon}
                  alt="star"
                  className="w-4"
                />
              ))}
            <img src={assets.star_dull_icon} alt="star" className="w-4" />
            <span className="pl-2 text-sm text-slate-500">(122)</span>
          </div>

          <p className="text-3xl font-black text-[#ff6f61]">
            {currency}
            {productdata.price}
          </p>
          <p className="text-sm leading-7 text-slate-600">
            {productdata.description}
          </p>

          <div>
            <p className="font-extrabold">Select Size:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(productdata.sizes || productdata.size || []).map(
                (item, index) => (
                  <button
                    onClick={() => setsize(item)}
                    key={index}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-transform duration-200 ${
                      size === item
                        ? "border-[#10151f] bg-[#10151f] text-white"
                        : "border-slate-200 bg-slate-100 text-[#10151f] hover:border-[#aaff5a]"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => addtocart(productdata._id, size)}
              className="rounded-full bg-[#aaff5a] px-7 py-3 font-black text-[#080b10] shadow transition-transform duration-200 hover:scale-105"
            >
              ADD TO CART
            </button>

            <button
              onClick={() =>
                isWishlisted
                  ? removeFromWishlist(productdata._id)
                  : addToWishlist(productdata._id)
              }
              className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 font-black transition ${
                isWishlisted
                  ? "border-[#ff6f61] bg-[#ff6f61] text-white"
                  : "border-slate-200 bg-slate-100 text-[#10151f] hover:border-[#ff6f61] hover:text-[#ff6f61]"
              }`}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              Wishlist
            </button>
          </div>

          <hr className="my-4 border-slate-200" />
          <div className="space-y-1 text-sm text-slate-600">
            <p>Original catalog piece, checked before dispatch</p>
            <p>Cash on delivery available in supported areas</p>
            <p>Easy exchange support if the fit is not right</p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-6 text-[#10151f] shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
        <div className="mb-4 flex border-b border-slate-200">
          <button className="border-r border-slate-200 px-4 py-2 text-sm font-bold text-[#ff6f61]">
            Product Notes
          </button>
          <button className="px-4 py-2 text-sm text-slate-500">
            Buyer Signals (122)
          </button>
        </div>
        <div className="space-y-3 text-sm leading-7 text-slate-600">
          <p>
            This piece is selected for everyday rotation: clean styling, easy
            pairing, and a confident finish.
          </p>
          <p>
            Pair it with wardrobe basics or use it as the detail that pulls a
            simple outfit together.
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6">
        <ReleatedProduct
          category={productdata.category}
          subCategory={productdata.subCategory}
        />
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
