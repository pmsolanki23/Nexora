import React, { useState } from "react";

import ProfileSidebar from "../Components/Profile/ProfileSidebar";

import ProfileInfo from "../Components/Profile/ProfileInfo";

import ProfileAddresses from "../Components/Profile/ProfileAddresses";

import ProfileWishlist from "../Components/Profile/ProfileWishlist";

import ProfileRecentlyViewed from "../Components/Profile/ProfileRecentlyViewed";

import ProfileOrders from "../Components/Profile/ProfileOrders";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo />;

      case "orders":
        return <ProfileOrders />;

      case "wishlist":
        return <ProfileWishlist />;

      case "addresses":
        return <ProfileAddresses />;

      case "recent":
        return <ProfileRecentlyViewed />;

      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#070a0f]
        px-4
        py-10
        text-white
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-7xl
          gap-8
          lg:grid-cols-[280px_1fr]
        "
      >
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
