import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Check,
  DollarSign,
  ImageOff,
  PencilLine,
  Star,
  Tag,
  Upload,
  X,
} from "lucide-react";

import { getProducts, updateProduct } from "../services/productService";

const sizeOptions = ["S", "M", "L", "XL", "XXL"];
const categories = ["Men", "Women", "Kids"];
const subCategories = ["Topwear", "Bottomwear", "Winterwear"];

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [newImages, setNewImages] = useState([false, false, false, false]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setIsLoading(true);

    try {
      const response = await getProducts();
      const products = response.products || response.product || [];
      const item = products.find((productItem) => productItem._id === id);

      if (!item) {
        toast.error("Product not found");
        navigate("/list");
        return;
      }

      setProduct(item);
      setName(item.name || "");
      setDescription(item.description || "");
      setPrice(item.price || "");
      setCategory(item.category || item.cateogory || "Men");
      setSubCategory(item.subCategory || item.subcategory || "Topwear");
      setSizes(item.sizes || item.size || []);
      setBestseller(Boolean(item.bestseller));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

      newImages.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image);
        }
      });

      const response = await updateProduct(formData);

      if (response.success) {
        toast.success(response.message || "Product updated");
        navigate("/list");
      } else {
        toast.error(response.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateImage = (index, file) => {
    setNewImages((prev) => {
      const next = [...prev];
      next[index] = file || false;
      return next;
    });
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size],
    );
  };

  if (isLoading) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-[28px] border border-white/10 bg-white/[0.05]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#aaff5a] border-t-transparent" />
          <p className="mt-3 font-semibold text-slate-300">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-panel rounded-[32px] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#aaff5a] text-[#070a0f]">
              <PencilLine size={25} />
            </div>
            <div className="min-w-0">
              <p className="admin-kicker">Catalog editor</p>
              <h1 className="mt-1 truncate text-3xl font-black text-white sm:text-4xl">
                Edit product
              </h1>
              <p className="mt-2 text-slate-400">
                Update product details, pricing, fit options, and media.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/list")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2.5 font-black text-slate-200 transition hover:border-[#aaff5a]/60 hover:text-[#aaff5a]"
          >
            <ArrowLeft size={18} />
            Back to list
          </button>
        </div>
      </section>

      <form
        onSubmit={submitHandler}
        className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"
      >
        <section className="admin-panel rounded-[28px] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Upload className="text-[#aaff5a]" />
            <div>
              <h2 className="text-2xl font-black text-white">Product media</h2>
              <p className="text-sm text-slate-400">
                Current images stay unless you upload replacements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <ImageSlot
                key={index}
                index={index}
                currentImage={product.image?.[index]}
                newImage={newImages[index]}
                onChange={updateImage}
              />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#aaff5a]/20 bg-[#aaff5a]/10 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                onChange={() => setBestseller((prev) => !prev)}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="admin-input w-full px-4 py-3"
                type="text"
                required
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field icon={DollarSign} label="Price">
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="admin-input w-full px-4 py-3"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                />
              </Field>

              <Field label="Category">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="admin-input w-full px-4 py-3"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Sub category">
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="admin-input w-full px-4 py-3"
              >
                {subCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="admin-input min-h-36 w-full resize-none px-4 py-3"
                required
              />
            </Field>

            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.15em] text-slate-500">
                Available sizes
              </p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`rounded-full px-5 py-2 text-sm font-black transition ${
                      sizes.includes(size)
                        ? "bg-[#0b1018] text-[#aaff5a]"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/list")}
                className="inline-flex items-center justify-center rounded-full bg-slate-100 px-7 py-3 font-black text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#aaff5a] px-7 py-3 font-black text-[#070a0f] transition hover:bg-[#0b1018] hover:text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Updating product
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Update product
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

const ImageSlot = ({ index, currentImage, newImage, onChange }) => {
  const preview = newImage ? URL.createObjectURL(newImage) : currentImage;

  return (
    <div className="group relative">
      <label htmlFor={`image-${index}`} className="block cursor-pointer">
        <div className="grid aspect-square place-items-center overflow-hidden rounded-[24px] border-2 border-dashed border-white/12 bg-white/[0.06] transition hover:border-[#aaff5a]/70">
          {preview ? (
            <img
              className="h-full w-full object-cover"
              src={preview}
              alt={`Product ${index + 1}`}
            />
          ) : (
            <div className="text-center text-slate-400">
              <ImageOff className="mx-auto mb-2" />
              <p className="font-black text-white">Image {index + 1}</p>
            </div>
          )}
        </div>
        <input
          onChange={(e) => onChange(index, e.target.files[0])}
          type="file"
          id={`image-${index}`}
          className="hidden"
          accept="image/*"
        />
      </label>

      {newImage && (
        <button
          type="button"
          onClick={() => onChange(index, false)}
          className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-[#ff6f61] text-white shadow-lg"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Edit;
