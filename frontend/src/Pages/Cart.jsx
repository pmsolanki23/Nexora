import React, { useContext, useEffect, useState } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";
import Tittle from "../Components/Tittle";
import CartTotal from "../Components/CartTotal";
import SlideInLeft from "../Components/SlideInLeft";

const Cart = () => {
  const { products, currency, cartitem, updatequantity, navigate } =
    useContext(ShopContext);
  const [cartdata, setcartdata] = useState([]);

  useEffect(() => {
    const tempdata = [];
    for (const items in cartitem) {
      for (const item in cartitem[items]) {
        if (cartitem[items][item] > 0) {
          tempdata.push({
            id: items,
            size: item,
            quantity: cartitem[items][item],
          });
        }
      }
    }
    setcartdata(tempdata);
  }, [cartitem]);

  return (
    <div className="border-t border-white/10 pt-10 text-white">
      <section className="premium-panel mb-8 rounded-[32px] p-6 sm:p-8">
        <p className="premium-kicker">Checkout studio</p>
        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="text-3xl sm:text-5xl">
            <Tittle text1="Your" text2="Cart" />
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-400">
            Review sizes, quantities, and order total before moving into a clean
            checkout flow.
          </p>
        </div>
      </section>

      {cartdata.length === 0 ? (
        <div className="grid min-h-[320px] place-items-center rounded-[28px] border border-white/10 bg-white/[0.05] text-center">
          <div>
            <ShoppingBag className="mx-auto mb-4 text-[#aaff5a]" size={42} />
            <p className="text-2xl font-black">Your cart is empty</p>
            <button
              onClick={() => navigate("/collection")}
              className="mt-5 rounded-full bg-[#aaff5a] px-7 py-3 font-black text-[#080b10] transition hover:bg-white"
            >
              Shop collection
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            {cartdata.map((item, index) => {
              const productsdata = products.find(
                (product) => product._id === item.id,
              );
              if (!productsdata) return null;

              return (
                <SlideInLeft key={`${item.id}-${item.size}-${index}`}>
                  <div className="premium-card rounded-[26px] p-4">
                    <div className="grid gap-4 sm:grid-cols-[96px_1fr_auto_auto] sm:items-center">
                      <img
                        className="h-28 w-full rounded-2xl object-cover sm:h-24 sm:w-24"
                        src={productsdata.image[0]}
                        alt={productsdata.name}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-lg font-black text-[#10151f]">
                          {productsdata.name}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-600">
                          <span className="text-xl font-black text-[#ff6f61]">
                            {currency}
                            {productsdata.price}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1">
                            Size {item.size}
                          </span>
                        </div>
                      </div>
                      <input
                        onChange={(e) =>
                          e.target.value === "" || e.target.value === "0"
                            ? null
                            : updatequantity(
                                item.id,
                                item.size,
                                Number(e.target.value),
                              )
                        }
                        className="h-11 w-24 rounded-full border border-slate-200 bg-slate-50 px-4 text-center font-black text-[#10151f] outline-none focus:border-[#aaff5a]"
                        type="number"
                        min={1}
                        defaultValue={item.quantity}
                      />
                      <button
                        onClick={() => updatequantity(item.id, item.size, 0)}
                        className="grid h-11 w-11 place-items-center rounded-full bg-[#ff6f61]/12 text-[#ff6f61] transition hover:bg-[#ff6f61] hover:text-white"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </SlideInLeft>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <CartTotal />
            <button
              onClick={() => navigate("/placeorder")}
              className="mt-5 w-full rounded-full bg-[#aaff5a] px-8 py-4 text-sm font-black uppercase tracking-wide text-[#080b10] transition hover:bg-white"
            >
              Proceed to checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
