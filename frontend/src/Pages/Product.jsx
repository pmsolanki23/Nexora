import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/assets";
import ReleatedProduct from "../Components/ReleatedProduct";
import { Heart, Star, Send, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

// =========================
// STAR RATING DISPLAY
// =========================

const StarRating = ({ rating, size = 16 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-[#aaff5a] text-[#aaff5a]"
              : "fill-slate-200 text-slate-200"
          }
        />
      ))}
    </div>
  );
};

// =========================
// INTERACTIVE STAR INPUT
// =========================

const StarInput = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={
              star <= (hovered || value)
                ? "fill-[#aaff5a] text-[#aaff5a]"
                : "fill-slate-200 text-slate-200"
            }
          />
        </button>
      ))}
    </div>
  );
};

// =========================
// PRODUCT PAGE
// =========================

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
    backendurl,
  } = useContext(ShopContext);

  const [size, setSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [productdata, setProductdata] = useState(null);
  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewSort, setReviewSort] = useState("newest");
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [hasNextReviewPage, setHasNextReviewPage] = useState(false);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // =========================
  // LOAD PRODUCT
  // =========================

  useEffect(() => {
    const found = products.find((item) => item._id === id);
    if (found) {
      setProductdata(found);
      setImage(found.image[0]);
      setSelectedColor(null);
      setSize("");
      if (token) addRecentlyViewed(found._id);
    }
  }, [id, products, token]);

  // =========================
  // LOAD REVIEWS
  // =========================

  const loadReviews = useCallback(async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const res = await axios.get(
        `${backendurl}/api/review/product/${id}?sort=${reviewSort}&page=${reviewPage}&limit=5`,
      );
      if (res.data.success) {
        if (reviewPage === 1) {
          setReviews(res.data.reviews);
        } else {
          setReviews((prev) => [...prev, ...res.data.reviews]);
        }
        setReviewTotal(res.data.total);
        setHasNextReviewPage(res.data.hasNextPage);
      }
    } catch (_) {}
    setReviewsLoading(false);
  }, [id, reviewSort, reviewPage, backendurl]);

  useEffect(() => {
    if (activeTab === "reviews") loadReviews();
  }, [activeTab, reviewSort, reviewPage]);

  // Reset page when sort changes
  useEffect(() => {
    setReviewPage(1);
    setReviews([]);
  }, [reviewSort]);

  // =========================
  // VARIANT LOGIC
  // =========================

  const hasVariants = productdata?.variants?.length > 0;

  const currentVariant = hasVariants
    ? productdata.variants.find((v) => v.color === selectedColor)
    : null;

  const displayImages = currentVariant?.images?.length
    ? currentVariant.images
    : productdata?.image || [];

  const displayPrice = currentVariant?.priceOverride
    ? currentVariant.priceOverride
    : productdata?.price;

  const getSizeStock = (s) => {
    if (currentVariant?.stock) {
      const stockMap = currentVariant.stock;
      if (stockMap instanceof Map) return stockMap.get(s) ?? 0;
      return stockMap[s] ?? 0;
    }
    if (productdata?.stock) {
      const stockMap = productdata.stock;
      if (stockMap instanceof Map) return stockMap.get(s) ?? 0;
      return stockMap[s] ?? 0;
    }
    return null; // null = no stock tracking
  };

  const isSizeOutOfStock = (s) => {
    const qty = getSizeStock(s);
    return qty !== null && qty === 0;
  };

  const isProductOutOfStock =
    productdata?.totalStock !== undefined && productdata.totalStock === 0;

  // =========================
  // WISHLIST
  // =========================

  const wishlistIds = wishlist.map((item) =>
    typeof item === "string" ? item : item._id,
  );
  const isWishlisted = productdata && wishlistIds.includes(productdata._id);

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    if (hasVariants && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (isSizeOutOfStock(size)) {
      toast.error("This size is out of stock");
      return;
    }
    addtocart(productdata._id, size, selectedColor);
  };

  // =========================
  // SUBMIT REVIEW
  // =========================

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewBody.trim()) {
      toast.error("Please write a review");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await axios.post(
        `${backendurl}/api/review/add`,
        {
          productId: id,
          rating: reviewRating,
          title: reviewTitle,
          body: reviewBody,
        },
        { headers: { token } },
      );

      if (res.data.success) {
        toast.success("Review submitted!");
        setShowReviewForm(false);
        setReviewRating(0);
        setReviewTitle("");
        setReviewBody("");
        setReviewPage(1);
        setReviews([]);
        loadReviews();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
    setSubmittingReview(false);
  };

  if (!productdata) return <div className="opacity-0 min-h-screen" />;

  return (
    <div className="space-y-12 border-t border-white/10 pt-10 text-white">
      {/* ========================= */}
      {/* PRODUCT MAIN */}
      {/* ========================= */}

      <div className="flex flex-col gap-8 sm:flex-row">
        {/* IMAGES */}
        <div className="flex-1 rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex gap-2 overflow-x-auto sm:w-[20%] sm:flex-col sm:overflow-y-auto">
              {displayImages.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  className={`h-20 w-20 cursor-pointer rounded-xl border object-cover transition ${
                    image === item ? "border-[#aaff5a]" : "border-white/10"
                  }`}
                  src={item}
                  key={index}
                  alt=""
                  loading="lazy"
                />
              ))}
            </div>
            <div className="flex-1 relative">
              <img
                className="h-full w-full rounded-2xl object-contain"
                src={image}
                alt={productdata.name}
              />
              {isProductOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
                  <span className="rounded-full bg-red-500 px-6 py-2 text-lg font-black text-white">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex-1 space-y-4 rounded-[28px] bg-white p-6 text-[#10151f] shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <h1 className="text-2xl font-black">{productdata.name}</h1>

          {/* RATING */}
          <div className="flex items-center gap-2">
            <StarRating rating={productdata.averageRating || 0} />
            <span className="text-sm text-slate-500">
              {productdata.averageRating
                ? `${productdata.averageRating.toFixed(1)} (${productdata.reviewCount} reviews)`
                : "No reviews yet"}
            </span>
          </div>

          {/* PRICE */}
          <p className="text-3xl font-black text-[#ff6f61]">
            {currency}
            {displayPrice}
          </p>

          <p className="text-sm leading-7 text-slate-600">
            {productdata.description}
          </p>

          {/* COLOR VARIANTS */}
          {hasVariants && (
            <div>
              <p className="font-extrabold">
                Select Color:{" "}
                {selectedColor && (
                  <span className="font-normal text-slate-500">
                    {selectedColor}
                  </span>
                )}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {productdata.variants.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => {
                      setSelectedColor(variant.color);
                      setSize("");
                      if (variant.images?.length) setImage(variant.images[0]);
                    }}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                      selectedColor === variant.color
                        ? "border-[#10151f] bg-[#10151f] text-white"
                        : "border-slate-200 bg-slate-100 text-[#10151f] hover:border-[#aaff5a]"
                    }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE */}
          <div>
            <p className="font-extrabold">Select Size:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(productdata.sizes || productdata.size || []).map(
                (item, index) => {
                  const outOfStock = isSizeOutOfStock(item);
                  return (
                    <button
                      onClick={() => !outOfStock && setSize(item)}
                      key={index}
                      disabled={outOfStock}
                      className={`rounded-full border px-4 py-1.5 text-sm transition-transform duration-200 ${
                        outOfStock
                          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                          : size === item
                            ? "border-[#10151f] bg-[#10151f] text-white"
                            : "border-slate-200 bg-slate-100 text-[#10151f] hover:border-[#aaff5a]"
                      }`}
                    >
                      {item}
                      {outOfStock && (
                        <span className="ml-1 text-xs">(OOS)</span>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isProductOutOfStock}
              className={`rounded-full px-7 py-3 font-black shadow transition-transform duration-200 ${
                isProductOutOfStock
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-[#aaff5a] text-[#080b10] hover:scale-105"
              }`}
            >
              {isProductOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
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

      {/* ========================= */}
      {/* TABS: Description / Reviews */}
      {/* ========================= */}

      <div className="rounded-[28px] bg-white p-6 text-[#10151f] shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
        <div className="mb-6 flex gap-2 border-b border-slate-200 pb-2">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-black capitalize transition ${
                activeTab === tab
                  ? "bg-[#10151f] text-white"
                  : "text-slate-500 hover:text-[#10151f]"
              }`}
            >
              {tab === "reviews"
                ? `Reviews (${productdata.reviewCount || 0})`
                : "Description"}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="space-y-3 text-sm leading-7 text-slate-600">
            <p>
              {productdata.description ||
                "This piece is selected for everyday rotation: clean styling, easy pairing, and a confident finish."}
            </p>
            <p>
              Pair it with wardrobe basics or use it as the detail that pulls a
              simple outfit together.
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* SORT + WRITE REVIEW */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold outline-none"
              >
                <option value="newest">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>

              {token && (
                <button
                  onClick={() => setShowReviewForm((p) => !p)}
                  className="flex items-center gap-2 rounded-full bg-[#10151f] px-5 py-2 text-sm font-black text-white transition hover:bg-[#aaff5a] hover:text-[#10151f]"
                >
                  {showReviewForm ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  Write a Review
                </button>
              )}
            </div>

            {/* REVIEW FORM */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4"
              >
                <h3 className="font-black text-lg">Your Review</h3>

                <div>
                  <p className="text-sm font-semibold mb-2">Rating *</p>
                  <StarInput value={reviewRating} onChange={setReviewRating} />
                </div>

                <input
                  type="text"
                  placeholder="Review title (optional)"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#aaff5a]"
                />

                <textarea
                  placeholder="Share your experience with this product *"
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#aaff5a] resize-none"
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center gap-2 rounded-full bg-[#aaff5a] px-6 py-2.5 text-sm font-black text-[#080b10] transition hover:scale-105 disabled:opacity-50"
                  >
                    <Send size={14} />
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* REVIEWS LIST */}
            {reviewsLoading && reviewPage === 1 ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#aaff5a] border-t-transparent" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Star size={32} className="mx-auto mb-2 opacity-30" />
                <p className="font-semibold">No reviews yet</p>
                <p className="text-sm">Be the first to review this product</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-2xl border border-slate-100 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#10151f] flex items-center justify-center text-white font-black text-sm">
                          {review.userId?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-black text-sm">
                            {review.userId?.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} size={14} />
                        {review.verifiedPurchase && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {review.title && (
                      <p className="mt-3 font-black text-sm">{review.title}</p>
                    )}
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {review.body}
                    </p>

                    {review.images?.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {review.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="h-16 w-16 rounded-xl object-cover border border-slate-100"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {hasNextReviewPage && (
                  <button
                    onClick={() => setReviewPage((p) => p + 1)}
                    disabled={reviewsLoading}
                    className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-black text-slate-500 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    {reviewsLoading ? "Loading..." : "Load More Reviews"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6">
        <ReleatedProduct
          category={productdata.category}
          subCategory={productdata.subCategory}
        />
      </div>
    </div>
  );
};

export default Product;
