const {
  fetchTopics,
  fetchArticules,
  fetchArticuleById,
} = require("../model/nc_news.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticules = (req, res, next) => {
  fetchArticules()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticuleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticuleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
