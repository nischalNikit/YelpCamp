//Modules
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

//Routes - Based on REST
app.get("/",function(req,res){
    res.render("landing.ejs");
});

app.get("/campgrounds",function(req,res){
    res.render("campgrounds.ejs",{campgrounds: campgrounds});
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var imgURL = req.body.image;

    campgrounds.push({name:name, image: imgURL});
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res){
     res.render("new.ejs");
});

//Server
app.listen(3000,function(){
    console.log("YelpCamp is working at 3000.");
});