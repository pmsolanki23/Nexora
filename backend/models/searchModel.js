import mongoose from "mongoose";

// Tracks search query frequency for trending searches
const searchSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  count: {
    type: Number,
    default: 1,
  },

  lastSearched: {
    type: Date,
    default: Date.now,
  },
});

searchSchema.index({ count: -1 });
searchSchema.index({ lastSearched: -1 });

const searchModel =
  mongoose.models.search || mongoose.model("search", searchSchema);

export default searchModel;
