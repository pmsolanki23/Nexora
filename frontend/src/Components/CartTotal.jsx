import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import Tittle from "./Tittle";
import SlideInLeft from "./SlideInLeft";

const CartTotal = () => {
  const { currency, delivery_fee, cartamount } = useContext(ShopContext);
  const subtotal = cartamount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <SlideInLeft>
      <div className="premium-panel w-full rounded-[28px] p-6">
        <div className="mb-6 text-2xl">
          <Tittle text1="Cart" text2="Totals" />
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <Row label="Subtotal" value={`${currency}${subtotal}.00`} />
          <Row label="Shipping Fee" value={`${currency}${delivery_fee}.00`} />
          <div className="border-t border-white/10 pt-4">
            <Row label="Total" value={`${currency}${total}.00`} strong />
          </div>
        </div>
      </div>
    </SlideInLeft>
  );
};

const Row = ({ label, value, strong }) => (
  <div
    className={`flex justify-between gap-4 ${strong ? "text-lg font-black text-white" : "font-semibold"}`}
  >
    <p>{label}</p>
    <p>{value}</p>
  </div>
);

export default CartTotal;
