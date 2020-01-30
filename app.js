///////////////////// Modules
var express               = require("express"),
    app                   = express(),
    bodyParse             = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    localStrategy         = require("passport-local");

mongoose.connect('mongodb://localhost/yelp_camp',{useNewUrlParser: true,'useUnifiedTopology':true});
app.use(bodyParse.urlencoded({extended: true}));

///////////////////// Routes
var campgroundRoutes = require("./routes/campgrounds.js"),
    commentRoutes    = require("./routes/comments.js"),
    indexRoutes      = require("./routes/index.js");    


///////////////////// StyleSheet Public Folder
app.use(express.static(__dirname + "/public"));


///////////////////// Schema
var Campground = require("./models/campground.js");
var Comment    = require("./models/comment.js"); 
var User       = require("./models/user.js");


///////////////////// Seeds File
var seedDB = require("./seeds.js");
//seedDB();


///////////////////// Passport Configuration
app.use(require("express-session")({
    secret:"Some Random String",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


///////////////////// Providing 'currentUser' to each template
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});


//////////////////// Routes Inclusion
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


/////////////////////// Server
app.listen(3000,function(){
    console.log("YelpCamp is working at 3000.");
});




