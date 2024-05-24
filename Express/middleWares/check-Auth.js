module.exports = async function (req, res, next) {
    if (!req.session.user){
        console.log("You are not logged in");
        res.redirect("/login");
    }
    else next();
  };