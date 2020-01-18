//Modules
<<<<<<< HEAD
var express   = require("express"),
    app       = express(),
    bodyParse = require("body-parser"),
    mongoose  = require("mongoose")

mongoose.connect('mongodb://localhost/yelp_camp',{useNewUrlParser: true,'useUnifiedTopology':true});
app.use(bodyParse.urlencoded({extended: true}));



//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
}); 
var Campground = mongoose.model("Campground",campgroundSchema);


=======
var express = require("express");
var app = express();
var bodyParse = require("body-parser");
app.use(bodyParse.urlencoded({extended: true}));

//Data
var campgrounds =[
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1516013894828-b214a58fdba7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=755&q=80"},
    {name: "Granite Hills", image: "https://images.unsplash.com/photo-1511993807578-701168605ad3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=747&q=80"},
    {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"}
];
>>>>>>> 3f42cd064956d5ad16b0a5af04ae2315edaebfbe

//Routes - Based on REST
app.get("/",function(req,res){
    res.render("landing.ejs");
});

app.get("/campgrounds",function(req,res){
<<<<<<< HEAD
    //Get all campgrounds from DB
    Campground.find({},function(error,data){
        if(error){
            console.log("Error!");
        }
        else{
            res.render("index.ejs",{campgrounds: data});
        }
    })
 
=======
    res.render("campgrounds.ejs",{campgrounds: campgrounds});
>>>>>>> 3f42cd064956d5ad16b0a5af04ae2315edaebfbe
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var imgURL = req.body.image;
<<<<<<< HEAD
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
=======

    campgrounds.push({name:name, image: imgURL});
    res.redirect("/campgrounds");
>>>>>>> 3f42cd064956d5ad16b0a5af04ae2315edaebfbe
});

app.get("/campgrounds/new",function(req,res){
     res.render("new.ejs");
});

<<<<<<< HEAD
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id, function(error, data){
        if(error){
            console.log(error);
        }
        else{
            res.render("show.ejs",{campground: data});
        }
    });
});



=======
>>>>>>> 3f42cd064956d5ad16b0a5af04ae2315edaebfbe
//Server
app.listen(3000,function(){
    console.log("YelpCamp is working at 3000.");
});