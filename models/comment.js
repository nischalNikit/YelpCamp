//Package 
var mongoose = require("mongoose");

//Comment Schema
var CommentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }, 
        username: String
    }
});
var comment = mongoose.model("Comment",CommentSchema);

//Export Comment Module
module.exports = comment;