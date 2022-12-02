const comments = require("../db/data/test-data/comments");
const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticle_id,
  insertCommentbyArticle_id,
  updateArticulebyArticule_id,
  fetchUsers,
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
  const { sort_by, filter_by, order, topic } = req.query;
  // console.log("sort_by, filter_by", sort_by, filter_by);
  fetchArticles(sort_by, filter_by, order, topic)
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

exports.patchArticulebyArticule_id = (req, res, next) => {
  const { article_id } = req.params;
  const inc_votes = req.body;
  updateArticulebyArticule_id(inc_votes, article_id)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
