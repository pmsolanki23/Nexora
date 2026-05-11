import React, { useContext, useEffect, useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import { Camera } from "lucide-react";

import { ShopContext } from "../../Context/ShopContext";

const ProfileInfo = () => {
  const { userData, backendurl, token, getUserProfile, setuserData } =
    useContext(ShopContext);

  const [loading, setloading] = useState(false);

  const [image, setimage] = useState(null);

  const [formData, setformData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // =========================
  // LOAD USER DATA
  // =========================

  useEffect(() => {
    if (userData) {
      setformData({
        name: userData.name || "",

        email: userData.email || "",

        phone: userData.phone || "",
      });
    }
  }, [userData]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    setformData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const updateProfile = async () => {
    try {
      setloading(true);

      const response = await axios.post(
        backendurl + "/api/user/update-profile",

        formData,

        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        toast.success("Profile Updated");

        getUserProfile();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    } finally {
      setloading(false);
    }
  };

  // =========================
  // UPLOAD PROFILE IMAGE
  // =========================

  const uploadImage = async (selectedImage) => {
    try {
      const data = new FormData();

      data.append("image", selectedImage);

      const response = await axios.post(
        backendurl + "/api/user/upload-profile-image",

        data,

        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        toast.success("Profile Image Updated");

        setuserData((prev) => ({
          ...prev,

          profileImage: response.data.image,
        }));
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className="
        rounded-[30px]
        border
        border-white/10
        bg-white/[0.05]
        p-8
        backdrop-blur-xl
      "
    >
      {/* ========================= */}
      {/* TOP */}
      {/* ========================= */}

      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        {/* IMAGE */}

        <div className="relative w-max">
          <img
            className="
              h-32
              w-32
              rounded-full
              border-4
              border-[#aaff5a]/30
              object-cover
              bg-[#10151f]
            "
            src={
              image
                ? URL.createObjectURL(image)
                : userData?.profileImage ||
                  "https://placehold.co/200x200/10151f/FFFFFF?text=User"
            }
            alt=""
          />

          <label
            className="
              absolute
              bottom-1
              right-1
              grid
              h-10
              w-10
              cursor-pointer
              place-items-center
              rounded-full
              bg-[#aaff5a]
              text-[#070a0f]
            "
          >
            <Camera size={18} />

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setimage(file);

                  uploadImage(file);
                }
              }}
            />
          </label>
        </div>

        {/* USER INFO */}

        <div>
          <h2
            className="
              text-4xl
              font-black
              text-white
            "
          >
            {userData?.name}
          </h2>

          <p className="mt-2 text-slate-400">{userData?.email}</p>

          <div
            className="
              mt-4
              inline-flex
              rounded-full
              border
              border-[#aaff5a]/20
              bg-[#aaff5a]/10
              px-4
              py-2
              text-sm
              font-bold
              text-[#aaff5a]
            "
          >
            Premium Member
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* FORM */}
      {/* ========================= */}

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm text-slate-400">Full Name</p>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-[#10151f]
              px-5
              py-4
              outline-none
            "
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-400">Email</p>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-[#10151f]
              px-5
              py-4
              outline-none
            "
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-400">Phone Number</p>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-[#10151f]
              px-5
              py-4
              outline-none
            "
          />
        </div>
      </div>

      {/* BUTTON */}

      <button
        onClick={updateProfile}
        disabled={loading}
        className="
          mt-10
          rounded-full
          bg-[#aaff5a]
          px-8
          py-4
          font-black
          uppercase
          tracking-[0.12em]
          text-[#070a0f]
          transition
          hover:scale-105
        "
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default ProfileInfo;
