module.exports.isLoggedIn=(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.orignalUrl;
        req.flash("error", "You must be logged-in to create listing.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirect){
        res.locals.redirect = req.session.redirectUrl;
    }
    next();
}