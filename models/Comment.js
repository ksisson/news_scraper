var mongoose = require("mongoose");


var Schema = mongoose.Schema;

var CommentSchema = new Schema({

  comment: String

});


var Comments = mongoose.model("Comment", CommentSchema);


module.exports = Comments;