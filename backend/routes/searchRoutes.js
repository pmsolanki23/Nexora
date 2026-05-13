import express from "express";
import {
  searchProducts,
  searchSuggestions,
  trendingSearches,
} from "../controllers/searchController.js";

const searchRouter = express.Router();

// Full search with filters + pagination
searchRouter.get("/", searchProducts);

// Live suggestions (debounced on frontend)
searchRouter.get("/suggestions", searchSuggestions);

// Trending searches
searchRouter.get("/trending", trendingSearches);

export default searchRouter;
