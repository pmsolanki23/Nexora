import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendurl } from "../App";
import { toast } from "react-toastify";
import { Star, Trash2, AlertCircle, RefreshCw } from "lucide-react";

const StarDisplay = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={s <= rating ? "fill-[#aaff5a] text-[#aaff5a]" : "fill-slate-200 text-slate-200"}
      />
    ))}
  </div>
);

const Reviews = ({ token }) => {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${backendurl}/api/review/all?page=${page}&limit=20`,
        { headers: { token } },
      );
      if (res.data.success) {
        setReviews(res.data.reviews);
        setTotal(res.data.total);
        setHasNext(res.data.hasNextPage);
      }
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  }, [token, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    setDeleting(reviewId);
    try {
      const res = await axios.post(
        backendurl + "/api/review/delete",
        { reviewId },
        { headers: { token } },
      );
      if (res.data.success) {
        toast.success("Review deleted");
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        setTotal((prev) => prev - 1);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to delete review");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-panel rounded-[32px] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#aaff5a] text-[#070a0f]">
              <Star size={25} />
            </div>
            <div>
              <p className="admin-kicker">Moderation</p>
              <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                Review Management
              </h1>
              <p className="mt-2 text-slate-400">
                {total} total reviews — moderate and remove inappropriate content.
              </p>
            </div>
          </div>
          <button
            onClick={fetchReviews}
            className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </section>

      {isLoading ? (
        <div className="grid min-h-[280px] place-items-center rounded-[28px] border border-white/10 bg-white/[0.05]">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#aaff5a] border-t-transparent" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="admin-card grid min-h-[280px] place-items-center rounded-[28px] text-center">
          <div className="text-slate-500">
            <AlertCircle className="mx-auto mb-2" size={32} />
            <p className="text-xl font-black">No reviews yet</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="admin-card rounded-[28px] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Product image */}
                  {review.productId?.image?.[0] && (
                    <img
                      src={review.productId.image[0]}
                      alt=""
                      className="h-14 w-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-black text-[#0b1018] truncate">
                        {review.productId?.name || "Unknown Product"}
                      </p>
                      <StarDisplay rating={review.rating} />
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <span className="font-semibold text-slate-700">
                        {review.userId?.name || "Anonymous"}
                      </span>
                      <span>·</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.verifiedPurchase && (
                        <>
                          <span>·</span>
                          <span className="text-green-600 font-semibold">Verified Purchase</span>
                        </>
                      )}
                    </div>

                    {review.title && (
                      <p className="mt-2 font-black text-sm text-[#0b1018]">{review.title}</p>
                    )}
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{review.body}</p>

                    {review.images?.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {review.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover border border-slate-100"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={deleting === review._id}
                  className="shrink-0 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {deleting === review._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-2xl border border-white/10 px-5 py-2 text-sm font-black text-slate-300 hover:bg-white/10 disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-slate-400">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
              className="rounded-2xl border border-white/10 px-5 py-2 text-sm font-black text-slate-300 hover:bg-white/10 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
