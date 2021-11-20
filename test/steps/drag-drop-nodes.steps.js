const cucumber = require("@cucumber/cucumber");
const Given = cucumber.Given;
const When = cucumber.When;
const Then = cucumber.Then;
const path = require("path");
const {getNodeCoordinates, centerCanvas, isCompound, getParentOf, createNode, getChildrenOf} = require("../helpers/cytoscape.helper");
const {expect} = require("chai");

Given(/^I have opened the cytoscape canvas$/, async function () {
  await this.page.goto('file://' + path.resolve(`./test/test-beds/canvas.html`));
});

Given("I have the following nodes", async function (dataTable) {
  for (const obj of dataTable.hashes()) {
    await createNode(this.page, obj.Node, obj.Parent);
  }

  let screenShot = await this.page.screenshot({path: 'test/reports/nodes.png', type: 'png'});
  this.attach(screenShot, 'image/png');
});

When(/^I drag node "([^"]*)" over node "([^"]*)"$/, async function (firstNode, secondNode) {
  const page = this.page;
  let firstNodeCoordinates = await getNodeCoordinates(page, firstNode);
  let secondNodeCoordinates = await getNodeCoordinates(page, secondNode);

  await page.mouse.move(firstNodeCoordinates.x, firstNodeCoordinates.y);
  await page.mouse.down();
  await page.mouse.move(secondNodeCoordinates.x, secondNodeCoordinates.y, {steps: 24});
  await page.mouse.up();

  await centerCanvas(page);
});

When(/^I drag node "([^"]*)" outside of node "([^"]*)"$/, async function (childNode, parentNode) {
  const page = this.page;
  let childCoordinates = await getNodeCoordinates(page, childNode);
  let parentCoordinates = await getNodeCoordinates(page, parentNode);

  await page.mouse.move(childCoordinates.x, childCoordinates.y);
  await page.mouse.down();
  await page.mouse.move(parentCoordinates.x + 1000, parentCoordinates.y, {steps: 10});
  await page.mouse.up();
});

Then(/^Node "([^"]*)" becomes a compound node$/, async function (nodeId) {
  let result = await isCompound(this.page, nodeId);
  expect(result).to.eq(true);
});

Then(/^Node "([^"]*)" becomes a child of node "([^"]*)"$/, async function (childNodeId, expectedParent) {
  let parent = await getParentOf(this.page, childNodeId);

  let screenShot = await this.page.screenshot({path: 'test/reports/nodes.png', type: 'png'});
  this.attach(screenShot, 'image/png');

  expect(parent).to.eq(expectedParent);
});

Given(/^I set the newParentNode function to$/, async function (options) {
  await this.page.evaluate((options) => {
    let newParentNodeFunc = eval(options);
    window.cy.compoundDragAndDrop({
      newParentNode: newParentNodeFunc
    });
  }, options);
});

Then(/^Node "([^"]*)" is no longer a compound node$/, async function (nodeId) {
  let result = await isCompound(this.page, nodeId);
  expect(result).to.eq(false);
});

Then(/^Node "([^"]*)" is no longer the parent of node "([^"]*)"$/, async function (parentId, childId) {
  let children = await getChildrenOf(this.page, parentId);


  let screenShot = await this.page.screenshot({path: 'test/reports/nodes.png', type: 'png'});
  this.attach(screenShot, 'image/png');

  expect(children).not.contain(childId);
});
