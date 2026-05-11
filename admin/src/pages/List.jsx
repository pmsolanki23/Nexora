import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendurl, currency } from "../App";
import { toast } from "react-toastify";
import {
  AlertCircle,
  ImageOff,
  Package,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const [list, setlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // Fetch Products
  const fetchlist = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(backendurl + "/api/product/list");

      if (response.data.success) {
        setlist(response.data.products || response.data.product || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove Product
  const removeproduct = async (id) => {
    try {
      const response = await axios.post(
        backendurl + "/api/product/remove",
        { id },
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        await fetchlist();

        // Fix current page after delete
        if (currentProducts.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchlist();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(list.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentProducts = list.slice(startIndex, endIndex);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <Header
        title="Product catalog"
        subtitle="Review, scan, and manage store items."
        icon={Package}
      />

      {/* Product Section */}
      <section className="admin-card overflow-hidden rounded-[28px]">
        {/* Table Header */}
        <div className="hidden grid-cols-[92px_2fr_1fr_1fr_120px] items-center bg-[#0f1622] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400 md:grid">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Actions</span>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid min-h-[300px] place-items-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#aaff5a] border-t-transparent" />

              <p className="mt-4 font-semibold text-slate-500">
                Loading products...
              </p>
            </div>
          </div>
        ) : list.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Product List */}
            <div className="divide-y divide-slate-200">
              {currentProducts.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-[72px_1fr_auto] gap-4 px-4 py-4 transition hover:bg-slate-50 md:grid-cols-[92px_2fr_1fr_1fr_120px] md:items-center md:px-6"
                >
                  {/* Image */}
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                    {item.image?.[0] ? (
                      <img
                        className="h-full w-full object-cover"
                        src={item.image[0]}
                        alt={item.name}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-slate-400">
                        <ImageOff size={18} />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-[#0b1018]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 md:hidden">
                      {item.category} · {currency}
                      {item.price}
                    </p>
                  </div>

                  {/* Category */}
                  <p className="hidden font-semibold text-slate-600 md:block">
                    {item.category}
                  </p>

                  {/* Price */}
                  <p className="hidden font-black text-[#0b1018] md:block">
                    {currency}
                    {item.price}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => navigate(`/edit/${item._id}`)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-blue-500/10 text-blue-500 transition duration-300 hover:scale-105 hover:bg-blue-500 hover:text-white"
                      title="Edit Product"
                    >
                      <Pencil size={17} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setSelectedProductId(item._id)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-[#ff6f61]/12 text-[#ff6f61] transition duration-300 hover:scale-105 hover:bg-[#ff6f61] hover:text-white"
                      title="Delete Product"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 px-6 py-5">
                {/* Prev */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-2 font-black transition duration-300 ${
                    currentPage === 1
                      ? "cursor-not-allowed bg-slate-200 text-slate-400"
                      : "bg-[#0f172a] text-white hover:scale-105"
                  }`}
                >
                  <ChevronLeft size={18} />
                  Prev
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`h-11 w-11 rounded-2xl font-black transition duration-300 ${
                      currentPage === index + 1
                        ? "bg-[#aaff5a] text-black shadow-lg"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-2 font-black transition duration-300 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed bg-slate-200 text-slate-400"
                      : "bg-[#0f172a] text-white hover:scale-105"
                  }`}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Delete Modal */}
      {selectedProductId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="admin-card w-full max-w-md rounded-[28px] p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ff6f61]/12 text-[#ff6f61]">
                <AlertCircle size={22} />
              </div>

              <h3 className="text-xl font-black text-[#0b1018]">
                Delete product?
              </h3>
            </div>

            <p className="mt-4 leading-7 text-slate-600">
              This product will be permanently removed from your inventory. This
              action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedProductId(null)}
                className="rounded-full bg-slate-100 px-5 py-2 font-black text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await removeproduct(selectedProductId);

                  setSelectedProductId(null);
                }}
                className="rounded-full bg-[#ff6f61] px-5 py-2 font-black text-white transition hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Header Component
const Header = ({ title, subtitle, icon: Icon }) => (
  <section className="admin-panel rounded-[32px] p-6 sm:p-8">
    <div className="flex items-center gap-4">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#aaff5a] text-[#070a0f]">
        <Icon size={25} />
      </div>

      <div>
        <p className="admin-kicker">Inventory</p>

        <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">
          {title}
        </h1>

        <p className="mt-2 text-slate-400">{subtitle}</p>
      </div>
    </div>
  </section>
);

// Empty State
const EmptyState = () => (
  <div className="grid min-h-[300px] place-items-center text-center text-slate-500">
    <div>
      <AlertCircle className="mx-auto mb-3" size={32} />

      <p className="text-lg font-black">No products available</p>

      <p className="mt-1 text-sm">Add products to display them here.</p>
    </div>
  </div>
);

export default List;
