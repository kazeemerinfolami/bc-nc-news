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

describe("/api/topics", () => {
  test("GET 200 - respond with an object containing all the slug", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const { result } = res.body;
        //if result is an array
        expect(result).toBeInstanceOf(Array);
        //length to be 3
        expect(result.length).toBe(3);
        //for each slug object should match the test object
        result.forEach((slugTopic) => {
          expect(slugTopic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("GET 404 - if not found", () => {
    return request(app)
      .get("/api/topics/gysyugysyugisuygyugsu")
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
  //   test("GET: 200 - the array of articles is sorted by date by default", () => {
  //     return request(app)
  //       .get("/api/articles")
  //       .expect(200)
  //       .then((res) => {
  //         const { articles } = res.body;
  //         expect(articles).toBeSortedBy("created_at");
  //       });
  //   });
});
