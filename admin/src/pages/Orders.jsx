import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendurl, currency } from "../App";
import { toast } from "react-toastify";
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";

const statuses = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const Orders = ({ token }) => {
  const [order, setorder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchallorders = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        backendurl + "/api/order/list",
        {},
        { headers: { token } },
      );
      if (response.data.success) setorder(response.data.orders.reverse());
      else toast.error(response.data.message);
    } catch (error) {
      toast.error(
        "Failed to fetch orders: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const statushandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        backendurl + "/api/order/status",
        { orderId, status: e.target.value },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success("Order status updated");
        await fetchallorders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        "Failed to update status: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  useEffect(() => {
    fetchallorders();
  }, [token]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-panel rounded-[32px] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#aaff5a] text-[#070a0f]">
            <ShoppingBag size={25} />
          </div>
          <div>
            <p className="admin-kicker">Fulfillment</p>
            <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">
              Order management
            </h1>
            <p className="mt-2 text-slate-400">
              Track customer orders and update DELIVERY  progress.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {isLoading ? (
          <div className="grid min-h-[280px] place-items-center rounded-[28px] border border-white/10 bg-white/[0.05]">
            <div className="text-center">
              <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#aaff5a] border-t-transparent" />
              <p className="mt-3 font-semibold text-slate-300">
                Loading orders...
              </p>
            </div>
          </div>
        ) : order.length === 0 ? (
          <div className="admin-card grid min-h-[280px] place-items-center rounded-[28px] text-center">
            <div className="text-slate-500">
              <AlertCircle className="mx-auto mb-2" size={32} />
              <p className="text-xl font-black">No orders available</p>
            </div>
          </div>
        ) : (
          order.map((orderItem) => (
            <article
              key={orderItem._id}
              className="admin-card overflow-hidden rounded-[28px]"
            >
              <button
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === orderItem._id ? null : orderItem._id,
                  )
                }
                className="flex w-full flex-col justify-between gap-4 p-5 text-left sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f1622] text-[#aaff5a]">
                    <Package size={22} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-[#0b1018]">
                      Order #{orderItem._id.slice(-6)}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <CalendarDays size={14} />
                      {new Date(orderItem.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-[#aaff5a] px-4 py-1.5 text-sm font-black text-[#070a0f]">
                    {orderItem.status}
                  </span>
                  <p className="text-2xl font-black text-[#0b1018]">
                    {currency}
                    {orderItem.amount}
                  </p>
                  {expandedOrder === orderItem._id ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </div>
              </button>

              {expandedOrder === orderItem._id && (
                <div className="grid gap-4 border-t border-slate-200 bg-slate-50 p-5 lg:grid-cols-[1.2fr_1.4fr_0.9fr]">
                  <Panel
                    title={`Items (${orderItem.items.length})`}
                    icon={ShoppingBag}
                  >
                    {orderItem.items.map((item, index) => (
                      <p key={index} className="font-semibold text-slate-700">
                        {item.name} x {item.quantity}{" "}
                        {item.size ? `(${item.size})` : ""}
                      </p>
                    ))}
                  </Panel>
                  <Panel title="Customer" icon={User}>
                    <Info
                      icon={User}
                      value={`${orderItem.address.firstname} ${orderItem.address.lastname}`}
                    />
                    <Info icon={Phone} value={orderItem.address.phone} />
                    <Info
                      icon={MapPin}
                      value={`${orderItem.address.street}, ${orderItem.address.city}, ${orderItem.address.state}, ${orderItem.address.country}`}
                    />
                  </Panel>
                  <Panel title="Status" icon={Package}>
                    <select
                      onChange={(e) => statushandler(e, orderItem._id)}
                      value={orderItem.status}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-[#0b1018] outline-none focus:border-[#aaff5a]"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-slate-500">
                      Payment: {orderItem.payment ? "Paid" : "Pending"} ·{" "}
                      {orderItem.paymentMethod}
                    </p>
                  </Panel>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
};

const Panel = ({ title, icon: Icon, children }) => (
  <div className="rounded-2xl bg-white p-4">
    <p className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-slate-500">
      <Icon size={16} />
      {title}
    </p>
    <div className="space-y-2">{children}</div>
  </div>
);

const Info = ({ icon: Icon, value }) => (
  <p className="flex gap-2 text-sm font-semibold leading-6 text-slate-700">
    <Icon size={16} className="mt-1 shrink-0 text-slate-400" />
    {value || "N/A"}
  </p>
);

export default Orders;
