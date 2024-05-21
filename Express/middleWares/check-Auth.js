module.exports = async function (req, res, next) {
    if (true){
        console.log("You are not logged in");
        res.redirect("/");
    }
    else next();
  };