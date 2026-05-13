import productModel from "../models/productModel.js";
import searchModel from "../models/searchModel.js";

// =========================
// RECORD SEARCH QUERY
// =========================

const recordSearch = async (query) => {
  if (!query || query.trim().length < 2) return;
  const normalized = query.toLowerCase().trim();
  try {
    await searchModel.findOneAndUpdate(
      { query: normalized },
      { $inc: { count: 1 }, $set: { lastSearched: new Date() } },
      { upsert: true, new: true },
    );
  } catch (_) {
    // Non-critical — don't fail the search request
  }
};

// =========================
// SEARCH PRODUCTS
// =========================

export const searchProducts = async (req, res) => {
  try {
    const {
      q = "",
      category,
      subCategory,
      minPrice,
      maxPrice,
      minRating,
      inStockOnly,
      size,
      sort = "newest",
      page = 1,
      limit = 12,
      cursor,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    // Build filter
    const filter = {};

    // Text search
    if (q && q.trim().length > 0) {
      filter.$text = { $search: q.trim() };
      // Record for trending
      recordSearch(q.trim());
    }

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      filter.averageRating = { $gte: Number(minRating) };
    }

    if (inStockOnly === "true") {
      filter.totalStock = { $gt: 0 };
    }

    if (size) {
      filter.sizes = size;
    }

    // Cursor pagination
    if (cursor) {
      filter._id = { $lt: cursor };
    }

    // Sort
    let sortObj = {};
    switch (sort) {
      case "price_asc":
        sortObj = { price: 1 };
        break;
      case "price_desc":
        sortObj = { price: -1 };
        break;
      case "rating":
        sortObj = { averageRating: -1 };
        break;
      case "bestseller":
        sortObj = { bestseller: -1, date: -1 };
        break;
      default:
        sortObj = { date: -1 };
    }

    // Add text score sort if searching
    if (q && q.trim().length > 0 && sort === "newest") {
      sortObj = { score: { $meta: "textScore" }, date: -1 };
    }

    const total = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    let query = productModel.find(filter);

    if (q && q.trim().length > 0 && sort === "newest") {
      query = query.select({ score: { $meta: "textScore" } });
    }

    const products = await query
      .sort(sortObj)
      .skip(cursor ? 0 : (pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      products,
      total,
      page: pageNum,
      pageSize: limitNum,
      hasNextPage: cursor ? products.length === limitNum : pageNum < totalPages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// SEARCH SUGGESTIONS (live)
// =========================

export const searchSuggestions = async (req, res) => {
  try {
    const { q = "" } = req.query;

    if (!q || q.trim().length < 1) {
      return res.json({ success: true, suggestions: [] });
    }

    const products = await productModel
      .find(
        { name: { $regex: q.trim(), $options: "i" } },
        { name: 1, _id: 1, image: 1, price: 1 },
      )
      .limit(8)
      .lean();

    res.json({
      success: true,
      suggestions: products.map((p) => ({
        _id: p._id,
        name: p.name,
        image: p.image?.[0] || null,
        price: p.price,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// TRENDING SEARCHES
// =========================

export const trendingSearches = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const trending = await searchModel
      .find({ lastSearched: { $gte: since } })
      .sort({ count: -1 })
      .limit(10)
      .select("query count")
      .lean();

    res.json({
      success: true,
      trending: trending.map((t) => t.query),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
