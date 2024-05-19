const mongoose = require("mongoose");

let productSchema = mongoose.Schema({
    img: String,
    title: String,
    price: String,
  });
  let Product = mongoose.model("Product", productSchema);
  module.exports = Product;