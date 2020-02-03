///////////////////// Modules
var express               = require("express"),
    app                   = express(),
    bodyParse             = require("body-parser"),
    methodOverride        = require("method-override"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    localStrategy         = require("passport-local");

mongoose.connect('mongodb://localhost/yelp_camp',
    {
        useNewUrlParser: true,
        'useUnifiedTopology':true,
        'useFindAndModify':false
});


app.use(bodyParse.urlencoded({extended: true}));

//////////////////// Method Override
app.use(methodOverride("_method"));

/////////////////// Connect-Flash

app.use(flash());


///////////////////// StyleSheet Public Folder
app.use(express.static(__dirname + "/public"));


///////////////////// Schema
var Campground = require("./models/campground.js");
var Comment    = require("./models/comment.js"); 
var User       = require("./models/user.js");


///////////////////// Seeds File
var seedDB = require("./seeds.js");
//seedDB();


///////////////////// Routes
var campgroundRoutes = require("./routes/campgrounds.js"),
    commentRoutes    = require("./routes/comments.js"),
    indexRoutes      = require("./routes/index.js");   


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
    res.locals.error     = req.flash("error");
    res.locals.success   = req.flash("success");
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




