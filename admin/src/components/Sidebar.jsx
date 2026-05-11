import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  PackagePlus,
  ShoppingBag,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add", label: "Add Product", icon: PackagePlus },
  { to: "/list", label: "Catalog", icon: ListChecks },
  { to: "/order", label: "Orders", icon: ShoppingBag },
];

const Sidebar = () => {
  return (
    <>
      <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-72 shrink-0 border-r border-white/10 bg-[#0b1018]/92 p-4 backdrop-blur-xl md:block">
        <div className="admin-panel flex h-full flex-col rounded-[28px] p-4">
          <div className="mb-5 rounded-2xl border border-[#aaff5a]/20 bg-[#aaff5a]/10 p-4">
            <p className="admin-kicker">Workspace</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
              Manage product flow, order status, and store performance.
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavItem key={to} to={to} label={label} Icon={Icon} />
            ))}
          </nav>

          {/* <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Local backend</p>
            <p className="mt-2 text-sm font-semibold text-white">http://localhost:4000</p>
          </div> */}
        </div>
      </aside>

      <nav className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-4 gap-2 rounded-[24px] border border-white/10 bg-[#0b1018]/92 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `grid min-h-14 place-items-center rounded-2xl text-[11px] font-black transition ${
                isActive ? "bg-[#aaff5a] text-[#070a0f]" : "text-slate-300"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="mt-1">{label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

const NavItem = ({ to, label, Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
        isActive
          ? "bg-[#aaff5a] text-[#070a0f] shadow-[0_12px_30px_rgba(170,255,90,0.22)]"
          : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
      }`
    }
  >
    <Icon className="h-5 w-5 shrink-0" />
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;
