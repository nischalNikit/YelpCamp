//Packages
var express = require("express");
var router  = express.Router({mergeParams: true});

//Schema
var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");

//Middleware
var MiddleWare = require("../middleware");

//New Comment Form Page
router.get("/new",MiddleWare.isLoggedIn,function(req,res){
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
router.post("/",MiddleWare.isLoggedIn, function(req,res){

    var newComment = req.body.comment;
    Campground.findById(req.params.id,function(error,foundCamp){
        if(error){
            console.log("Error");
        }
        else{
            Comment.create(newComment,function(error,NewComment){
                if(error){
                    req.flash("error","Something went wrong.");
                    console.log("Error");
                }
                else{
                    NewComment.author.id = req.user._id;
                    NewComment.author.username = req.user.username;
                    NewComment.save();
                    foundCamp.comments.push(NewComment);
                    foundCamp.save();
                    req.flash("success","Successfully added comment.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});    

//Edit Route
router.get("/:comment_id/edit",MiddleWare.checkCommentOwnership,function(req,res){
    
    var foundId = req.params.id;
    Comment.findById(req.params.comment_id,function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit.ejs",{campgroundId: foundId, comment: foundComment});
        }
    });
});


//Update Route
router.put("/:comment_id/",MiddleWare.checkCommentOwnership,function(req,res){
     Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,newComment){
         if(err){
             console.log("Error!");
         }
         else{
             res.redirect("/campgrounds/" + req.params.id);
         }
     });
});


//Destroy Route
router.delete("/:comment_id/",MiddleWare.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err,foundComment){
        if(err){
            console.log("There's an error!");
        }
        else{
            req.flash("success","Comment Deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//Module Export Page
module.exports = router;
     