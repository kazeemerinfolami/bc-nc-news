const { query } = require("../db/connection");
const db = require("../db/connection");
const { checkIfUserExists, checkIfArticleExists } = require("./utils/utils");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};
exports.fetchArticles = (
  sort_by = "created_at",
  filter_by = "jessjelly",
  order = "desc",
  topic
) => {
  const validColumns = [
    "created_at",
    "title",
    "topic",
    "author",
    "body",
    "votes",
  ];
  const validOrder = ["asc", "desc"];
  if (!validColumns.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid query!" });
  }
  let queryStr = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;
  const queryValue = [];
  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValue.push(topic);
  }
  queryStr += ` GROUP BY comments.article_id, articles.article_id`;
  queryStr += ` ORDER BY ${sort_by} ${order};`;
  return db.query(queryStr, queryValue).then((response) => {
    return response.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  if (!isNaN(article_id)) {
    return db
      .query(`SELECT * FROM articleS WHERE article_id = $1`, [article_id])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "article not found",
          });
        }
        return result.rows[0];
      });
  }
  return Promise.reject({
    status: 400,
    msg: "bad request!",
  });
};

exports.fetchCommentsByArticle_id = (article_id) => {
  if (!isNaN(article_id)) {
    return db
      .query(
        `
      SELECT * FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC
      `,
        [article_id]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "comment not found",
          });
        }
        return result.rows;
      });
  }

  return Promise.reject({
    status: 400,
    msg: "bad request!",
  });
};

exports.insertCommentbyArticle_id = (article_id, body) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "bad request!",
    });
  }
  if (!body.body || !body.author) {
    return Promise.reject({
      status: 400,
      msg: "all inputs are required",
    });
  }
  return Promise.all([
    checkIfArticleExists(article_id),
    checkIfUserExists(body.author),
  ]).then(() => {
    return db
      .query(
        `
        INSERT INTO comments
        (body,author,article_id)
        VALUES ($1,$2,$3) RETURNING *;`,
        [body.body, body.author, article_id]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};

exports.updateArticulebyArticule_id = (inc_votes, article_id) => {
  const incVotes = inc_votes;
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "bad request!",
    });
  }
  if (Object.keys(inc_votes).length === 0) {
    return Promise.reject({
      status: 400,
      msg: "invalid input",
    });
  }
  if (isNaN(Object.values(incVotes))) {
    return Promise.reject({
      status: 400,
      msg: "invalid input",
    });
  }

  return checkIfArticleExists(article_id).then(() => {
    return db
      .query(
        `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
        `,
        [incVotes.inc_votes, article_id]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => {
    return result.rows;
  });
};

exports.getDeletedCommentsById = (comment_id) => {
  if (isNaN(comment_id)) {
    return Promise.reject({
      status: 400,
      msg: "bad request!",
    });
  }
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment_id not found!" });
      }
      return result.rows[0];
    });
};
