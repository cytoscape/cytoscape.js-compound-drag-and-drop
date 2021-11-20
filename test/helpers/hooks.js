const puppeteer = require("puppeteer");
const {AfterAll, Before, setWorldConstructor, World} = require("@cucumber/cucumber");

let isCi;

Before(async function () {
  let headless = false;
  isCi = this.parameters.ci && JSON.parse(this.parameters.ci);

  if (isCi) {
    headless = true;
  }

  let browser = await puppeteer.launch({
    defaultViewport: null,
    headless: headless,
  });
  this.browser = browser;
  this.page = (await browser.pages())[0] || browser.newPage();
});

class DragAndDropWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.page = null;
  }
}

AfterAll(function() {
  if(this.browser && isCi) {
    this.browser.close();
  }
});

setWorldConstructor(DragAndDropWorld);
