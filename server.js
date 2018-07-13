var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT||3000;

// Initialize Express
var app = express();

// Configure middleware

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news_scraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.get("/scrape", function(req,res){
    axios.get("https://www.theverge.com/tech").then(function(response){
        var $ = cheerio.load(response.data);

        $("div.c-entry-box--compact--article").each(function(i, element){
            var result = {}

            result.link = $(element).find("a.c-entry-box--compact__image-wrapper").attr("href")
            result.title = $(element).find("h2").find("a").text()
            result.author = $(element).find("div span a").text().split("\n")[0]
            db.Article.create(result).then(function(dbArticle){
                console.log(dbArticle);
            }).catch(function(err){
                return res.json("Duplicate")
            });
        });
        res.end()
    });
});

app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/article/:id", function(req, res){
      db.Article.find({_id: req.params.id})
      .populate("comments")
      .then(function(dbArticle){
          res.json(dbArticle)
      })
  })


  app.post("/submit", function(req, res){
      db.Comments.create({comment: req.body.comment})
      .then(function(dbComment){
          return db.Article.findOneAndUpdate({_id: req.body.id}, {$push: {comments: dbComment._id}}, {new: true})
      })
      .then(function(dbArticle){
          res.json(dbArticle)
      })
  })

//   app.delete("/delete/:id/:articleid", function(req, res){
//       db.Comments.remove({_id: req.params.id})
//       .then(function(dbComment){
//           return db.Article.findOneAndUpdate({_id: req.params.articleid}, {$pull : {comments: req.params.id}})
//       })
//       .then(function(dbArticle){
//           res.json(dbArticle)
//       })
//   })







app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });

