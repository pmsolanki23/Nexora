import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendurl } from "../App";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

const Login = ({ settoken }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const onsubmithandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendurl + "/api/auth/admin", {
        email,
        password,
      });
      if (response.data.success) {
        settoken(response.data.token);
        toast.success("Admin logged in successfully");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    }
  };

  useEffect(() => {
    if (settoken && localStorage.getItem("token")) {
      setTimeout(() => navigate("/dashboard"), 600);
    }
  }, [settoken, navigate]);

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[#0b1018] shadow-[0_30px_100px_rgba(0,0,0,0.42)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-[#10151f] p-10 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(170,255,90,.28),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(255,111,97,.22),transparent_30%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="admin-kicker">Nexora admin</p>
              <h1 className="mt-5 max-w-md text-6xl font-black leading-[0.95] text-white">
                Control the store with clarity.
              </h1>
            </div>
            {/* <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
              <p className="text-sm text-slate-400">Default local login</p>
              <p className="mt-2 font-black text-white">admin@shoppiko.com</p>
              <p className="mt-1 font-black text-[#aaff5a]">admin123</p>
            </div> */}
          </div>
        </div>

        <div className="p-7 sm:p-10">
          <p className="admin-kicker">Secure access</p>
          <h2 className="mt-3 text-4xl font-black text-white">Admin login</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to manage products, orders, and dashboard performance.
          </p>

          {/* <form onSubmit={onsubmithandler} className="mt-8 space-y-5">
            <Field
              icon={Mail}
              type="email"
              placeholder="admin@shoppiko.com"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <Field
              icon={Lock}
              type="password"
              placeholder="admin123"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[#aaff5a] py-3.5 font-black text-[#070a0f] transition hover:bg-white"
            >
              Login
            </button>
          </form> */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const Field = ({ icon: Icon, ...props }) => (
  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-slate-300 focus-within:border-[#aaff5a]">
    <Icon size={18} className="text-[#aaff5a]" />
    <input
      {...props}
      required
      className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
    />
  </label>
);

export default Login;
