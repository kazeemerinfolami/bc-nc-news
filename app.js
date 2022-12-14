const express = require("express");
const cors = require("cors");
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle_id,
  postCommentbyArticle_id,
  patchArticulebyArticule_id,
  getUsers,
  deleteCommentsById,
} = require("./controller/nc_news.controller");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticle_id);
app.post("/api/articles/:article_id/comments", postCommentbyArticle_id);
app.patch("/api/articles/:article_id", patchArticulebyArticule_id);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteCommentsById);
app.get("/api");

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "page does not exist" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server error!" });
});

module.exports = app;
