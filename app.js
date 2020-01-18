//Modules
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



//Routes - Based on REST
app.get("/",function(req,res){
    res.render("landing.ejs");
});

app.get("/campgrounds",function(req,res){
    //Get all campgrounds from DB
    Campground.find({},function(error,data){
        if(error){
            console.log("Error!");
        }
        else{
            res.render("index.ejs",{campgrounds: data});
        }
    })
 
});

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

app.get("/campgrounds/new",function(req,res){
     res.render("new.ejs");
});

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



//Server
app.listen(3000,function(){
    console.log("YelpCamp is working at 3000.");
});