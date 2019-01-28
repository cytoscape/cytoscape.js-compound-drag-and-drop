const {
  isParent, isChild, isOnlyChild,
  getBounds, getBoundsTuple, boundsOverlap, expandBounds, getBoundsCopy,
  setParent, removeParent
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
    const isMultiplySelected = n => n.selected() && cy.elements('node:selected').length > 1;
    const canBeGrabbed = n => !isParent(n) && !isMultiplySelected(n) && options.grabbedNode(n);
    const canBeDropTarget = n => !isChild(n) && !n.same(node) && options.dropTarget(n);
    const canPullFromParent = n => isChild(n);

    if( !this.enabled || !canBeGrabbed(node) ){ return; }

    this.inGesture = true;
    this.grabbedNode = node;
    this.boundsTuples = cy.nodes(canBeDropTarget).map(getBoundsTuple);
    this.dropTarget = cy.collection();
    this.dropSibling = cy.collection();

    if( canPullFromParent(node) ){
      this.dropTarget = node.parent();
      this.dropTargetBounds = getBoundsCopy(this.dropTarget);
    }

    this.grabbedNode.addClass('cdnd-grabbed-node');
    this.dropTarget.addClass('cdnd-drop-target');

    node.emit('cdndgrab');
  });

  this.addListener('drag', 'node', () => {
    if( !this.inGesture || !this.enabled ){ return; }

    if( this.dropTarget.nonempty() ){ // already in a parent
      const bb = expandBounds( getBounds(this.grabbedNode), options.outThreshold );
      const parent = this.dropTarget;
      const rmFromParent = !boundsOverlap(this.dropTargetBounds, bb);
      const grabbedIsOnlyChild = isOnlyChild(this.grabbedNode);

      if( rmFromParent ){
        removeParent(this.grabbedNode);
        removeParent(this.dropSibling);

        this.dropTarget.removeClass('cdnd-drop-target');
        this.dropSibling.removeClass('cdnd-drop-sibling');

        if(
          this.dropSibling.nonempty() // remove extension-created parents on out
          || grabbedIsOnlyChild // remove empty parents
        ){
          this.dropTarget.remove();
        }

        // make sure the removal updates the bounds tuples properly
        for( let i = this.boundsTuples.length - 1; i >= 0; i-- ){
          let tuple = this.boundsTuples[i];

          if( tuple.node.same(this.dropTarget) ){
            if( this.dropTarget.removed() ){
              this.boundsTuples.splice(i, 1);
            } else {
              tuple.bb = getBoundsCopy(this.dropTarget);
            }

            break;
          }
        }

        this.dropTarget = cy.collection();
        this.dropSibling = cy.collection();
        this.dropTargetBounds = null;

        this.grabbedNode.emit('cdndout', [parent]);
      }
    } else { // not in a parent
      const bb = expandBounds( getBounds(this.grabbedNode), options.overThreshold );
      const overlappingNodes = this.boundsTuples.filter(t => boundsOverlap(bb, t.bb)).map(t => t.node);

      if( overlappingNodes.length > 0 ){ // potential parent
        const overlappingParents = overlappingNodes.filter(isParent);
        let parent, sibling;

        if( overlappingParents.length > 0 ){
          sibling = cy.collection();
          parent = overlappingParents[0]; // TODO maybe use a metric here to select which one
        } else {
          sibling = overlappingNodes[0]; // TODO maybe use a metric here to select which one
          parent = cy.add( options.newParentNode(this.grabbedNode, sibling) );
        }

        parent.addClass('cdnd-drop-target');
        sibling.addClass('cdnd-drop-sibling');

        setParent(sibling, parent);

        this.dropTargetBounds = getBoundsCopy(parent);

        setParent(this.grabbedNode, parent);

        this.dropTarget = parent;
        this.dropSibling = sibling;

        this.grabbedNode.emit('cdndover', [parent, sibling]);
      }
    }
  });

  this.addListener('free', 'node', () => {
    if( !this.inGesture || !this.enabled ){ return; }

    const { grabbedNode, dropTarget, dropSibling } = this;

    grabbedNode.removeClass('cdnd-grabbed-node');
    dropTarget.removeClass('cdnd-drop-target');
    dropSibling.removeClass('cdnd-drop-sibling');

    this.grabbedNode = cy.collection();
    this.dropTarget = cy.collection();
    this.dropSibling = cy.collection();
    this.dropTargetBounds = null;
    this.boundsTuples = [];
    this.inGesture = false;

    grabbedNode.emit('cdnddrop', [dropTarget, dropSibling]);
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