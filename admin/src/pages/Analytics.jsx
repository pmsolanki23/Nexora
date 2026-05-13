import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendurl, currency } from "../App";
import { toast } from "react-toastify";
import { BarChart2, TrendingUp, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const RANGE_OPTIONS = [
  { value: "daily", label: "Daily (Last 30 days)" },
  { value: "weekly", label: "Weekly (Last 12 weeks)" },
  { value: "monthly", label: "Monthly (Last 12 months)" },
];

const STATUS_COLORS = {
  "Order Placed": "#aaff5a",
  Packing: "#48c6ef",
  Shipped: "#ff6f61",
  "Out for Delivery": "#f59e0b",
  Delivered: "#10b981",
  Cancelled: "#ef4444",
};

const Analytics = ({ token }) => {
  const [range, setRange] = useState("daily");
  const [data, setData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${backendurl}/api/dashboard/analytics?range=${range}`,
        { headers: { token } },
      );
      if (res.data.success) {
        setData(res.data.data || []);
        setTopProducts(res.data.topProducts || []);
        setStatusBreakdown(res.data.orderStatusBreakdown || []);
      }
    } catch (err) {
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  }, [token, range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const totalRevenue = data.reduce((acc, d) => acc + (d.revenue || 0), 0);
  const totalOrders = data.reduce((acc, d) => acc + (d.orders || 0), 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-panel rounded-[32px] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#aaff5a] text-[#070a0f]">
              <BarChart2 size={25} />
            </div>
            <div>
              <p className="admin-kicker">Insights</p>
              <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                Analytics
              </h1>
              <p className="mt-2 text-slate-400">
                Revenue, orders, and performance breakdown.
              </p>
            </div>
          </div>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white outline-none"
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0b1018]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {isLoading ? (
        <div className="grid min-h-[280px] place-items-center rounded-[28px] border border-white/10 bg-white/[0.05]">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#aaff5a] border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="admin-card rounded-[26px] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                Total Revenue
              </p>
              <p className="mt-3 text-3xl font-black text-[#0b1018]">
                {currency}{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="admin-card rounded-[26px] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                Total Orders
              </p>
              <p className="mt-3 text-3xl font-black text-[#0b1018]">{totalOrders}</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="admin-card rounded-[28px] p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Revenue & Orders
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#0b1018]">
                Performance Over Time
              </h2>
            </div>

            {data.length === 0 ? (
              <EmptyState label="No data for this period" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f1622",
                      border: "1px solid #263241",
                      borderRadius: "16px",
                      color: "#fff",
                    }}
                    formatter={(value, name) => [
                      name === "revenue" ? `${currency}${value}` : value,
                      name === "revenue" ? "Revenue" : "Orders",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#aaff5a" radius={[8, 8, 0, 0]} barSize={28} />
                  <Bar dataKey="orders" fill="#ff6f61" radius={[8, 8, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {/* Order Status Breakdown */}
            <div className="admin-card rounded-[28px] p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Distribution
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#0b1018]">
                Order Status
              </h2>

              {statusBreakdown.length === 0 ? (
                <EmptyState label="No order data" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ status, percent }) =>
                        `${status} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {statusBreakdown.map((entry, index) => (
                        <Cell
                          key={entry.status}
                          fill={STATUS_COLORS[entry.status] || "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f1622",
                        border: "1px solid #263241",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top Products */}
            <div className="admin-card rounded-[28px] p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Best Performers
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#0b1018]">
                Top Products
              </h2>

              <div className="mt-5 space-y-3">
                {topProducts.length === 0 ? (
                  <EmptyState label="No sales data" />
                ) : (
                  topProducts.map((product, index) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between rounded-2xl bg-slate-100 p-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b1018] text-xs font-black text-[#aaff5a]">
                          #{index + 1}
                        </span>
                        <p className="truncate font-black text-[#0b1018]">
                          {product.name}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#0b1018] px-3 py-1 text-sm font-black text-[#aaff5a]">
                        {product.sold} sold
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const EmptyState = ({ label }) => (
  <div className="grid min-h-[180px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
    <div className="text-center text-slate-500">
      <AlertCircle className="mx-auto mb-2" size={26} />
      <p className="font-bold">{label}</p>
    </div>
  </div>
);

export default Analytics;
