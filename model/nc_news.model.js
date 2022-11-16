const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = () => {
  let addCommentCountQuery = `
    SELECT articles.*, 
    COUNT(comments.article_id)::INT AS comment_count 
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY comments.article_id, articles.article_id
    ORDER BY created_at DESC;
    `;
  return db.query(addCommentCountQuery).then((result) => {
    return result.rows;
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
      .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
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
