const { fetchTopics, fetchArticules } = require("../model/nc_news.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticules = (req, res, next) => {
  const { sort_by } = req.query;
  fetchArticules(sort_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
