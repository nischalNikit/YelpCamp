//Packages
var express = require("express");
var router  = express.Router();

//Schema
var Campground = require("../models/campground.js"); 


//Index Page
router.get("/",function(req,res){

    //Get all campgrounds from DB
    Campground.find({},function(error,data){
        if(error){
            console.log("Error!");
        }
        else{
            res.render("campgrounds/index.ejs",{campgrounds: data});
        }
    })
 
});


//New Campground Page Creation
router.post("/",isLoggedIn,function(req,res){
    var name = req.body.name;
    var imgURL = req.body.image;
    var desc = req.body.description;

    var newCampground = {
        name:name,
        image: imgURL,
        description: desc
    };

    Campground.create(newCampground,function(error,newlyCreated){
        if(error){
            console.log("There's an error.");
        }
        else{
            newlyCreated.author.id       = req.user._id;
            newlyCreated.author.username = req.user.username;
            newlyCreated.save();
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});


//New Campground Form Page
router.get("/new",isLoggedIn,function(req,res){
     res.render("campgrounds/new.ejs");
});


//Individual Campground Page
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(error, data){
        if(error){  
            console.log(error);
        }
        else{
            res.render("campgrounds/show.ejs",{campground: data});
        }
    });
});


//MiddleWare
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
 
//Module Export
module.exports = router;