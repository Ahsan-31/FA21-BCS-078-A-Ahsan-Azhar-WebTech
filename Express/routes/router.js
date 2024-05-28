const express = require("express");
let router = express.Router();
let Product = require("../models/Product");
let User = require("../models/User");
let authMiddleWare = require("../middleWares/check-Auth");
let adminMiddleWare = require("../middleWares/check-admin");
let cookieParser = require("cookie-parser");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
router.get("/", async (req, res) => {
  const message = req.query.message;
  let displayMessage = '';

  if (message === 'adminRequired') {
    displayMessage = 'You need admin permissions to access this page.';
  }

  let user = req.session.user;
  let product = await Product.find({popular:true});
  shuffleArray(product)

    res.render("homepage",{
      message: displayMessage,
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
  res.cookie('cart',[]);
  res.redirect("/");
});

router.get("/login", async (req, res) => {
  const message = req.query.message;
  let displayMessage = '';

  if (message === 'loginRequired') {
    displayMessage = 'You must be logged in to proceed.';
  }
  else if(message ==='incorrectCreds'){
    displayMessage = 'incorrect email or password';
  }

  let user = req.session.user;
  res.render("logIn",{
    message: displayMessage,
    user
  });
});

router.post("/login", async (req, res) => {
  let user = req.session.user;
  if(user){
    res.redirect("/");
  }
  else{
    user = await User.findOne({ email: req.body.email });
    if (!user) return res.redirect(`/login?message=incorrectCreds`);
    if (user.password != req.body.password) return res.redirect(`/login?message=incorrectCreds`);
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
      res.redirect("/");
    })
    .catch(err => {
      res.status(400).send('Error registering user');
    });
});

router.get("/storyAPI", async (req, res) => {
  let user = req.session.user;
  res.render("storyAPI",{user});
});

const fetchProducts = async (query, page, limit) => {
  const productsCount = await Product.countDocuments(query);
  const totalPages = Math.ceil(productsCount / limit);
  const products = await Product.find(query)
                                .sort({ type: 1, title: 1 })
                                .skip((page - 1) * limit)
                                .limit(limit);
  return { products, totalPages };
};

router.get("/productsPage:type?", async (req, res) => {
  let query = {};
  if (req.params.type) {
    query.type = req.params.type;
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  try {
    const { products, totalPages } = await fetchProducts(query, page, limit);

    res.render("productsPage", {
      product: products,
      user: req.session.user,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      searchKeyword: req.query.keyword || '',
      typeFilter: req.params.type || ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get("/search", async (req, res) => {
  const searchKeyword = req.query.keyword;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  try {
    const query = {
      $or: [
        { type: { $regex: new RegExp(searchKeyword, "i") } },
        { title: { $regex: new RegExp(searchKeyword, "i") } }
      ]
    };
    const { products, totalPages } = await fetchProducts(query, page, limit);

    res.render("productsPage", {
      product: products,
      user: req.session.user,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      searchKeyword: searchKeyword
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get("/productDetails:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  let user = req.session.user;
  res.render("productDetails",{
    product,
    user
  })
});

router.get("/delProduct:id",adminMiddleWare, async (req, res) => {
  let product = await Product.findByIdAndDelete(req.params.id);
  res.redirect("/productsPage");
});

router.get("/insert", async (req, res) => {
  let user = req.session.user;
  let product;
  res.render("editProd",{
    product,
    user
  });
});
router.post('/insert', async (req, res) => {
  try {
    const newProduct = new Product({
      title: req.body.title,
      price: req.body.price,
      img: req.body.img,
      popular: req.body.popular,
      type: req.body.type,
    });

    await newProduct.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
router.get('/edit:id',adminMiddleWare, async (req, res) => {
  let user = req.session.user;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('editProd', {
      product,
      user
     });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/edit:id',adminMiddleWare, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Car not found');
    }
    product.title = req.body.title;
    product.price = req.body.price;
    product.img = req.body.img;
    product.popular = req.body.popular;
    product.type = req.body.type;
    const updatedProduct = await product.save();

    res.redirect('/productsPage');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post ("/addToCart:id", authMiddleWare,async (req, res) => {
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
          res.cookie('cart',cart);
          break;
        }
      }
      res.redirect("/cart");;
    }
  });

router.get("/cart",authMiddleWare,async (req, res) => {
  let cart = req.cookies.cart;
  let user = req.session.user;
  if(!cart){
    cart = [];
  }
  res.render("cart",{
    cart,
    user
  });
});
module.exports = router;