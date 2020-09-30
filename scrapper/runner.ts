const assert = require("assert");

const site_metadata = require("./config/site_metadata");
import ScrapperService = require("./scrapper_service");

describe("Running this to access the browser", () => {
  it("guess js is not an automation language", () => {
    new ScrapperService(site_metadata).call();
  });
});
