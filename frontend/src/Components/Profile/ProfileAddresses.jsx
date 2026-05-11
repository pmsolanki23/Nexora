import React, { useContext, useState } from "react";

import { toast } from "react-toastify";

import { Trash2, Plus, MapPin, Pencil, X } from "lucide-react";

import { ShopContext } from "../../Context/ShopContext";

const ProfileAddresses = () => {
  const { addresses, addAddress, deleteAddress, updateAddress } =
    useContext(ShopContext);

  // =========================
  // STATES
  // =========================

  const [showForm, setshowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setformData] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
    address: "",
    landmark: "",
  });

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setformData({
      fullName: "",
      phone: "",
      pincode: "",
      city: "",
      state: "",
      country: "India",
      address: "",
      landmark: "",
    });

    setEditId(null);

    setshowForm(false);
  };

  // =========================
  // EDIT ADDRESS
  // =========================

  const handleEdit = (item) => {
    setformData({
      fullName: item.fullName,
      phone: item.phone,
      pincode: item.pincode,
      city: item.city,
      state: item.state,
      country: item.country,
      address: item.address,
      landmark: item.landmark,
    });

    setEditId(item._id);

    setshowForm(true);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Please fill required fields");

      return;
    }

    // =========================
    // UPDATE
    // =========================

    if (editId) {
      await updateAddress(editId, formData);
    } else {
      // =========================
      // ADD
      // =========================

      await addAddress(formData);
    }

    resetForm();
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
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">Saved Addresses</h2>

          <p className="mt-2 text-slate-400">Manage your delivery locations</p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setshowForm(true);
            }
          }}
          className="
              flex
              items-center
              gap-2
              rounded-full
              bg-[#aaff5a]
              px-6
              py-3
              font-black
              text-[#070a0f]
            "
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}

          {showForm ? "Close" : "Add Address"}
        </button>
      </div>

      {/* FORM */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="
              mt-8
              grid
              gap-5
              rounded-3xl
              border
              border-white/10
              bg-[#10151f]
              p-6
              md:grid-cols-2
            "
        >
          {[
            {
              name: "fullName",
              placeholder: "Full Name",
            },

            {
              name: "phone",
              placeholder: "Phone Number",
            },

            {
              name: "pincode",
              placeholder: "Pincode",
            },

            {
              name: "city",
              placeholder: "City",
            },

            {
              name: "state",
              placeholder: "State",
            },

            {
              name: "landmark",
              placeholder: "Landmark",
            },
          ].map((field) => (
            <input
              key={field.name}
              type="text"
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#070a0f]
                    px-5
                    py-4
                    outline-none
                  "
            />
          ))}

          <textarea
            rows="4"
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
            className="
                md:col-span-2
                rounded-2xl
                border
                border-white/10
                bg-[#070a0f]
                px-5
                py-4
                outline-none
              "
          />

          <button
            type="submit"
            className="
                md:col-span-2
                rounded-full
                bg-[#aaff5a]
                px-8
                py-4
                font-black
                text-[#070a0f]
              "
          >
            {editId ? "Update Address" : "Save Address"}
          </button>
        </form>
      )}

      {/* ADDRESS LIST */}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {addresses.length > 0 ? (
          addresses.map((item) => (
            <div
              key={item._id}
              className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-[#10151f]
                    p-6
                  "
            >
              <div className="flex items-start justify-between gap-4">
                {/* LEFT */}

                <div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#aaff5a]" />

                    <h3 className="text-xl font-bold">{item.fullName}</h3>
                  </div>

                  <p className="mt-3 text-slate-300">{item.address}</p>

                  <p className="mt-2 text-slate-400">
                    {item.city}, {item.state} - {item.pincode}
                  </p>

                  <p className="mt-2 text-slate-400">{item.phone}</p>
                </div>

                {/* RIGHT */}

                <div className="flex items-center gap-3">
                  {/* EDIT */}

                  <button
                    onClick={() => handleEdit(item)}
                    className="
                          rounded-full
                          border
                          border-[#aaff5a]/20
                          bg-[#aaff5a]/10
                          p-3
                          text-[#aaff5a]
                          transition
                          hover:bg-[#aaff5a]
                          hover:text-[#070a0f]
                        "
                  >
                    <Pencil size={18} />
                  </button>

                  {/* DELETE */}

                  <button
                    onClick={() => deleteAddress(item._id)}
                    className="
                          rounded-full
                          border
                          border-red-500/20
                          bg-red-500/10
                          p-3
                          text-red-500
                          transition
                          hover:bg-red-500
                          hover:text-white
                        "
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="
                rounded-3xl
                border
                border-dashed
                border-white/10
                p-10
                text-center
                text-slate-500
              "
          >
            No saved addresses yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAddresses;
