const { isChild, isParent, freshRef } = require('./util');

const split = function(eles){
  const cy = this.cy;

  cy.batch(() => {
    const nodes = eles.nodes();
    const parents = nodes.filter(isParent);
    const children = nodes.filter(isChild);
    const toMove = parents.children().add(children);
    const emptyParents = children.parent().filter(n => toMove.contains(n.children()));
    const toRemove = parents.add(emptyParents);

    toMove.move({ parent: null });

    toRemove.map(freshRef).forEach(n => n.remove());
  });
};

module.exports = { split };