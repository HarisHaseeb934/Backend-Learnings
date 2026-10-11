import mongoose from "mongoose";

const urlShortenerSchema = mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export const UrlShortener = mongoose.model("UrlShortener", urlShortenerSchema);
