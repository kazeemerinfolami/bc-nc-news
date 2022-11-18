const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");

const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const { post } = require("../app.js");

beforeEach(() => {
  return seed({
    articleData,
    commentData,
    topicData,
    userData,
  });
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("GET 200 - respond with an object containing all the slug", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const { topics } = res.body;
        //if topic is an array
        expect(topics).toBeInstanceOf(Array);
        //length to be 3
        expect(topics.length).toBe(3);
        //for each slug object should match the test object
        topics.forEach((slugTopic) => {
          expect(slugTopic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /URLNotFound", () => {
  test("GET 404 - if URL not found", () => {
    return request(app)
      .get("/URLNotFound")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("page does not exist");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200 - respond with an object containing all the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        //if article is an array
        expect(articles).toBeInstanceOf(Array);
        //length to be 12
        expect(articles.length).toBe(12);
        //for each article object should match the test object
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET: 200 - can sort the articles by the specified sort_by value", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 response with an object that match the article_id", () => {
    const articleID = 1;
    return request(app)
      .get(`/api/articles/${articleID}`)
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        //if article is an object
        expect(article).toBeInstanceOf(Object);
        //for each article object should match the test object
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("GET: 404 response with an err message if article_id is not found", () => {
    return request(app)
      .get(`/api/articles/234`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article not found");
      });
  });
  test("GET: 400 response with an err message: bad request", () => {
    return request(app)
      .get(`/api/articles/notAnId`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 response with an object object containing all the comments if article_id exist", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        //if topic is an array
        expect(comments).toBeInstanceOf(Array);
        //comments should be served with the most recent comments first
        expect(comments).toBeSortedBy("created_at", { descending: true });
        //for each comments object should match the test object
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("GET: 404 response with an err message if article_id is not found", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("comment not found");
      });
  });
  test("GET: 400 response with an err message: bad request", () => {
    const article_id = "notaValidId";
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST:201 inserts a new comment to the db and send the new comment back to the client", () => {
    const newComment = {
      author: "butter_bridge",
      body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
        expect(response.body.comment).toMatchObject({
          article_id: 2,
          ...newComment,
        });
      });
  });
  test("POST: 400 response with an err message: bad request", () => {
    const article_id = "notaValidId";
    const newComment = {
      author: "butter_bridge",
      body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
  test("POST: 400 response with an err message: if an input is empty", () => {
    const newComment = {
      body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("all inputs are required");
      });
  });
  test("POST: 404 response with an err message if article_id is not found", () => {
    const article_id = 200;
    const newComment = {
      author: "butter_bridge",
      body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article not found");
      });
  });
  test("POST: 404 response with bad request! if username does not exist", () => {
    const newComment = {
      author: "userNotFound",
      body: "coding...",
    };
    return request(app)
      .post(`/api/articles/2/comments`)
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("user not found");
      });
  });
});
