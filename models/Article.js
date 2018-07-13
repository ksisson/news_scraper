var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object

var ArticleSchema = new Schema({
  // title of the article
  title: {
    type: String,
    required: true,
    unique: true,
  },
  // url from the article
  link: {
    type: String,
    required: true,
    unique: true,
  },
  // summary of the article
  author: {
    type: String,
    required: true
  },
  // `co` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
        }
    ]  
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;