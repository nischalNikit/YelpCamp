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

//Edit Route
router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
    
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
router.put("/:comment_id/",checkCommentOwnership,function(req,res){
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
router.delete("/:comment_id/",checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err,foundComment){
        if(err){
            console.log("There's an error!");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
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

function checkCommentOwnership(req,res,next){
  
    //if the user is logged In,then allow access.
    if(req.isAuthenticated()){
       
        //find the owner of comment
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }
            else{
                //Check for equality with logged In User
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        })
    }
    //If the user is logged Out,Redirect to login page.
    else{
        res.redirect("/login");
    } 
}
 

//Module Export Page
module.exports = router;
     