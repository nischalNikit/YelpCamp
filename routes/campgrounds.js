//Packages
var express = require("express");
var router  = express.Router();

//Schema
var Campground = require("../models/campground.js"); 

//MiddleWare
var MiddleWare = require("../middleware");


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
    });
});


//New Campground Page Creation
router.post("/",MiddleWare.isLoggedIn,function(req,res){
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
            res.redirect("/campgrounds");
        }
    });
});

//New Campground Form Page
router.get("/new",MiddleWare.isLoggedIn,function(req,res){
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


//Edit Campground 
router.get("/:id/edit",MiddleWare.checkCampgroundOwnership,function(req,res)
{
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit.ejs",{campground:foundCampground});         
    });
});
    

//Update Campground
router.put("/:id",MiddleWare.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error,data){
        if(error){
            console.log("Error!");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//Destroy Campground
router.delete("/:id",MiddleWare.checkCampgroundOwnership,function(req,res){
      Campground.findByIdAndRemove(req.params.id,function(error){
        if(error){
            console.log("Error.");
        } 
        res.redirect("/campgrounds");
      });
});


//Module Export
module.exports = router;