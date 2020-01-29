///////////////////// Modules
var express               = require("express"),
    app                   = express(),
    bodyParse             = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    localStrategy         = require("passport-local");

mongoose.connect('mongodb://localhost/yelp_camp',{useNewUrlParser: true,'useUnifiedTopology':true});
app.use(bodyParse.urlencoded({extended: true}));


///////////////////// External StyleSheet
app.use(express.static(__dirname + "/public"));


///////////////////// Schema Setup
var Campground = require("./models/campground.js");
var Comment    = require("./models/comment.js");
var User       = require("./models/user.js");


///////////////////// Seeds File
var seedDB = require("./seeds.js");
seedDB();


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


//Providing 'currentUser' to each template
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

///////////////////////////// Routes - Based on REST

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
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
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
app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){

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
     
///////////////////////////// Authentication Routes

//Register Auth route
app.get("/register",function(req,res){
    res.render("register.ejs");
});

app.post("/register",function(req,res){
    
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password, function(error,newUser){
        if(error){
            console.log("Error!");
            return res.render("register.ejs");
        }

        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/campgrounds");
            });
        }
    });
});

 
//Login Auth Route
app.get("/login",function(req,res){
    res.render("login.ejs");
});

app.post("/login",passport.authenticate("local",{
       successRedirect:"/campgrounds",
       failureRedirect:"/login"
    }),function(req,res){
});


//Logout Auth Route
app.get("/logout",function(req,res){
       req.logout();
       res.redirect("/campgrounds");
});

//MiddleWare Function
function isLoggedIn(req,res,next){
   if(req.isAuthenticated()){
       return next();
   }
   res.redirect("/login");
}

//////////////////// Server
app.listen(3000,function(){
    console.log("YelpCamp is working at 3000.");
});