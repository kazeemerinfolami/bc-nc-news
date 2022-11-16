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
