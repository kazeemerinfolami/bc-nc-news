const comments = require("../db/data/test-data/comments");
const {
  fetchTopics,
  fetchArticules,
  fetchArticuleById,
  fetchCommentsByArticle_id,
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

exports.getCommentsByArticle_id = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticle_id(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

// exports.post = ()
