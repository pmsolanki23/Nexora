import React, { useState } from "react";
import { backendurl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Camera,
  Check,
  DollarSign,
  PackagePlus,
  Star,
  Tag,
  Upload,
  X,
} from "lucide-react";

const Add = ({ token }) => {
  const [image1, setimage1] = useState(false);
  const [image2, setimage2] = useState(false);
  const [image3, setimage3] = useState(false);
  const [image4, setimage4] = useState(false);
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState("");
  const [category, setcategory] = useState("Men");
  const [subcategory, setsubcategory] = useState("Topwear");
  const [bestseller, setbestseller] = useState(false);
  const [size, setsize] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onsubmithandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("description", description);
      formdata.append("price", price);
      formdata.append("category", category);
      formdata.append("subCategory", subcategory);
      formdata.append("bestseller", bestseller);
      formdata.append("sizes", JSON.stringify(size));
      image1 && formdata.append("image1", image1);
      image2 && formdata.append("image2", image2);
      image3 && formdata.append("image3", image3);
      image4 && formdata.append("image4", image4);

      const response = await axios.post(
        backendurl + "/api/product/add",
        formdata,
        { headers: { token } },
      );

      if (response.data.success || response.data.sucess) {
        toast.success(response.data.message);
        setname("");
        setdescription("");
        setimage1(false);
        setimage2(false);
        setimage3(false);
        setimage4(false);
        setprice("");
        setsize([]);
        setbestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = [
    [image1, setimage1, "image1", "Main"],
    [image2, setimage2, "image2", "Side"],
    [image3, setimage3, "image3", "Back"],
    [image4, setimage4, "image4", "Detail"],
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-panel rounded-[32px] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#aaff5a] text-[#070a0f]">
            <PackagePlus size={25} />
          </div>
          <div>
            <p className="admin-kicker">Catalog editor</p>
            <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">
              Add new product
            </h1>
            <p className="mt-2 text-slate-400">
              Create polished product listings with images, pricing, and fit
              options.
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit={onsubmithandler}
        className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"
      >
        <section className="admin-panel rounded-[28px] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Camera className="text-[#aaff5a]" />
            <div>
              <h2 className="text-2xl font-black text-white">Product media</h2>
              <p className="text-sm text-slate-400">
                Upload up to 4 product images.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {images.map(([image, setImage, id, label]) => (
              <ImageUpload
                key={id}
                image={image}
                setImage={setImage}
                id={id}
                label={label}
              />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#aaff5a]/20 bg-[#aaff5a]/10 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                onChange={() => setbestseller((prev) => !prev)}
                type="checkbox"
                checked={bestseller}
                className="h-5 w-5 accent-[#aaff5a]"
              />
              <span className="flex items-center gap-2 font-black text-[#aaff5a]">
                <Star size={18} />
                Mark as bestseller
              </span>
            </label>
          </div>
        </section>

        <section className="admin-card rounded-[28px] p-5 sm:p-6">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Product details
            </p>
            <h2 className="mt-1 text-2xl font-black text-[#0b1018]">
              Listing information
            </h2>
          </div>

          <div className="grid gap-5">
            <Field icon={Tag} label="Product name">
              <input
                onChange={(e) => setname(e.target.value)}
                value={name}
                className="admin-input w-full px-4 py-3"
                type="text"
                required
                placeholder="Midnight Utility Hoodie"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field icon={DollarSign} label="Price">
                <input
                  onChange={(e) => setprice(e.target.value)}
                  value={price}
                  className="admin-input w-full px-4 py-3"
                  type="number"
                  placeholder="49"
                  min="0"
                  step="0.01"
                />
              </Field>
              <Field label="Category">
                <select
                  onChange={(e) => setcategory(e.target.value)}
                  value={category}
                  className="admin-input w-full px-4 py-3"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </Field>
            </div>

            <Field label="Sub category">
              <select
                onChange={(e) => setsubcategory(e.target.value)}
                value={subcategory}
                className="admin-input w-full px-4 py-3"
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </Field>

            <Field label="Description">
              <textarea
                onChange={(e) => setdescription(e.target.value)}
                value={description}
                className="admin-input min-h-36 w-full resize-none px-4 py-3"
                required
                placeholder="Write a clear product description..."
              />
            </Field>

            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.15em] text-slate-500">
                Available sizes
              </p>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL", "XXL"].map((sizeLabel) => (
                  <button
                    key={sizeLabel}
                    type="button"
                    onClick={() =>
                      setsize((prev) =>
                        prev.includes(sizeLabel)
                          ? prev.filter((item) => item !== sizeLabel)
                          : [...prev, sizeLabel],
                      )
                    }
                    className={`rounded-full px-5 py-2 text-sm font-black transition ${
                      size.includes(sizeLabel)
                        ? "bg-[#0b1018] text-[#aaff5a]"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {sizeLabel}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#aaff5a] px-7 py-3 font-black text-[#070a0f] transition hover:bg-[#0b1018] hover:text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Adding product
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Add product
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

const Field = ({ icon: Icon, label, children }) => (
  <label className="block">
    <span className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em] text-slate-500">
      {Icon && <Icon size={16} />}
      {label}
    </span>
    {children}
  </label>
);

const ImageUpload = ({ image, setImage, id, label }) => (
  <div className="group relative">
    <label htmlFor={id} className="block cursor-pointer">
      <div className="grid aspect-square place-items-center overflow-hidden rounded-[24px] border-2 border-dashed border-white/12 bg-white/[0.06] transition hover:border-[#aaff5a]/70">
        {image ? (
          <img
            className="h-full w-full object-cover"
            src={URL.createObjectURL(image)}
            alt={label}
          />
        ) : (
          <div className="text-center text-slate-400">
            <Upload className="mx-auto mb-2" />
            <p className="font-black text-white">{label}</p>
          </div>
        )}
      </div>
      <input
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
        id={id}
        className="hidden"
        accept="image/*"
      />
    </label>
    {image && (
      <button
        type="button"
        onClick={() => setImage(false)}
        className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-[#ff6f61] text-white shadow-lg"
      >
        <X size={16} />
      </button>
    )}
  </div>
);

export default Add;
