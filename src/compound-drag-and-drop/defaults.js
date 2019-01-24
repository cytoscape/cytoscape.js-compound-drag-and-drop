/* eslint-disable no-unused-vars */

module.exports = {
  dropTarget: node => true, // filter function to specify which nodes are valid drop targets
  grabbedNode: node => true, // filter function to specify which nodes are valid to grab and drop into other nodes
  newParentNode: (grabbedNode, dropTarget) => ({}), // specifies element json for parent nodes added by dropping an orphan node on another orphan
  newJoinParentNode: (joinedNodes) => ({}), // specifies element json for parent nodes added by calls to join(joinedNodes)
  preview: true, // whether to add a preview node (on over) to simulate the resultant compound (on drop)
  tapholdToSplit: true, // whether to perform a split on a node on taphold
  threshold: 10 // adds a padding to the drop target area to make dropping easier
};