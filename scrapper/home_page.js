const assert = require("assert");
const HomePage = require("./page_models/CkanSiteListing.page");
const productWithPersonalization = "manga palmer";

describe("New user", () => {
  it("can personalize product with variation", () => {
    console.log(HomePage.enter());
  });
});
