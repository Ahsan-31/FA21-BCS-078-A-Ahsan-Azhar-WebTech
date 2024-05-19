const express = require("express");
let router = express.Router();
let Product = require("../models/Product");

router.get("/", async (req, res) => {
    res.render("homepage");
  });

router.get("/contact-us", async (req, res) => {
  res.render("contact-us");
});

router.get("/storyAPI", async (req, res) => {
  res.render("storyAPI");
});

router.get("/productsPage", async (req, res) => {
  let product = await Product.findById("664a5a89211425b3e6dd3881");
  res.render("productsPage",{
    product
  });
});
module.exports = router;