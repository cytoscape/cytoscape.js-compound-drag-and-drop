/*eslint-disable no-undef*/
const getNodeCoordinates = async(page, firstNode) => {
  return await page.evaluate((firstNodeId) => {
    let nodePosition = cy.$id(firstNodeId).renderedPosition();

    let canvas = document.getElementById('cy').getBoundingClientRect();

    return {x: nodePosition.x + canvas.x, y: nodePosition.y + canvas.y};
  }, firstNode);
};

const fitViewOnNode = async(page, nodeId) => {
  page.evaluate((nodeId) => {
    cy.fit(cy.$(nodeId), 100);
  }, nodeId);
};

const centerCanvas = async(page, nodeId) => {
  page.evaluate((nodeId) => {
    return new Promise((resolve) => {
      cy.animation( {
        center: nodeId ? {eles: `#${nodeId}`}: {},
        duration: 300,
        complete: resolve
      }).play();
    });
  }, nodeId);
};

const isCompound = async(page, nodeId) => {
  return await page.evaluate((nodeId) => {
    return cy.getElementById(nodeId).isParent();
  }, nodeId);
};

const getParentOf = async(page, nodeId) => {
  return await page.evaluate((nodeId) => {
    return cy.getElementById(nodeId).parent().id();
  }, nodeId);
};

const getChildrenOf = async(page, nodeId) => {
  return await page.evaluate((nodeId) => {
    return cy.getElementById(nodeId).children().map(child => child.id());
  }, nodeId);
};

const createNode = async(page, nodeId, parentId) => {
  return await page.evaluate((nodeId, parentId) => {
    cy.add({
      group: 'nodes',
      data: {
        id: nodeId,
        parent: parentId,
      }
    });

    cy.layout({name: 'random', padding: 100}).run();
  }, nodeId, parentId);
};

module.exports = { getNodeCoordinates, fitViewOnNode, centerCanvas, isCompound, getParentOf, createNode, getChildrenOf };
