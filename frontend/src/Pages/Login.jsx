import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Login = () => {
  const [currentsate, setcurrentstate] = useState("Login");
  const { token, settoken, backendurl, navigate } = useContext(ShopContext);
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentsate === "Sign Up") {
        const response = await axios.post(backendurl + "/api/auth/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          settoken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("User is Successfully Registered");
        } else {
          toast.error(response.data.message || "Signup failed");
        }
      } else {
        const response = await axios.post(backendurl + "/api/auth/login", {
          email,
          password,
        });
        if (response.data.success) {
          settoken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Logged in successfully");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [token, navigate]);

  return (
    <div className="min-h-[70vh] border-t border-white/10 pt-12 text-white">
      <form
        onSubmit={onSubmitHandler}
        className="m-auto flex w-[90%] max-w-md flex-col items-center gap-5 rounded-[28px] border border-white/10 bg-[#10151f] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
      >
        <div className="mb-2 mt-2 text-center">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#aaff5a]">
            Nexora account
          </p>
          <p className="mt-3 text-4xl font-black">{currentsate}</p>
        </div>

        {currentsate === "Login" ? null : (
          <input
            onChange={(e) => setname(e.target.value)}
            value={name}
            type="text"
            className="w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]"
            placeholder="Name"
            required
          />
        )}

        <input
          onChange={(e) => setemail(e.target.value)}
          value={email}
          type="email"
          className="w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]"
          placeholder="Email"
          required
        />

        <input
          onChange={(e) => setpassword(e.target.value)}
          value={password}
          type="password"
          className="w-full rounded-xl border border-white/10 bg-[#17202b] px-4 py-3 text-white outline-none focus:border-[#aaff5a]"
          placeholder="Password"
          required
        />

        <div className="flex w-full justify-between gap-4 text-sm mt-2 text-slate-300">
          <p className="cursor-pointer hover:text-[#aaff5a]">
            Forgot password?
          </p>
          {currentsate === "Login" ? (
            <p
              className="cursor-pointer hover:underline"
              onClick={() => setcurrentstate("Sign Up")}
            >
              Create account
            </p>
          ) : (
            <p
              className="cursor-pointer hover:underline"
              onClick={() => setcurrentstate("Login")}
            >
              Login Here
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-[#aaff5a] px-6 py-3 mt-4 font-black text-[#080b10] hover:bg-white transition-all duration-200"
        >
          {currentsate === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
