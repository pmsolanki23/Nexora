import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { backendurl, currency } from "../App";
import { toast } from "react-toastify";
import {
  AlertCircle,
  Box,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    productsInStock: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [dailySummary, setDailySummary] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [statsResponse, dailyResponse, productsResponse] =
        await Promise.all([
          axios.post(
            backendurl + "/api/dashboard/stats",
            {},
            { headers: { token } },
          ),
          axios.post(
            backendurl + "/api/dashboard/daily-summary",
            {},
            { headers: { token } },
          ),
          axios.post(
            backendurl + "/api/dashboard/top-products",
            {},
            { headers: { token } },
          ),
        ]);

      if (statsResponse.data.success) setStats(statsResponse.data.stats);
      if (dailyResponse.data.success)
        setDailySummary(dailyResponse.data.dailySummary);
      if (productsResponse.data.success)
        setTopProducts(productsResponse.data.topProducts);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statItems = [
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      accent: "bg-[#aaff5a]",
    },
    {
      title: "Products",
      value: stats.productsInStock,
      icon: Box,
      accent: "bg-[#48c6ef]",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      accent: "bg-[#ff6f61]",
    },
    {
      title: "Revenue",
      value: `${currency}${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      accent: "bg-white",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-panel overflow-hidden rounded-[32px] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="admin-kicker">Live overview</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Store command center
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Track catalog health, order flow, customer activity, and revenue
              from one focused workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-sm text-slate-400">Today signal</p>
            <div className="mt-2 flex items-center gap-2 text-[#aaff5a]">
              <TrendingUp size={20} />
              <span className="text-2xl font-black">
                {dailySummary.length || 0}
              </span>
              <span className="text-sm font-bold text-slate-300">
                active day rows
              </span>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid min-h-[320px] place-items-center rounded-[28px] border border-white/10 bg-white/[0.05]">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#aaff5a] border-t-transparent" />
            <p className="mt-3 font-semibold text-slate-300">
              Loading dashboard...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statItems.map(({ title, value, icon: Icon, accent }) => (
              <div key={title} className="admin-card rounded-[26px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                      {title}
                    </p>
                    <p className="mt-3 text-3xl font-black text-[#0b1018]">
                      {value}
                    </p>
                  </div>
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${accent} text-[#070a0f]`}
                  >
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
            <div className="admin-card rounded-[28px] p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Momentum
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-[#0b1018]">
                    Orders and revenue
                  </h2>
                </div>
              </div>

              {dailySummary.length === 0 ? (
                <EmptyState label="No daily data yet" />
              ) : (
                <ResponsiveContainer width="100%" height={290}>
                  <BarChart data={dailySummary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f1622",
                        border: "1px solid #263241",
                        borderRadius: "16px",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="orders"
                      fill="#aaff5a"
                      radius={[8, 8, 0, 0]}
                      barSize={32}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#ff6f61"
                      radius={[8, 8, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="admin-card rounded-[28px] p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Best performers
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#0b1018]">
                Top products
              </h2>
              <div className="mt-5 space-y-3">
                {topProducts.length === 0 ? (
                  <EmptyState label="No sales yet" />
                ) : (
                  topProducts.map((product, index) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between rounded-2xl bg-slate-100 p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-black text-[#0b1018]">
                          {product.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Rank #{index + 1}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#0b1018] px-3 py-1 text-sm font-black text-[#aaff5a]">
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

export default Dashboard;
