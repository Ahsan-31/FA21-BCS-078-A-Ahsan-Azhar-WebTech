const mongoose = require("mongoose");

let productSchema = mongoose.Schema({
    img: String,
    title: String,
    price: String,
    //popular flag mean featured
    popular:Boolean,
    type: String,
  });
  let Product = mongoose.model("Product", productSchema);
  module.exports = Product;