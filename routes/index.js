//Packages
var express  = require("express");
var router   = express.Router();
var passport = require("passport");

//Schema
var User     = require("../models/user.js");


//Landing Page
router.get("/",function(req,res){
    res.render("landing.ejs");
});


//Authentication Routes

//Register Auth route
router.get("/register",function(req,res){
    
    res.render("register.ejs");
});

router.post("/register",function(req,res){
    
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password, function(error,newUser){
        if(error){
            req.flash("error",error.message);
            return res.render("register.ejs");
        }

        else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to YelpCamp " + newUser.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

 
//Login Auth Route
router.get("/login",function(req,res){
    res.render("login.ejs");
});

router.post("/login",passport.authenticate("local",{
       successRedirect:"/campgrounds",
       failureRedirect:"/login"
    }),function(req,res){
});


//Logout Auth Route
router.get("/logout",function(req,res){
       req.logout();
       req.flash("success","You're Logged-Out.");
       res.redirect("/campgrounds");
    }
);


//Export
module.exports = router;