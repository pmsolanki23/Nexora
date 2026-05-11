import { useSearchParams } from "react-router-dom";
import { useEffect, useContext } from "react";
import axios from "axios";
import { ShieldCheck } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";
import { toast } from "react-toastify";

const Verify = () => {
  const { navigate, token, setcartitem, backendurl } = useContext(ShopContext);
  const [searchparams] = useSearchParams();

  const success = searchparams.get("success");
  const orderid = searchparams.get("orderid");

  const verifypayment = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendurl}/api/order/verifyStripe`,
        { success, orderid },
        { headers: { token } },
      );

      if (response.data.success) {
        setcartitem({});
        navigate("/order");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    verifypayment();
  }, [token]);

  return (
    <div className="grid min-h-[60vh] place-items-center text-white">
      <div className="premium-panel max-w-md rounded-[32px] p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#aaff5a] text-[#080b10]">
          <ShieldCheck size={32} />
        </div>
        <h1 className="mt-6 text-3xl font-black">Verifying payment</h1>
        <p className="mt-3 leading-7 text-slate-400">
          Please wait while we confirm your order and secure your checkout
          session.
        </p>
      </div>
    </div>
  );
};

export default Verify;
