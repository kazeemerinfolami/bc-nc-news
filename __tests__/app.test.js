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
  test("GET: 200 response with an object that match the articule_id", () => {
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
