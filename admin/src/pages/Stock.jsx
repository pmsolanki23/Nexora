import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendurl, currency } from "../App";
import { toast } from "react-toastify";
import { Package, AlertTriangle, Save, RefreshCw } from "lucide-react";

const Stock = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState({});
  const [stockEdits, setStockEdits] = useState({});

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await axios.get(backendurl + "/api/product/list", {
        headers: { token },
      });
      if (res.data.success) {
        setProducts(res.data.products || res.data.product || []);
      }
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleStockChange = (productId, size, value, variantColor = null) => {
    const key = variantColor ? `${productId}__${variantColor}` : productId;
    setStockEdits((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [size]: value,
      },
    }));
  };

  const saveStock = async (product, variantColor = null) => {
    const key = variantColor ? `${product._id}__${variantColor}` : product._id;
    const edits = stockEdits[key];
    if (!edits) return;

    // Build stock object from current + edits
    let currentStock = {};
    if (variantColor) {
      const variant = product.variants?.find((v) => v.color === variantColor);
      currentStock = variant?.stock || {};
    } else {
      currentStock = product.stock || {};
    }

    const newStock = { ...currentStock };
    Object.entries(edits).forEach(([size, val]) => {
      newStock[size] = Number(val) || 0;
    });

    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await axios.post(
        backendurl + "/api/product/stock",
        {
          productId: product._id,
          stock: newStock,
          variantColor: variantColor || undefined,
        },
        { headers: { token } },
      );

      if (res.data.success) {
        toast.success("Stock updated");
        setStockEdits((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        fetchProducts();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to update stock");
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getStockValue = (product, size, variantColor = null) => {
    const key = variantColor ? `${product._id}__${variantColor}` : product._id;
    if (stockEdits[key]?.[size] !== undefined) return stockEdits[key][size];

    if (variantColor) {
      const variant = product.variants?.find((v) => v.color === variantColor);
      const s = variant?.stock;
      if (!s) return 0;
      if (s instanceof Map) return s.get(size) ?? 0;
      return s[size] ?? 0;
    }

    const s = product.stock;
    if (!s) return 0;
    if (s instanceof Map) return s.get(size) ?? 0;
    return s[size] ?? 0;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-panel rounded-[32px] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#aaff5a] text-[#070a0f]">
              <Package size={25} />
            </div>
            <div>
              <p className="admin-kicker">Inventory</p>
              <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                Stock Management
              </h1>
              <p className="mt-2 text-slate-400">
                View and update inventory levels per product and variant.
              </p>
            </div>
          </div>
          <button
            onClick={fetchProducts}
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
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="admin-card rounded-[28px] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="h-16 w-16 rounded-2xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-black text-[#0b1018] text-lg">{product.name}</h3>
                    {product.lowStock && (
                      <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                        <AlertTriangle size={12} />
                        Low Stock
                      </span>
                    )}
                    {product.totalStock === 0 && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Total: {product.totalStock ?? "N/A"} units
                  </p>
                </div>
              </div>

              {/* No variants — flat stock */}
              {(!product.variants || product.variants.length === 0) && (
                <div className="mt-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                    Stock by Size
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {(product.sizes || product.size || []).map((size) => (
                      <div key={size} className="flex items-center gap-2">
                        <span className="w-10 text-center text-sm font-black text-slate-600 rounded-lg bg-slate-100 py-1">
                          {size}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={getStockValue(product, size)}
                          onChange={(e) => handleStockChange(product._id, size, e.target.value)}
                          className="w-20 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-[#0b1018] outline-none focus:border-[#aaff5a]"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => saveStock(product)}
                      disabled={saving[product._id]}
                      className="flex items-center gap-2 rounded-xl bg-[#aaff5a] px-4 py-1.5 text-sm font-black text-[#070a0f] transition hover:scale-105 disabled:opacity-50"
                    >
                      <Save size={14} />
                      {saving[product._id] ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              )}

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div className="mt-4 space-y-4">
                  {product.variants.map((variant) => {
                    const key = `${product._id}__${variant.color}`;
                    return (
                      <div key={variant.color} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-sm font-black text-slate-700 mb-3">
                          Color: {variant.color}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {(product.sizes || product.size || []).map((size) => (
                            <div key={size} className="flex items-center gap-2">
                              <span className="w-10 text-center text-sm font-black text-slate-600 rounded-lg bg-white py-1 border border-slate-200">
                                {size}
                              </span>
                              <input
                                type="number"
                                min="0"
                                value={getStockValue(product, size, variant.color)}
                                onChange={(e) =>
                                  handleStockChange(product._id, size, e.target.value, variant.color)
                                }
                                className="w-20 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-[#0b1018] outline-none focus:border-[#aaff5a]"
                              />
                            </div>
                          ))}
                          <button
                            onClick={() => saveStock(product, variant.color)}
                            disabled={saving[key]}
                            className="flex items-center gap-2 rounded-xl bg-[#aaff5a] px-4 py-1.5 text-sm font-black text-[#070a0f] transition hover:scale-105 disabled:opacity-50"
                          >
                            <Save size={14} />
                            {saving[key] ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stock;
