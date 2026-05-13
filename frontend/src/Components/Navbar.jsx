import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { User, Package, LogOut, Home, Info, Phone, Shirt, Search, X } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const { cartcount, token, settoken, setcartitem, backendurl } = useContext(ShopContext);

  const logout = () => {
    localStorage.removeItem("token");
    settoken("");
    setcartitem({});
    navigate("/login");
  };

  // Load trending on open
  useEffect(() => {
    if (searchOpen) {
      axios.get(`${backendurl}/api/search/trending`)
        .then((res) => { if (res.data.success) setTrending(res.data.trending); })
        .catch(() => {});
    }
  }, [searchOpen]);

  // Debounced suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${backendurl}/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`,
        );
        if (res.data.success) setSuggestions(res.data.suggestions);
      } catch (_) {}
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const handleSearch = (q) => {
    const query = q || searchQuery;
    if (!query.trim()) return;
    setSearchOpen(false);
    setShowDropdown(false);
    setSearchQuery("");
    navigate(`/collection?q=${encodeURIComponent(query.trim())}`);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div className="sticky top-0 bg-[#080b10]/90 text-white backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.22)] border-b border-white/10 px-3 xs:px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-3 h-24 flex items-center justify-between font-medium transition-all duration-300 z-50">
        <Link to="/" className="flex-shrink-0 h-full flex items-center gap-2">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-full w-auto object-contain"
          />
          <span className="text-white font-extrabold text-xl sm:text-2xl tracking-tight hover:scale-105 transition-transform duration-300">
            NEXORA
          </span>
        </Link>

        <ul className="hidden lg:flex gap-1 xl:gap-2 text-sm">
          {[
            { name: "HOME", to: "/" },
            { name: "COLLECTION", to: "/collection" },
            { name: "ABOUT", to: "/about" },
            { name: "CONTACT", to: "/contact" },
          ].map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              className={({ isActive }) =>
                `px-3 xl:px-4 py-2 rounded-full font-semibold tracking-wide uppercase text-xs xl:text-sm
                transition-all duration-300 ease-in-out transform relative overflow-hidden group
                ${
                  isActive
                    ? "bg-[#aaff5a] text-[#080b10] shadow-md scale-105"
                    : "text-slate-200 hover:text-[#aaff5a] hover:scale-105 hover:bg-white/10"
                }`
              }
            >
              <span className="relative z-10">{item.name}</span>
              <div className="absolute inset-0 bg-[#aaff5a] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></div>
            </NavLink>
          ))}
        </ul>

        <div className="flex items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          {/* SEARCH */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => { setSearchOpen((p) => !p); setShowDropdown(true); }}
              className="p-2 rounded-full bg-white/80 hover:bg-[#aaff5a] transition-all duration-300"
              aria-label="Search"
            >
              <Search size={18} className="text-[#080b10]" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/10 bg-[#10151f] p-3 shadow-2xl z-50">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")}>
                      <X size={14} className="text-slate-400 hover:text-white" />
                    </button>
                  )}
                </div>

                {showDropdown && (
                  <div className="mt-2">
                    {suggestions.length > 0 ? (
                      <div>
                        <p className="px-2 py-1 text-xs font-black uppercase tracking-widest text-slate-500">
                          Suggestions
                        </p>
                        {suggestions.map((s) => (
                          <button
                            key={s._id}
                            onClick={() => handleSearch(s.name)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10"
                          >
                            {s.image && (
                              <img src={s.image} alt="" className="h-8 w-8 rounded-lg object-cover" />
                            )}
                            <span className="flex-1 truncate">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    ) : trending.length > 0 && !searchQuery ? (
                      <div>
                        <p className="px-2 py-1 text-xs font-black uppercase tracking-widest text-slate-500">
                          Trending
                        </p>
                        {trending.map((t) => (
                          <button
                            key={t}
                            onClick={() => handleSearch(t)}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10"
                          >
                            <Search size={12} className="text-slate-500" />
                            {t}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="group relative">
            <button
              onClick={() => !token && navigate("/login")}
              className="p-2 rounded-full bg-white/80 hover:bg-[#aaff5a] transition-all duration-300 group"
              aria-label="Profile"
            >
              <img
                src={assets.profile_icon}
                className="w-4 xs:w-5 sm:w-5 group-hover:scale-110 transition-transform duration-300"
                alt="Profile"
              />
            </button>

            {token && (
              <div className="group-hover:block hidden absolute right-0 top-full pt-2 transition-all duration-300">
                <div className="flex flex-col gap-1 w-44 px-2 py-3 bg-[#10151f] border border-white/10 rounded-xl shadow-lg backdrop-blur-sm">
                  {[
                    {
                      label: "My Profile",
                      onClick: () => navigate("/profile"),
                      icon: <User size={16} />,
                    },
                    {
                      label: "Orders",
                      onClick: () => navigate("/order"),
                      icon: <Package size={16} />,
                    },
                    {
                      label: "Logout",
                      onClick: logout,
                      icon: <LogOut size={16} />,
                    },
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-sm text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-[#aaff5a] active:scale-95 group/item"
                    >
                      <span className="text-base group-hover/item:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/cart"
            className="relative p-2 rounded-full bg-white/60 hover:bg-[#aaff5a] transition-all duration-300 group"
            aria-label="Shopping Cart"
          >
            <img
              src={assets.cart_icon}
              className="w-4 xs:w-5 sm:w-5 group-hover:scale-110 transition-transform duration-300"
              alt="Cart"
            />
            {cartcount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 xs:w-6 xs:h-6 bg-[#ff6f61] text-white rounded-full flex items-center justify-center text-[10px] xs:text-xs font-bold shadow-md animate-pulse">
                {cartcount() > 99 ? "99+" : cartcount()}
              </span>
            )}
          </Link>

          <button
            onClick={() => setVisible((prev) => !prev)}
            className="lg:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group"
            aria-label="Menu"
          >
            <div className="relative w-5 h-5 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${visible ? "rotate-45 translate-y-0" : "-translate-y-1"}`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${visible ? "opacity-0" : "opacity-100 my-1"}`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${visible ? "-rotate-45 translate-y-0" : "translate-y-1"}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-40 lg:hidden ${
          visible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setVisible(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#10151f] text-white shadow-xl transition-all duration-500 ease-in-out z-50 lg:hidden ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 xs:p-6 border-b border-white/10 bg-[#10151f]">
            <div className="flex items-center gap-3">
              <img
                src={assets.logo}
                className="w-8 h-8 rounded-lg"
                alt="Logo"
              />
              <h2 className="font-bold text-lg text-white">Menu</h2>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="p-2 rounded-full hover:bg-white/50 transition-all duration-300"
              aria-label="Close Menu"
            >
              <div className="w-5 h-5 relative">
                <span className="absolute inset-0 w-5 h-0.5 bg-[#cbd5e1] rotate-45 top-2"></span>
                <span className="absolute inset-0 w-5 h-0.5 bg-[#cbd5e1] -rotate-45 top-2"></span>
              </div>
            </button>
          </div>

          <div className="flex-1 py-4">
            <nav className="space-y-1 px-4">
              {[
                { name: "HOME", to: "/", icon: <Home size={18} /> },
                {
                  name: "COLLECTION",
                  to: "/collection",
                  icon: <Shirt size={18} />,
                },
                { name: "ABOUT", to: "/about", icon: <Info size={18} /> },
                { name: "CONTACT", to: "/contact", icon: <Phone size={18} /> },
              ].map((item, i) => (
                <NavLink
                  key={i}
                  onClick={() => setVisible(false)}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-[#aaff5a] text-[#080b10] shadow-md"
                        : "text-slate-200 hover:bg-white/10 hover:text-[#aaff5a]"
                    }`
                  }
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="font-semibold text-base tracking-wide">
                    {item.name}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>

          {token && (
            <div className="border-t border-white/10 p-4">
              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold text-[#999] uppercase tracking-wider">
                  Account
                </div>
                {[
                  {
                    label: "My Profile",
                    onClick: () => {
                      setVisible(false);
                      navigate("/profile");
                    },
                    icon: <User size={18} />,
                  },
                  {
                    label: "Orders",
                    onClick: () => {
                      setVisible(false);
                      navigate("/order");
                    },
                    icon: <Package size={18} />,
                  },
                  {
                    label: "Logout",
                    onClick: () => {
                      setVisible(false);
                      logout();
                    },
                    icon: <LogOut size={18} />,
                  },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-left transition-all duration-200 hover:bg-white/10 hover:text-[#aaff5a] active:scale-95 group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!token && (
            <div className="border-t border-white/10 p-4">
              <button
                onClick={() => {
                  setVisible(false);
                  navigate("/login");
                }}
                className="w-full bg-[#aaff5a] text-[#080b10] py-3 rounded-xl font-extrabold transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
