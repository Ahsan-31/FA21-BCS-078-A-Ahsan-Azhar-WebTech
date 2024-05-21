const express = require("express");
let router = express.Router();
let Product = require("../models/Product");
let User = require("../models/User");
let authMiddleWare = require("../middleWares/check-Auth");
let cookieParser = require("cookie-parser");

router.get("/", async (req, res) => {
  let product = await Product.find({popular:true});
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

router.get("/productsPage",async (req, res) => {
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

router.post ("/addToCart:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  let cart = req.cookies.cart;
  if(cart){
    cart.push(product);
  }
  else{
    cart = [];
    cart.push(product);
  }
  res.cookie('cart',cart);
  res.redirect("/productsPage");
  });

  router.get("/rem:product",async (req, res) => {
    let cart = req.cookies.cart;
    if(!cart){
      res.redirect("/");
    }
    else{
      for(let i=0; i < cart.length ; i++){
        if(cart[i].title==req.params.product){
          cart.splice(i, 1);
          console.log(cart);
          res.cookie('cart',cart);
          break;
        }
      }
      res.redirect("/cart");;
    }
  });

router.get("/cart",async (req, res) => {
  let cart = req.cookies.cart;
  if(!cart){
    cart = [];
  }
  else{
    products = cart;
  }
  res.render("cart",{
    products
  });
});
module.exports = router;