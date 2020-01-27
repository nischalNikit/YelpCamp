//Modules
var express   = require("express"),
    app       = express(),
    bodyParse = require("body-parser"),
    mongoose  = require("mongoose")

mongoose.connect('mongodb://localhost/yelp_camp',{useNewUrlParser: true,'useUnifiedTopology':true});
app.use(bodyParse.urlencoded({extended: true}));

//External StyelSheet
app.use(express.static(__dirname + "/public"));

//Schema Setup
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

//Seeds File
var seedDB = require("./seeds.js");
seedDB();


//Routes - Based on REST

//Landing Page
app.get("/",function(req,res){
    res.render("landing.ejs");
});

//Index Page
app.get("/campgrounds",function(req,res){
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
app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var imgURL = req.body.image;
    var desc = req.body.description;

    var newCampground = new Campground({
        name:name,
        image: imgURL,
        description: desc
    });

    newCampground.save(function(error,data){
        if(error){
            console.log("There's an error.");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});


//New Campground Form Page 
app.get("/campgrounds/new",function(req,res){
     res.render("campgrounds/new.ejs");
});

//Individual Campground Page
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(error, data){
        if(error){  
            console.log(error);
        }
        else{
            res.render("campgrounds/show.ejs",{campground: data});
        }
    });
});


//New Comment Form Page
app.get("/campgrounds/:id/comments/new",function(req,res){
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
app.post("/campgrounds/:id/comments",function(req,res){

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
                    foundCamp.comments.push(NewComment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        }
    });
});    
     

//Server
app.listen(3000,function(){
    console.log("YelpCamp is working at 3000.");
});