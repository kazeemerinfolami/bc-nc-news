const express = require("express");
const { getTopics } = require("./controller/nc_news.controller");

const app = express();

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "page does not exist" });
});
module.exports = app;
