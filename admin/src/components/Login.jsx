// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { backendurl } from "../App";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { Lock, Mail } from "lucide-react";

// const Login = ({ settoken }) => {
//   const [email, setemail] = useState("");
//   const [password, setpassword] = useState("");
//   const navigate = useNavigate();

//   const onsubmithandler = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(backendurl + "/api/auth/admin", {
//         email,
//         password,
//       });
//       if (response.data.success) {
//         settoken(response.data.token);
//         toast.success("Admin logged in successfully");
//       } else {
//         toast.error(response.data.message || "Login failed");
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Login failed. Please check your credentials.",
//       );
//     }
//   };

//   useEffect(() => {
//     if (settoken && localStorage.getItem("token")) {
//       setTimeout(() => navigate("/dashboard"), 600);
//     }
//   }, [settoken, navigate]);

//   return (
//     <div className="grid min-h-screen place-items-center px-4 py-10">
//       <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[#0b1018] shadow-[0_30px_100px_rgba(0,0,0,0.42)] lg:grid-cols-[1.1fr_0.9fr]">
//         <div className="relative hidden min-h-[620px] overflow-hidden bg-[#10151f] p-10 lg:block">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(170,255,90,.28),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(255,111,97,.22),transparent_30%)]" />
//           <div className="relative z-10 flex h-full flex-col justify-between">
//             <div>
//               <p className="admin-kicker">Nexora admin</p>
//               <h1 className="mt-5 max-w-md text-6xl font-black leading-[0.95] text-white">
//                 Control the store with clarity.
//               </h1>
//             </div>
//             <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
//               <p className="text-sm text-slate-400">Default local login</p>
//               <p className="mt-2 font-black text-white">admin@shoppiko.com</p>
//               <p className="mt-1 font-black text-[#aaff5a]">admin123</p>
//             </div>
//           </div>
//         </div>

//         <div className="p-7 sm:p-10">
//           <p className="admin-kicker">Secure access</p>
//           <h2 className="mt-3 text-4xl font-black text-white">Admin login</h2>
//           <p className="mt-3 text-sm leading-6 text-slate-400">
//             Sign in to manage products, orders, and dashboard performance.
//           </p>

//           <form onSubmit={onsubmithandler} className="mt-8 space-y-5">
//             <Field
//               icon={Mail}
//               type="email"
//               placeholder="admin@shoppiko.com"
//               value={email}
//               onChange={(e) => setemail(e.target.value)}
//             />
//             <Field
//               icon={Lock}
//               type="password"
//               placeholder="admin123"
//               value={password}
//               onChange={(e) => setpassword(e.target.value)}
//             />
//             <button
//               type="submit"
//               className="w-full rounded-full bg-[#aaff5a] py-3.5 font-black text-[#070a0f] transition hover:bg-white"
//             >
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// const Field = ({ icon: Icon, ...props }) => (
//   <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-slate-300 focus-within:border-[#aaff5a]">
//     <Icon size={18} className="text-[#aaff5a]" />
//     <input
//       {...props}
//       required
//       className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
//     />
//   </label>
// );

// export default Login;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendurl } from "../App";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const Login = ({ settoken }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const onsubmithandler = async (e) => {
    e.preventDefault();

    try {
      setloading(true);

      const response = await axios.post(backendurl + "/api/auth/admin", {
        email,
        password,
      });

      if (response.data.success) {
        settoken(response.data.token);
        localStorage.setItem("token", response.data.token);

        toast.success("Welcome back, Admin 🚀");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      );
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-[#aaff5a]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden flex-col justify-between p-14 lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#aaff5a] text-black shadow-[0_0_40px_rgba(170,255,90,0.45)]">
                <ShieldCheck size={26} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-wide">
                  NEXORA ADMIN
                </h1>
                <p className="text-sm text-slate-400">
                  Premium commerce control panel
                </p>
              </div>
            </div>

            <div className="mt-20 max-w-xl">
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#aaff5a]">
                <Sparkles size={16} />
                Enterprise Dashboard
              </p>

              <h2 className="text-7xl font-black leading-[0.9]">
                Manage your store with elegance.
              </h2>

              <p className="mt-8 max-w-lg text-lg leading-8 text-slate-400">
                Track products, monitor orders, analyze revenue, and control
                your business from one premium admin experience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#aaff5a]/20 text-[#aaff5a]">
              <ShieldCheck size={28} />
            </div>

            <div>
              <h3 className="text-lg font-bold">Secure Authentication</h3>
              <p className="text-sm text-slate-400">
                End-to-end encrypted admin access with advanced session
                protection.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-[36px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#aaff5a]">
                Secure Login
              </p>

              <h2 className="mt-3 text-5xl font-black">Welcome back</h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Login to continue managing your dashboard and monitor your
                business analytics.
              </p>
            </div>

            <form onSubmit={onsubmithandler} className="space-y-5">
              <Field
                icon={Mail}
                type="email"
                placeholder="admin@nexora.com"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />

              <Field
                icon={Lock}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#aaff5a] py-4 text-sm font-black text-black transition-all duration-300 hover:scale-[1.02] hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Authenticating..." : "Login to Dashboard"}

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Protected admin portal • Nexora Commerce Suite
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
      />
    </div>
  );
};

const Field = ({ icon: Icon, ...props }) => (
  <label className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0f1725]/80 px-5 py-4 transition-all duration-300 focus-within:border-[#aaff5a] focus-within:shadow-[0_0_30px_rgba(170,255,90,0.15)]">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-slate-400 transition-all duration-300 group-focus-within:bg-[#aaff5a]/20 group-focus-within:text-[#aaff5a]">
      <Icon size={18} />
    </div>

    <input
      {...props}
      required
      className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500"
    />
  </label>
);

export default Login;