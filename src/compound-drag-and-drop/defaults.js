/* eslint-disable no-unused-vars */

module.exports = {
  dropTarget: node => true, // filter function to specify which nodes are valid drop targets
  grabbedNode: node => true, // filter function to specify which nodes are valid to grab and drop into other nodes
  newParentNode: (grabbedNode, dropSibling) => ({}), // specifies element json for parent nodes added by dropping an orphan node on another orphan
  overThreshold: 10, // make dragging over a drop target easier by expanding the hit area by this amount on all sides
  outThreshold: 10 // make dragging out of a drop target a bit harder by expanding the hit area by this amount on all sides
};