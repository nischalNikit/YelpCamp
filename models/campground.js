//Package
var mongoose = require('mongoose');

//Campground Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref : "Comment"
        }  
    ]
}); 
var Campground = mongoose.model("Campground",campgroundSchema); 

//Exporting Campground Module
module.exports = Campground;