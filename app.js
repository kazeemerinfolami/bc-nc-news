const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle_id,
  postCommentbyArticle_id,
} = require("./controller/nc_news.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticle_id);
app.post("/api/articles/:article_id/comments", postCommentbyArticle_id);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "page does not exist" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server error!");
});
module.exports = app;
