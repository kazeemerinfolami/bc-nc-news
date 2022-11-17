const comments = require("../db/data/test-data/comments");
const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticle_id,
  insertCommentbyArticle_id,
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

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
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

exports.postCommentbyArticle_id = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertCommentbyArticle_id(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
