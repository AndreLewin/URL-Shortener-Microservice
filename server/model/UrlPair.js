const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    original_url: { type: String, required: true },
    short_url: { type: String, required: true }
  },
  {
    toObject: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret._id;
      }
    },
  }
);

const UrlPair = mongoose.model('UrlPair', schema);

module.exports = UrlPair;