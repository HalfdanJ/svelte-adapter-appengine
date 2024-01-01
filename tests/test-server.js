import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";

const { expect } = chai;

chai.use(chaiHttp);

describe("Integration test", () => {
  it("runs the server", (done) => {
    chai
      .request("http://localhost:8080")
      .get("/sverdle")
      .end((error, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it("return 200 OK from /_ah/start scaling route", (done) => {
    chai
      .request("http://localhost:8080")
      .get("/_ah/start")
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.text).to.equal("OK");
        done();
      });
  });

  it("return 200 OK from /test.json prerendered route", (done) => {
    chai
      .request("http://localhost:8080")
      .get("/test.json")
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.text).to.equal('{"test":true}');
        done();
      });
  });
});
