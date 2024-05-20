const express = require("express");
let router = express.Router();
let Product = require("../models/Product");

router.get("/", async (req, res) => {
  let product = await Product.find({popular:true});
  console.log(product);
    res.render("homepage",{
      product
    });
  });

router.get("/contact-us", async (req, res) => {
  res.render("contact-us");
});

router.get("/storyAPI", async (req, res) => {
  res.render("storyAPI");
});

router.get("/productsPage", async (req, res) => {
  let product = await Product.find();
  res.render("productsPage",{
    product
  });
});
router.get("/productDetails:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  res.render("productDetails",{
    product
  })
});
module.exports = router;