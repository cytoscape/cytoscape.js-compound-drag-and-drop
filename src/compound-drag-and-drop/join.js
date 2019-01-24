const { isParent } = require('./util');

const join = function(nodes){
  const { options, cy } = this;
  const parent = nodes.filter(isParent);
  const nonParents = nodes.not(parent);

  if( parent.length > 1 ){
    console.warn(`Can not join with more than one parent specified.  Bailing out of join...`); // eslint-disable-line no-console
    return;
  }

  if( parent.nonempty() ){ // put all non parents into parent
    nonParents.filter(n => !parent.same(n.parent())).move({ parent: parent.id() });
  } else { // put all children in a new parent node
    const newParent = cy.add( options.newJoinParentNode(nonParents) );

    nonParents.move({ parent: newParent.id() });
  }
};

module.exports = { join };