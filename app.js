const express = require("express");
const { getTopics, getArticules } = require("./controller/nc_news.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticules);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "page does not exist" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server error!");
});
module.exports = app;
