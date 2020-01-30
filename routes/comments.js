//Packages
var express = require("express");
var router  = express.Router({mergeParams: true});

//Schema
var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");


//New Comment Form Page
router.get("/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(error,foundCamp){
        if(error){
            console.log("Error");
        }
        else{
            res.render("comments/new.ejs",{campground: foundCamp});
        }
    });
});


//New comment creation
router.post("/", isLoggedIn, function(req,res){

    var newComment = req.body.comment;
    Campground.findById(req.params.id,function(error,foundCamp){
        if(error){
            console.log("Error");
        }
        else{
            Comment.create(newComment,function(error,NewComment){
                if(error){
                    console.log("Error");
                }
                else{
                    NewComment.author.id = req.user._id;
                    NewComment.author.username = req.user.username;
                    NewComment.save();
                    foundCamp.comments.push(NewComment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        }
    });
});    


//MiddleWare Function
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
 

//Module Export Page
module.exports = router;
     