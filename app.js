const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Creating article schema
const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

// Creating article model
const Article = mongoose.model("Article", articleSchema);

/* Requests for all articles */
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) res.send("Successfully added new article.");
      else res.send(err);
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (err) console.log(err);
      else res.send("Successfully deleted all articles.");
    });
  });

/* Requests for a specific article */
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) res.send(foundArticle);
        else res.send("No articles matching that title was found.");
      }
    );
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) res.send("Successfully updated article.");
        else res.send(err);
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) res.send("Successfully updated article.");
        else res.send("Article not found.");
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (err) res.send("Article not found");
      else res.send("Successfully deleted article.");
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
