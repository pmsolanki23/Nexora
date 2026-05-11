import React, { useContext, useEffect, useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import { ShopContext } from "../Context/ShopContext";

import Tittle from "../Components/Tittle";

import SlideInLeft from "../Components/SlideInLeft";

import { PackageCheck, Truck, CheckCircle2, Home, X, Bike } from "lucide-react";

const Order = () => {
  const { backendurl, token, currency } = useContext(ShopContext);

  // =========================
  // STATES
  // =========================

  const [orderdata, setorderdata] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // =========================
  // LOAD ORDERS
  // =========================

  const loadorderdata = async () => {
    try {
      if (!token) return;

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
        let allorderitem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item["status"] = order.status;

            item["paymentMethod"] = order.paymentMethod;

            item["date"] = order.date;

            item["orderId"] = order._id;

            allorderitem.push(item);
          });
        });

        setorderdata(allorderitem.reverse());
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadorderdata();
  }, [token]);

  // =========================
  // TRACKING STEPS
  // =========================

  const trackingSteps = [
    {
      label: "Order Placed",
      icon: CheckCircle2,
    },

    {
      label: "Packing",
      icon: PackageCheck,
    },

    {
      label: "Shipped",
      icon: Truck,
    },

    {
      label: "Out for Delivery",
      icon: Bike,
    },

    {
      label: "Delivered",
      icon: Home,
    },
  ];

  return (
    <div
      className="
        min-h-screen
        border-t
        border-white/10
        bg-[#070a0f]
        px-4
        py-8
        text-white
      "
    >
      <div className="mx-auto max-w-6xl">
        {/* ========================= */}
        {/* TITLE */}
        {/* ========================= */}

        <SlideInLeft>
          <div className="mb-8">
            <Tittle text1="MY" text2="ORDERS" />
          </div>
        </SlideInLeft>

        {/* ========================= */}
        {/* EMPTY STATE */}
        {/* ========================= */}

        {orderdata.length === 0 && (
          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
              rounded-[28px]
              border
              border-white/10
              bg-white/[0.04]
              text-center
            "
          >
            <div>
              <h2 className="text-3xl font-black">No Orders Found</h2>

              <p className="mt-3 text-slate-400">
                Your placed orders will appear here.
              </p>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* ORDER LIST */}
        {/* ========================= */}

        <div className="space-y-5">
          {orderdata.map((item, index) => (
            <SlideInLeft key={index}>
              <div
                className="
                    rounded-[28px]
                    border
                    border-white/10
                    bg-white/[0.05]
                    p-5
                    backdrop-blur-xl
                    transition
                    duration-300
                    hover:border-[#aaff5a]/20
                    hover:bg-white/[0.07]
                  "
              >
                <div
                  className="
                      flex
                      flex-col
                      gap-6
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                    "
                >
                  {/* ========================= */}
                  {/* LEFT SIDE */}
                  {/* ========================= */}

                  <div className="flex items-start gap-5">
                    {/* IMAGE */}
                    <img
                      className="
                          h-24
                          w-24
                          rounded-2xl
                          border
                          border-white/10
                          object-cover
                        "
                      src={item.image[0]}
                      alt=""
                    />

                    {/* INFO */}
                    <div>
                      <h3
                        className="
                            text-[19px]
                            font-black
                            text-white
                          "
                      >
                        {item.name}
                      </h3>

                      {/* DETAILS */}
                      <div
                        className="
                            mt-3
                            flex
                            flex-wrap
                            gap-4
                            text-sm
                            text-slate-300
                          "
                      >
                        <p>
                          Size:
                          <span className="ml-1 text-white">{item.size}</span>
                        </p>

                        <p>
                          Qty:
                          <span className="ml-1 text-white">
                            {item.quantity}
                          </span>
                        </p>
                      </div>

                      {/* PRICE */}
                      <h4
                        className="
                            mt-3
                            text-2xl
                            font-black
                            text-[#ff6f61]
                          "
                      >
                        {currency}

                        {item.price}
                      </h4>

                      {/* DATE */}
                      <p className="mt-2 text-sm text-slate-400">
                        Ordered on {new Date(item.date).toDateString()}
                      </p>

                      {/* PAYMENT */}
                      <p className="mt-1 text-sm text-slate-400">
                        Payment:
                        <span className="ml-1 text-white">
                          {item.paymentMethod}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ========================= */}
                  {/* RIGHT SIDE */}
                  {/* ========================= */}

                  <div
                    className="
                        flex
                        flex-col
                        items-start
                        gap-4
                        lg:items-end
                      "
                  >
                    {/* STATUS */}
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
                        "
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-[#aaff5a]" />

                      <p
                        className="
                            text-sm
                            font-semibold
                            text-white
                          "
                      >
                        {item.status}
                      </p>
                    </div>

                    {/* BUTTON */}
                    <button
                      onClick={() => setSelectedOrder(item)}
                      className="
                          rounded-full
                          border
                          border-[#aaff5a]
                          px-6
                          py-3
                          text-sm
                          font-black
                          uppercase
                          tracking-[0.12em]
                          text-[#aaff5a]
                          transition
                          hover:bg-[#aaff5a]
                          hover:text-[#070a0f]
                        "
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            </SlideInLeft>
          ))}
        </div>
      </div>

      {/* ========================= */}
      {/* TRACK ORDER MODAL */}
      {/* ========================= */}

      {selectedOrder && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
            px-4
          "
        >
          <div
            className="
              w-full
              max-w-3xl
              rounded-[32px]
              border
              border-white/10
              bg-[#0b1018]
              p-7
              shadow-2xl
            "
          >
            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <div className="flex items-start justify-between">
              <div>
                <h2
                  className="
                    text-3xl
                    font-black
                    text-white
                  "
                >
                  Track Order
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Order ID:
                  <span className="ml-2 text-white">
                    {selectedOrder.orderId}
                  </span>
                </p>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="
                  rounded-full
                  p-2
                  text-slate-400
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={22} />
              </button>
            </div>

            {/* ========================= */}
            {/* PRODUCT */}
            {/* ========================= */}

            <div
              className="
                mt-6
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-4
              "
            >
              <img
                className="
                  h-20
                  w-20
                  rounded-xl
                  border
                  border-white/10
                  object-cover
                "
                src={selectedOrder.image[0]}
                alt=""
              />

              <div>
                <h3
                  className="
                    text-lg
                    font-bold
                    text-white
                  "
                >
                  {selectedOrder.name}
                </h3>

                <p
                  className="
                    mt-1
                    font-black
                    text-[#ff6f61]
                  "
                >
                  {currency}

                  {selectedOrder.price}
                </p>
              </div>
            </div>

            {/* ========================= */}
            {/* TRACKING */}
            {/* ========================= */}

            <div className="mt-10">
              <div className="flex items-center justify-between gap-2">
                {trackingSteps.map((step, index) => {
                  const currentIndex = trackingSteps.findIndex(
                    (s) => s.label === selectedOrder.status,
                  );

                  const completed = index <= currentIndex;

                  const Icon = step.icon;

                  return (
                    <div
                      key={step.label}
                      className="
                          flex
                          flex-1
                          flex-col
                          items-center
                        "
                    >
                      {/* LINE + ICON */}

                      <div className="relative flex w-full items-center justify-center">
                        {/* LEFT LINE */}
                        {index !== 0 && (
                          <div
                            className={`
                                absolute
                                left-0
                                top-1/2
                                h-[3px]
                                w-1/2
                                -translate-y-1/2
                                ${completed ? "bg-[#aaff5a]" : "bg-white/10"}
                              `}
                          />
                        )}

                        {/* RIGHT LINE */}
                        {index !== trackingSteps.length - 1 && (
                          <div
                            className={`
                                absolute
                                right-0
                                top-1/2
                                h-[3px]
                                w-1/2
                                -translate-y-1/2
                                ${
                                  index < currentIndex
                                    ? "bg-[#aaff5a]"
                                    : "bg-white/10"
                                }
                              `}
                          />
                        )}

                        {/* ICON */}
                        <div
                          className={`
                              relative
                              z-10
                              grid
                              h-14
                              w-14
                              place-items-center
                              rounded-full
                              transition
                              ${
                                completed
                                  ? "bg-[#aaff5a] text-[#070a0f]"
                                  : "bg-white/10 text-slate-400"
                              }
                            `}
                        >
                          <Icon size={24} />
                        </div>
                      </div>

                      {/* LABEL */}

                      <p
                        className={`
                            mt-4
                            text-center
                            text-sm
                            font-semibold
                            ${completed ? "text-white" : "text-slate-500"}
                          `}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================= */}
            {/* FOOTER */}
            {/* ========================= */}

            <div
              className="
                mt-10
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-5
              "
            >
              <p className="text-sm text-slate-400">Current Status</p>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-[#aaff5a]
                "
              >
                {selectedOrder.status}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
