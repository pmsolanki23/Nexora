import React, { useContext, useState } from "react";
import Tittle from "../Components/Tittle";
import CartTotal from "../Components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setmethod] = useState("cod");

  const {
    navigate,
    token,
    cartitem,
    setcartitem,
    delivery_fee,
    cartamount,
    products,
    backendurl,
    addresses,
  } = useContext(ShopContext);

  const [selectedAddress, setselectedAddress] = useState(null);

  const [formdata, setformdata] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
  });

  const onchangehandlet = (e) => {
    const { name, value } = e.target;
    setformdata((prev) => ({ ...prev, [name]: value }));
  };

  const selectAddress = (item) => {
    setselectedAddress(item._id);
    setformdata({
      firstname: item.fullName?.split(" ")[0] || "",
      lastname: item.fullName?.split(" ").slice(1).join(" ") || "",
      email: "",
      street: item.address,
      city: item.city,
      state: item.state,
      zipcode: item.pincode,
      country: item.country,
      phone: item.phone,
    });
  };

  const buildOrderItems = () => {
    let orderitem = [];
    for (const items in cartitem) {
      for (const item in cartitem[items]) {
        if (cartitem[items][item] > 0) {
          const [productId, color] = items.split("__");
          const iteminfo = structuredClone(
            products.find((product) => product._id === productId),
          );
          if (iteminfo) {
            iteminfo.size = item;
            iteminfo.quantity = cartitem[items][item];
            if (color) iteminfo.color = color;
            orderitem.push(iteminfo);
          }
        }
      }
    }
    return orderitem;
  };

  const onsubmithandler = async (e) => {
    e.preventDefault();
    try {
      const orderitem = buildOrderItems();
      const orderData = {
        address: formdata,
        items: orderitem,
        amount: cartamount() + delivery_fee,
        paymentMethod: method,
      };

      let response;

      switch (method) {
        case "stripe":
          response = await axios.post(
            backendurl + "/api/order/stripe",
            orderData,
            { headers: { token } },
          );
          if (response.data.success) {
            const { session_url } = response.data;
            if (session_url) {
              window.location.replace(session_url);
            } else {
              toast.error(response.data.message);
            }
          } else {
            toast.error(response.data.message);
          }
          break;

        case "razorpay":
          response = await axios.post(
            backendurl + "/api/order/razorpay",
            orderData,
            { headers: { token } },
          );
          if (response.data.success) {
            const { order: rzpOrder, orderId: dbOrderId } = response.data;

            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID,
              amount: rzpOrder.amount,
              currency: "INR",
              name: "Nexora",
              description: "Order Payment",
              order_id: rzpOrder.id,
              handler: async (paymentResponse) => {
                try {
                  const verifyRes = await axios.post(
                    backendurl + "/api/order/verifyRazorpay",
                    {
                      razorpay_order_id: paymentResponse.razorpay_order_id,
                      razorpay_payment_id: paymentResponse.razorpay_payment_id,
                      razorpay_signature: paymentResponse.razorpay_signature,
                      orderId: dbOrderId,
                    },
                    { headers: { token } },
                  );
                  if (verifyRes.data.success) {
                    setcartitem({});
                    toast.success("Payment successful!");
                    navigate("/order");
                  } else {
                    toast.error(verifyRes.data.message || "Payment verification failed");
                  }
                } catch (err) {
                  toast.error("Payment verification failed");
                }
              },
              prefill: {
                name: `${formdata.firstname} ${formdata.lastname}`,
                email: formdata.email,
                contact: formdata.phone,
              },
              theme: { color: "#aaff5a" },
            };

            if (!window.Razorpay) {
              toast.error("Razorpay SDK not loaded. Please refresh.");
              return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();
          } else {
            toast.error(response.data.message);
          }
          break;

        case "cod":
          response = await axios.post(
            `${backendurl}/api/order/cod`,
            orderData,
            { headers: { token } },
          );
          if (response.data.success) {
            setcartitem({});
            navigate("/order");
          } else {
            toast.error(response.data.message);
          }
          break;

        default:
          toast.error("Invalid payment method.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={onsubmithandler}
      className="flex min-h-[80vh] flex-col justify-between gap-8 pt-5 text-white lg:flex-row"
    >
      {/* LEFT */}
      <div className="w-full lg:w-[55%]">
        {/* SAVED ADDRESSES */}
        {addresses.length > 0 && (
          <div className="mb-8">
            <div className="mb-5">
              <Tittle text1={"SAVED"} text2={"ADDRESSES"} />
            </div>
            <div className="grid gap-4">
              {addresses.map((item) => (
                <div
                  key={item._id}
                  onClick={() => selectAddress(item)}
                  className={`cursor-pointer rounded-[24px] border p-5 transition-all duration-200 ${
                    selectedAddress === item._id
                      ? "border-[#aaff5a] bg-[#aaff5a]/10"
                      : "border-white/10 bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-white">{item.fullName}</h3>
                      <p className="mt-2 text-sm text-slate-300">{item.address}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.city}, {item.state} - {item.pincode}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">{item.phone}</p>
                    </div>
                    {selectedAddress === item._id && (
                      <div className="rounded-full bg-[#aaff5a] px-4 py-2 text-xs font-black text-[#080b10]">
                        SELECTED
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DELIVERY FORM */}
        <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <div className="mb-6 text-xl sm:text-2xl">
            <Tittle text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>

          <div className="flex gap-3">
            <input required type="text" name="firstname" value={formdata.firstname} onChange={onchangehandlet} placeholder="First name" className="w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]" />
            <input required type="text" name="lastname" value={formdata.lastname} onChange={onchangehandlet} placeholder="Last name" className="w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]" />
          </div>
          <input required type="email" name="email" value={formdata.email} onChange={onchangehandlet} placeholder="Email address" className="mt-4 w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]" />
          <input required type="text" name="street" value={formdata.street} onChange={onchangehandlet} placeholder="Street" className="mt-4 w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]" />
          <div className="mt-4 flex gap-3">
            <input required type="text" name="city" value={formdata.city} onChange={onchangehandlet} placeholder="City" className="w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]" />
            <input required type="text" name="state" value={formdata.state} onChange={onchangehandlet} placeholder="State" className="w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]" />
          </div>
          <div className="mt-4 flex gap-3">
            <input required type="number" name="zipcode" value={formdata.zipcode} onChange={onchangehandlet} placeholder="Zipcode" className="w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]" />
            <input required type="text" name="country" value={formdata.country} onChange={onchangehandlet} placeholder="Country" className="w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]" />
          </div>
          <input required type="text" name="phone" value={formdata.phone} onChange={onchangehandlet} placeholder="Phone" className="mt-4 w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-[40%]">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <CartTotal />
        </div>

        {/* PAYMENT */}
        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <Tittle text1={"PAYMENT"} text2={"METHOD"} />

          <div className="mt-5 flex flex-col gap-4">
            {/* STRIPE */}
            <div
              onClick={() => setmethod("stripe")}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 p-4 transition-all ${method === "stripe" ? "bg-white/10" : ""}`}
            >
              <div className={`h-4 w-4 rounded-full border-2 ${method === "stripe" ? "bg-[#aaff5a]" : "border-white"}`} />
              <img className="h-5" src={assets.stripe_logo} alt="Stripe" />
            </div>

            {/* RAZORPAY */}
            <div
              onClick={() => setmethod("razorpay")}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 p-4 transition-all ${method === "razorpay" ? "bg-white/10" : ""}`}
            >
              <div className={`h-4 w-4 rounded-full border-2 ${method === "razorpay" ? "bg-[#aaff5a]" : "border-white"}`} />
              <img className="h-5" src={assets.razorpay_logo} alt="Razorpay" />
            </div>

            {/* COD */}
            <div
              onClick={() => setmethod("cod")}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 p-4 transition-all ${method === "cod" ? "bg-white/10" : ""}`}
            >
              <div className={`h-4 w-4 rounded-full border-2 ${method === "cod" ? "bg-[#aaff5a]" : "border-white"}`} />
              <p className="font-medium text-white">Cash on Delivery</p>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-full bg-[#aaff5a] px-10 py-4 text-sm font-black text-[#080b10] transition-all duration-200 hover:scale-[1.02] hover:bg-white"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
