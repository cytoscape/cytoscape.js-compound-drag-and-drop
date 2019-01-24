const {
  isParent, isChild,
  getBounds, getBoundsTuple, boundsOverlap, expandBounds,
  setParent, freshRef
} = require('./util');

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

    if(
      !this.enabled
      || isParent(node) || isChild(node)
      || (node.selected() && cy.elements('node:selected').length > 1) // dragging multiple nodes not allowed
      || !options.grabbedNode(node)
    ){ return; }

    this.inGesture = true;
    this.grabbedNode = node;
    this.boundsTuples = cy.nodes(options.dropTarget).not(node).map(getBoundsTuple);
    this.dropTarget = cy.collection();
  });

  this.addListener('drag', 'node', () => {
    if( !this.inGesture || !this.enabled ){ return; }

    cy.startBatch();
    const bb = expandBounds( getBounds(this.grabbedNode), options.threshold );
    const overlappingNodes = this.boundsTuples.filter(t => boundsOverlap(bb, t.bb)).map(t => t.node);

    this.dropTarget.removeClass('cdnd-drop-target');

    if( overlappingNodes.length > 0 ){
      const overlappingParents = overlappingNodes.filter(isParent);

      this.dropTarget = overlappingParents[0] || overlappingNodes[0]; // TODO select particular one by metric

      this.addPreview();
      this.resizePreview();

      this.dropTarget.addClass('cdnd-drop-target');

      this.grabbedNode.emit('cdndover', [this.dropTarget]);
    } else { // no overlapping nodes
      if( this.dropTarget.nonempty() ){
        this.grabbedNode.emit('cdndout', [this.dropTarget]);
      }

      this.removePreview();

      this.dropTarget = cy.collection();
    }

    cy.endBatch();
  });

  this.addListener('free', 'node', () => {
    if( !this.inGesture ){ return; }

    cy.startBatch();

    this.dropTarget.removeClass('cdnd-drop-target');

    this.removePreview();

    if( this.dropTarget.nonempty() ){
      this.dropTarget.removeClass('cdnd-drop-target');

      if( this.dropTarget.isParent() ){
        setParent(this.grabbedNode, this.dropTarget);

        this.grabbedNode = freshRef(this.grabbedNode);

        this.grabbedNode.emit('cdnddrop', [this.dropTarget, this.dropTarget]);
      } else {
        const parent = cy.add( options.newParentNode(this.grabbedNode, this.dropTarget) );

        setParent(this.dropTarget, parent);
        setParent(this.grabbedNode, parent);

        this.dropTarget = freshRef(this.dropTarget);
        this.grabbedNode = freshRef(this.grabbedNode);

        this.grabbedNode.emit('cdnddrop', [parent, this.dropTarget]);
      }
    }

    this.dropTarget = cy.collection();
    this.inGesture = false;

    cy.endBatch();
  });

  this.addListener('taphold', 'node', e => {
    if( this.inGesture ){ return; } // shouldn't be possible, but just in case...

    const node = e.target;

    if( options.tapholdToSplit ){
      this.split(node);
    }
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