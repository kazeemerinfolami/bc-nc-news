const express = require("express");
const {
  getTopics,
  getArticules,
  getArticuleById,
  getCommentsByArticle_id,
} = require("./controller/nc_news.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticules);
app.get("/api/articles/:article_id", getArticuleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticle_id);

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
