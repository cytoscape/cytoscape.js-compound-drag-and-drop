const { getBounds } = require('./util');

const addPreview = function(){
  if( this.preview != null && this.preview.nonempty() ){
    return this.preview; // make sure we don't have duplicates
  } else {
    this.preview = this.cy.add({
      group: 'nodes',
      classes: 'cdnd-preview'
    });

    return this.preview;
  }
};

const canUpdatePreview = function(){
  return this.options.preview && this.dropTarget != null && this.preview != null && this.preview.nonempty();
};

const resizePreview = function(){
  if( !this.canUpdatePreview() ){ return; }

  const { dropTarget, grabbedNode, preview } = this;

  let bb;

  if( dropTarget.isParent() ){
    dropTarget.addClass('cdnd-hidden-parent');

    bb = getBounds( dropTarget.children().union(grabbedNode) );
  } else {
    bb = getBounds( dropTarget.union(grabbedNode) );
  }

  preview.style({
    'width': bb.w,
    'height': bb.h
  }).position({
    x: (bb.x1 + bb.x2)/2,
    y: (bb.y1 + bb.y2)/2
  });
};

const removePreview = function(){
  if( !this.canUpdatePreview() ){ return; }

  const { dropTarget, preview } = this;

  dropTarget.removeClass('cdnd-hidden-parent');

  preview.remove();

  this.preview = null;
};

module.exports = { addPreview, canUpdatePreview, resizePreview, removePreview };