import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, "..");
const dataDir = path.join(backendDir, "data");
export const uploadDir = path.join(backendDir, "uploads");
const dbPath = path.join(dataDir, "db.json");

const placeholderImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100">
      <rect width="900" height="1100" fill="#10151f"/>
      <circle cx="690" cy="220" r="150" fill="#ff6f61" opacity=".72"/>
      <circle cx="190" cy="800" r="180" fill="#aaff5a" opacity=".85"/>
      <text x="80" y="930" fill="#fff" font-family="Arial" font-size="72" font-weight="700">NEXORA</text>
      <text x="84" y="990" fill="#aaff5a" font-family="Arial" font-size="34" font-weight="700">Catalog item</text>
    </svg>
  `);

const seedProducts = [
  {
    _id: "demo-hoodie",
    name: "Midnight Utility Hoodie",
    description: "A soft heavyweight hoodie with a clean streetwear profile.",
    price: 49,
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    bestseller: true,
    image: [placeholderImage],
    date: Date.now(),
  },
  {
    _id: "demo-jacket",
    name: "Coral Trim Jacket",
    description:
      "Lightweight layer with bold contrast trims and daily comfort.",
    price: 79,
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L"],
    bestseller: true,
    image: [placeholderImage],
    date: Date.now() - 1000,
  },
  {
    _id: "demo-cargo",
    name: "Neon Detail Cargo",
    description:
      "Relaxed cargo bottoms with practical pockets and sharp finish.",
    price: 59,
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L"],
    bestseller: false,
    image: [placeholderImage],
    date: Date.now() - 2000,
  },
];

const defaultDb = {
  users: [],
  products: seedProducts,
  orders: [],
};

const ensureStore = () => {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(uploadDir, { recursive: true });

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
  }
};

export const readDb = () => {
  ensureStore();
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
};

export const writeDb = (db) => {
  ensureStore();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

export const makeId = () => crypto.randomUUID();

export const normalizeProduct = (product) => {
  const category = product.category || product.cateogory || "";
  const subCategory =
    product.subCategory || product.subcategory || product.subcatogory || "";
  const sizes = product.sizes || product.size || [];

  return {
    ...product,
    category,
    cateogory: category,
    subCategory,
    subcategory: subCategory,
    subcatogory: subCategory,
    sizes,
    size: sizes,
  };
};

export const fallbackImage = placeholderImage;
