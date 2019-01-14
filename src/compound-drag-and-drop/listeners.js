const isParent = n => n.isParent();
const isChild = n => n.isChild();

const getBoundsTuple = n => ({ node: n, bb: n.boundingBox() });

const removeParent = n => n.move({ parent: null });
const setParent = (n, parent) => n.move({ parent: parent.id() });

const boundsOverlap = (bb1, bb2) => {
  // case: one bb to right of other
  if( bb1.x1 > bb2.x2 ){ return false; }
  if( bb2.x1 > bb1.x2 ){ return false; }

  // case: one bb to left of other
  if( bb1.x2 < bb2.x1 ){ return false; }
  if( bb2.x2 < bb1.x1 ){ return false; }

  // case: one bb above other
  if( bb1.y2 < bb2.y1 ){ return false; }
  if( bb2.y2 < bb1.y1 ){ return false; }

  // case: one bb below other
  if( bb1.y1 > bb2.y2 ){ return false; }
  if( bb2.y1 > bb1.y2 ){ return false; }

  // otherwise, must have some overlap
  return true;
};

const addListener = function(event, selector, callback){
  this.listeners.push({ event, selector, callback });

  if( selector == null ){
    this.cy.on(event, callback);
  } else {
    this.cy.on(event, selector, callback);
  }
};

const addListeners = function(){
  const { options, cy } = this;

  this.addListener('grab', 'node', e => {
    const node = e.target;

    if( isParent(node) ){ return; }

    this.inGesture = true;
    this.grabbedNode = node;
    this.boundsTuples = cy.nodes().not(node).map(getBoundsTuple);
    this.sibling = cy.collection();
    this.parent = cy.collection();

    // if( isChild(node) ){
    //   removeParent(node);
    // }
  });

  this.addListener('drag', 'node', e => {
    if( !this.inGesture ){ return; }

    const node = e.target;
    const bb = node.boundingBox();
    const overlappingNodes = this.boundsTuples.filter(t => boundsOverlap(bb, t.bb)).map(t => t.node);

    this.sibling = cy.collection();
    this.parent = cy.collection();

    if( overlappingNodes.length > 0 ){
      const overlappingParents = overlappingNodes.filter(isParent);

      if( overlappingParents.length > 0 ){
        this.sibling = cy.collection();
        this.parent = overlappingParents[0]; // TODO select particular one by metric

        // TODO event & style
      } else {
        this.sibling = overlappingNodes[0]; // TODO select by metric
        this.parent = cy.collection();

        // TODO event & style
      }
    }
  });

  this.addListener('free', 'node', e => {
    if( !this.inGesture ){ return; }

    const node = e.target;

    if( this.parent.nonempty() ){
      setParent(node, this.parent);

      // TODO event
    } else if( this.sibling.nonempty() ){
      const parent = cy.add({ group: 'nodes' }); // TODO parameterise

      setParent(this.sibling, parent);
      setParent(node, parent);

      // TODO event
    }

    this.sibling = cy.collection();
    this.parent = cy.collection();
    this.inGesture = false;
  });
};

const removeListeners = function(){
  const { cy } = this;

  this.listeners.forEach(lis => {
    const { event, selector, callback } = lis;

    if( selector == null ){
      cy.removeListener(event, callback);
    } else {
      cy.removeListener(event, selector, callback);
    }
  });

  this.listeners = [];
};

module.exports = { addListener, addListeners, removeListeners };