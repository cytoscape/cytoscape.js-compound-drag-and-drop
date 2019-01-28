const isParent = n => n.isParent();
const isChild = n => n.isChild();
const isOnlyChild = n => isChild(n) && n.parent().children().length === 1;

const getBounds = n => n.boundingBox({ includeOverlays: false });
const getBoundsTuple = n => ({ node: n, bb: copyBounds(getBounds(n)) });
const copyBounds = bb => ({ x1: bb.x1, x2: bb.x2, y1: bb.y1, y2: bb.y2, w: bb.w, h: bb.h });
const getBoundsCopy = n => copyBounds(getBounds(n));

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

const expandBounds = (bb, padding) => {
  return {
    x1: bb.x1 - padding,
    x2: bb.x2 + padding,
    w: bb.w + 2 * padding,
    y1: bb.y1 - padding,
    y2: bb.y2 + padding,
    h: bb.h + 2 * padding
  };
};

const copyPosition = p => ({ x: p.x, y: p.y });

const arePointsFartherApartThan = (p1, p2, dist) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return dx * dx + dy * dy > dist * dist;
};

module.exports = {
  isParent, isChild, isOnlyChild,
  getBoundsTuple, boundsOverlap, getBounds, expandBounds, copyBounds, getBoundsCopy,
  copyPosition, arePointsFartherApartThan,
  removeParent, setParent
 };