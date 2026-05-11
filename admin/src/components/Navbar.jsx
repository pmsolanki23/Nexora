import React from "react";
import { assets } from "../assets/assets";
import { Bell, LogOut, Search } from "lucide-react";

const Navbar = ({ settoken }) => {
  const logout = () => {
    localStorage.removeItem("token");
    settoken("");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#070a0f]/88 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-11 w-11 rounded-2xl border border-white/10 bg-white object-contain p-1 shadow-lg"
          />
          <div className="min-w-0">
            <p className="admin-kicker hidden sm:block">Commerce cockpit</p>
            <h1 className="truncate text-lg font-black text-white sm:text-2xl">
              NexoraAdmin
            </h1>
          </div>
        </div>
{/* 
        <div className="hidden min-w-0 max-w-md flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-slate-400 md:flex">
          <Search size={17} />
          <span className="text-sm">Search orders, products, customers</span>
        </div> */}

        <div className="flex items-center gap-2">
          {/* <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-[#aaff5a]/60 hover:text-[#aaff5a]"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button> */}
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full bg-[#aaff5a] px-4 py-2 text-sm font-black text-[#070a0f] transition hover:bg-white"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
