router.get("/register", async (req, res) => {
    let user = req.session.user;
    res.render("register",{user});
  });
  
  router.get("/logOut", async (req, res) => {
    req.session.user = null;
    req.session.visitedProducts = null;
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
  