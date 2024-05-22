const express = require("express");
let router = express.Router();
let Product = require("../models/Product");
let User = require("../models/User");
let authMiddleWare = require("../middleWares/check-Auth");
let cookieParser = require("cookie-parser");

router.get("/", async (req, res) => {
  let user = req.session.user;
  if(!user)
    console.log("No User");
  else{
    console.log(req.session.user.firstName);
  }
  let product = await Product.find({popular:true});
    res.render("homepage",{
      product,
      user
    });
  });

router.get("/contact-us", async (req, res) => {
  let user = req.session.user;
  res.render("contact-us",{user});
});

router.get("/register", async (req, res) => {
  let user = req.session.user;
  res.render("register",{user});
});

router.get("/logOut", async (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

router.get("/login", async (req, res) => {
  let user = req.session.user;
  res.render("logIn",{user});
});

router.post("/login", async (req, res) => {
  let user = req.session.user;
  if(user){
    res.redirect("/");
  }
  else{
    user = await User.findOne({ email: req.body.email });
    if (!user) return res.redirect("/register");
    if (user.password != req.body.password) return res.redirect("/login");
    req.session.user = user;
    return res.redirect("/");
  }
  res.render("logIn",{user});
});

router.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    roles: []
  });
  newUser.save()
    .then(user => {
      req.session.user = newUser;
      res.send('User registered successfully!');
    })
    .catch(err => {
      res.status(400).send('Error registering user');
    });
});

router.get("/storyAPI", async (req, res) => {
  let user = req.session.user;
  res.render("storyAPI",{user});
});

router.get("/productsPage",async (req, res) => {
  let product = await Product.find();
  let user = req.session.user;
  res.render("productsPage",{
    product,
    user
  });
});

router.get("/productDetails:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  let user = req.session.user;
  res.render("productDetails",{
    product,
    user
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
  let user = req.session.user;
  if(!cart){
    cart = [];
  }
  else{
    products = cart;
  }
  res.render("cart",{
    products,
    user
  });
});
module.exports = router;