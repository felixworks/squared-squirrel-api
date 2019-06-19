const app = require("../src/app");

describe("App", () => {
  it("GET / responds with 200 containing JSON with OK status", () => {
    // this doesn't work. Look up what should be passed to .expect to fix this.
    return supertest(app)
      .get("/api/*")
      .expect(res)
      .to.deep.include({ ok: true });
  });
});
