import React, { useContext, useState, useEffect } from "react";

import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/assets";
import Tittle from "../Components/Tittle";
import ProductItem from "../Components/ProductItem";

import { ChevronLeft, ChevronRight } from "lucide-react";

const Collection = () => {
  const { products, showsearch, search } = useContext(ShopContext);

  const [showfilter, setshowfilter] = useState(false);

  const [filterproduct, setfilterproduct] = useState([]);

  const [category, setcategory] = useState([]);

  const [subcategory, setsubcategory] = useState([]);

  const [sortType, setSortType] = useState("relavent");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  // Toggle Category
  const toggleCategory = (e) => {
    const value = e.target.value;

    setcategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );

    setCurrentPage(1);
  };

  // Toggle Subcategory
  const handlesubcategory = (e) => {
    const value = e.target.value;

    setsubcategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );

    setCurrentPage(1);
  };

  // Apply Filters
  const applyfilter = () => {
    let productCopy = products.slice();

    // Search Filter
    if (showsearch && search) {
      productCopy = productCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category Filter
    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(item.category),
      );
    }

    // Subcategory Filter
    if (subcategory.length > 0) {
      productCopy = productCopy.filter((item) =>
        subcategory.includes(item.subCategory),
      );
    }

    setfilterproduct(productCopy);
  };

  useEffect(() => {
    applyfilter();
  }, [category, subcategory, search, showsearch, products]);

  // Sorting
  const sortProduct = () => {
    const fpcopy = filterproduct.slice();

    switch (sortType) {
      case "low-high":
        setfilterproduct(fpcopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setfilterproduct(fpcopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyfilter();
        break;
    }
  };

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // Pagination Logic
  const totalPages = Math.ceil(filterproduct.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const endIndex = startIndex + productsPerPage;

  const currentProducts = filterproduct.slice(startIndex, endIndex);

  // Filter Block
  const filterBlock = (title, values, onChange) => (
    <div
      className={`${
        showfilter ? "" : "hidden"
      } rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:block`}
    >
      <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#aaff5a]">
        {title}
      </p>

      <div className="flex flex-col gap-3 text-sm font-medium text-slate-200">
        {values.map((label) => (
          <label key={label} className="flex items-center gap-3">
            <input
              className="h-4 w-4 accent-[#aaff5a]"
              type="checkbox"
              value={label}
              onChange={onChange}
            />

            {label}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col gap-8 border-t border-white/10 pt-10 sm:flex-row">
        {/* Sidebar */}
        <aside className="min-w-64">
          <button
            onClick={() => setshowfilter((prev) => !prev)}
            className="my-2 flex items-center gap-2 text-xl font-black"
          >
            Filters
            <img
              className={`h-3 invert sm:hidden ${
                showfilter ? "rotate-90" : ""
              }`}
              src={assets.dropdown_icon}
              alt=""
            />
          </button>

          <div className="space-y-4">
            {filterBlock(
              "Categories",
              ["Men", "Women", "Kids"],
              toggleCategory,
            )}

            {filterBlock(
              "Type",
              ["Topwear", "Bottomwear", "Winterwear"],
              handlesubcategory,
            )}
          </div>
        </aside>

        {/* Products Section */}
        <section className="flex-1">
          {/* Header */}
          <div className="mb-6 flex flex-col justify-between gap-4 text-base sm:flex-row sm:items-center sm:text-xl">
            <Tittle text1="All" text2="Collections" />

            <select
              onChange={(e) => setSortType(e.target.value)}
              className="rounded-full border border-white/10 bg-[#10151f] px-4 py-3 text-sm text-white shadow-sm outline-none"
            >
              <option value="relavent">Sort By: Relevant</option>

              <option value="low-high">Sort By: Low to High</option>

              <option value="high-low">Sort By: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-8
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {currentProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>

          {/* Empty State */}
          {currentProducts.length === 0 && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-lg font-semibold text-slate-400">
                No products found.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-black transition duration-300 ${
                  currentPage === 1
                    ? "cursor-not-allowed bg-white/5 text-slate-500"
                    : "bg-[#aaff5a] text-black hover:scale-105"
                }`}
              >
                <ChevronLeft size={18} />
                Prev
              </button>

              {/* Numbers */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`h-12 w-12 rounded-2xl font-black transition duration-300 ${
                    currentPage === index + 1
                      ? "bg-[#aaff5a] text-black shadow-lg shadow-[#aaff5a]/20"
                      : "border border-white/10 bg-white/[0.05] text-white hover:bg-white/10"
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
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-black transition duration-300 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed bg-white/5 text-slate-500"
                    : "bg-[#aaff5a] text-black hover:scale-105"
                }`}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Collection;
