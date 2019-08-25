const mongoose = require("mongoose");
const shortid = require("shortid");

const UrlSchema = mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  url: {
    type: String,
    required: true
  },
  visits: {
    type: Number,
    required: true,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("url", UrlSchema);
