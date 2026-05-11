import React, { useContext, useEffect, useState } from "react";

import axios from "axios";

import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  ShoppingBag,
} from "lucide-react";

import { ShopContext } from "../../Context/ShopContext";

const ProfileOrders = () => {
  const { backendurl, token, currency, navigate } = useContext(ShopContext);

  const [orders, setorders] = useState([]);

  const [loading, setloading] = useState(false);

  // =========================
  // LOAD ORDERS
  // =========================

  const loadOrders = async () => {
    try {
      setloading(true);

      const response = await axios.post(
        backendurl + "/api/order/userorders",

        {},

        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        let allOrders = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;

            item.payment = order.payment;

            item.paymentMethod = order.paymentMethod;

            item.date = order.date;

            allOrders.push(item);
          });
        });

        setorders(allOrders.reverse());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  // =========================
  // STATUS ICON
  // =========================

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle2 size={18} />;

      case "shipped":
        return <Truck size={18} />;

      case "processing":
        return <Clock3 size={18} />;

      default:
        return <Package size={18} />;
    }
  };

  // =========================
  // EFFECT
  // =========================

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  return (
    <div
      className="
          rounded-[30px]
          border
          border-white/10
          bg-white/[0.05]
          p-8
          backdrop-blur-xl
        "
    >
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2
            className="
                text-3xl
                font-black
                text-white
              "
          >
            My Orders
          </h2>

          <p className="mt-2 text-slate-400">Track all your recent purchases</p>
        </div>

        <div
          className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-[#aaff5a]/20
              bg-[#aaff5a]/10
              px-5
              py-3
              text-[#aaff5a]
            "
        >
          <ShoppingBag size={18} />

          <span className="font-bold">{orders.length} Orders</span>
        </div>
      </div>

      {/* ========================= */}
      {/* LOADING */}
      {/* ========================= */}

      {loading && <div className="mt-10 text-slate-400">Loading orders...</div>}

      {/* ========================= */}
      {/* ORDERS */}
      {/* ========================= */}

      {!loading && orders.length > 0 ? (
        <div className="mt-10 space-y-6">
          {orders.map((item, index) => (
            <div
              key={index}
              className="
                    flex
                    flex-col
                    gap-6
                    rounded-[28px]
                    border
                    border-white/10
                    bg-[#10151f]
                    p-5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                  "
            >
              {/* LEFT */}

              <div className="flex gap-5">
                <img
                  onClick={() => navigate(`/product/${item.productId}`)}
                  className="
                        h-28
                        w-24
                        cursor-pointer
                        rounded-2xl
                        object-cover
                      "
                  src={item.image[0]}
                  alt=""
                />

                <div>
                  <h3
                    className="
                          text-xl
                          font-bold
                          text-white
                        "
                  >
                    {item.name}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                    <span>Qty: {item.quantity}</span>

                    <span>Size: {item.size}</span>

                    <span>Payment: {item.paymentMethod}</span>
                  </div>

                  <p
                    className="
                          mt-4
                          text-2xl
                          font-black
                          text-[#ff6f61]
                        "
                  >
                    {currency}
                    {item.price}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Ordered on {new Date(item.date).toDateString()}
                  </p>
                </div>
              </div>

              {/* RIGHT */}

              <div className="flex flex-col items-start gap-5 lg:items-end">
                <div
                  className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-[#aaff5a]/20
                        bg-[#aaff5a]/10
                        px-4
                        py-2
                        text-[#aaff5a]
                      "
                >
                  {getStatusIcon(item.status)}

                  <span className="font-bold capitalize">{item.status}</span>
                </div>

                <button
                  onClick={loadOrders}
                  className="
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-6
                        py-3
                        font-bold
                        text-white
                        transition
                        hover:border-[#aaff5a]
                        hover:text-[#aaff5a]
                      "
                >
                  Refresh Status
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div
            className="
                mt-10
                rounded-[30px]
                border
                border-dashed
                border-white/10
                p-14
                text-center
              "
          >
            <div
              className="
                  mx-auto
                  grid
                  h-20
                  w-20
                  place-items-center
                  rounded-full
                  bg-[#aaff5a]/10
                  text-[#aaff5a]
                "
            >
              <ShoppingBag size={34} />
            </div>

            <h3
              className="
                  mt-6
                  text-2xl
                  font-black
                  text-white
                "
            >
              No Orders Yet
            </h3>

            <p className="mt-3 text-slate-400">
              Your order history will appear here.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default ProfileOrders;
