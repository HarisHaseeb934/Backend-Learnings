import mongoose from "mongoose";

const urlShortenerSchema = mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
},{timestamps: true});

urlShortenerSchema.index({ user: 1, shortCode: 1 }, { unique: true });

export const UrlShortener = mongoose.model("UrlShortener", urlShortenerSchema);
