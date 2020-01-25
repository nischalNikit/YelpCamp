//Package 
var mongoose = require("mongoose");

//Comment Schema
var CommentSchema = mongoose.Schema({
    text: String,
    author: String
});
var comment = mongoose.model("Comment",CommentSchema);

//Export Comment Module
module.exports = comment;