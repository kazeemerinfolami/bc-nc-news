const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.fetchArticules = () => {
  return db.query("SELECT * FROM articles;").then((result) => {
    return result.rows;
  });
};

exports.fetchArticules = (sort_by = "created_at") => {
  const columns = ["created_at"];
  if (!columns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "invalid sort query!",
    });
  }
  let addCommentCountQuery = `
    SELECT articles.*, 
    COUNT(comments.article_id)::INT AS comment_count 
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY comments.article_id, articles.article_id
    ORDER BY ${sort_by} DESC;
    `;
  return db.query(addCommentCountQuery).then((result) => {
    return result.rows;
  });
};
