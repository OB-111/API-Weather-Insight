const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server"); // Assuming your server file is named server.js

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Weather Conditions API", () => {
  describe("GET /weather-conditions", () => {
    it("should return 200 and an array of weather intervals with valid conditions and operator", (done) => {
      chai
        .request(app)
        .get("/weather-conditions")
        .query({
          rule: "temperature>30,windSpeed<10,visibility>4", // Three valid conditions separated by commas
          operator: "AND" || "OR", // Provide a valid operator ('AND' or 'OR')
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");

          done();
        });
    });

    // Add more test cases for other scenarios
  });
});
