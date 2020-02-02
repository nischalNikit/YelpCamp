//Schemas
var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");


//MiddleWare
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id,function(error,foundCampground){
                if(error){
                    req.flash("error","Campground not found.");
                    res.redirect("back");
                }
                else{
                    if(foundCampground.author.id.equals(req.user._id)){
                       next();
                    }
                    else{
                        req.flash("error","You don't have the permission to do that.");
                        res.redirect("back");
                    }
                }
            });
        }
        else{
            res.redirect("back");
        }    
}

middlewareObj.checkCommentOwnership = function(req,res,next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err){
                    res.redirect("back");
                }
                else{
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error","You don't have the permission to do that.");
                        res.redirect("back");
                    }
                }
            });
        }
        else{
            req.flash("error","You need to be Logged-In to do that.");
            res.redirect("/login");
        } 
}
     
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be Logged-In to do that.");
    res.redirect("/login");
}    


//Module Export
module.exports = middlewareObj;