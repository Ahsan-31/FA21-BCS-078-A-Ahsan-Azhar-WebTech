module.exports = async function (req, res, next) {
    if (!req.session.user){
        res.redirect(`/login?message=loginRequired`);
    }
    else if(req.session.user.role=="admin")
        next();
    else{
        res.redirect(`/?message=adminRequired`);
    }
  };