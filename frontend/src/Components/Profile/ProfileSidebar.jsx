import React from "react";

import { User, ShoppingBag, Heart, MapPin, Eye } from "lucide-react";

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const menu = [
    {
      key: "profile",
      label: "My Profile",
      icon: User,
    },

    {
      key: "orders",
      label: "My Orders",
      icon: ShoppingBag,
    },

    {
      key: "wishlist",
      label: "Wishlist",
      icon: Heart,
    },

    {
      key: "addresses",
      label: "Addresses",
      icon: MapPin,
    },

    {
      key: "recent",
      label: "Recently Viewed",
      icon: Eye,
    },
  ];

  return (
    <div
      className="
        rounded-[30px]
        border
        border-white/10
        bg-white/[0.05]
        p-5
        backdrop-blur-xl
      "
    >
      <h2
        className="
          mb-6
          text-2xl
          font-black
        "
      >
        My Account
      </h2>

      <div className="space-y-3">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`
                  flex
                  w-full
                  items-center
                  gap-4
                  rounded-2xl
                  px-5
                  py-4
                  transition-all
                  duration-300
                  ${
                    activeTab === item.key
                      ? "bg-[#aaff5a] text-[#070a0f]"
                      : "bg-white/[0.03] text-white hover:bg-white/[0.07]"
                  }
                `}
            >
              <Icon size={20} />

              <span className="font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSidebar;
