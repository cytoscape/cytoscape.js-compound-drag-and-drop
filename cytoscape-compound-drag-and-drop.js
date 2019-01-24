(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeCompoundDragAndDrop"] = factory();
	else
		root["cytoscapeCompoundDragAndDrop"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isParent = function isParent(n) {
  return n.isParent();
};
var isChild = function isChild(n) {
  return n.isChild();
};

var getBounds = function getBounds(n) {
  return n.boundingBox({ includeOverlays: false });
};
var getBoundsTuple = function getBoundsTuple(n) {
  return { node: n, bb: getBounds(n) };
};

var removeParent = function removeParent(n) {
  return n.move({ parent: null });
};
var setParent = function setParent(n, parent) {
  return n.move({ parent: parent.id() });
};
var freshRef = function freshRef(n) {
  return n.cy().getElementById(n.id());
};

var boundsOverlap = function boundsOverlap(bb1, bb2) {
  // case: one bb to right of other
  if (bb1.x1 > bb2.x2) {
    return false;
  }
  if (bb2.x1 > bb1.x2) {
    return false;
  }

  // case: one bb to left of other
  if (bb1.x2 < bb2.x1) {
    return false;
  }
  if (bb2.x2 < bb1.x1) {
    return false;
  }

  // case: one bb above other
  if (bb1.y2 < bb2.y1) {
    return false;
  }
  if (bb2.y2 < bb1.y1) {
    return false;
  }

  // case: one bb below other
  if (bb1.y1 > bb2.y2) {
    return false;
  }
  if (bb2.y1 > bb1.y2) {
    return false;
  }

  // otherwise, must have some overlap
  return true;
};

var expandBounds = function expandBounds(bb, padding) {
  return {
    x1: bb.x1 - padding,
    x2: bb.x2 + padding,
    w: bb.w + 2 * padding,
    y1: bb.y1 - padding,
    y2: bb.y2 + padding,
    h: bb.h + 2 * padding
  };
};

module.exports = {
  isParent: isParent, isChild: isChild,
  getBoundsTuple: getBoundsTuple, boundsOverlap: boundsOverlap, getBounds: getBounds, expandBounds: expandBounds,
  removeParent: removeParent, setParent: setParent, freshRef: freshRef
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign = __webpack_require__(2);
var defaults = __webpack_require__(3);
var toggle = __webpack_require__(8);
var listeners = __webpack_require__(5);
var preview = __webpack_require__(6);
var split = __webpack_require__(7);
var join = __webpack_require__(4);

var DragAndDrop = function DragAndDrop(cy, options) {
  this.cy = cy;
  this.options = assign({}, defaults, options);
  this.listeners = [];
  this.enabled = true;

  this.addListeners();
};

var destroy = function destroy() {
  this.removeListeners();
};

[toggle, listeners, preview, split, join, { destroy: destroy }].forEach(function (def) {
  assign(DragAndDrop.prototype, def);
});

module.exports = function (options) {
  var cy = this;

  return new DragAndDrop(cy, options);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }

  srcs.filter(function (src) {
    return src != null;
  }).forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });

  return tgt;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable no-unused-vars */

module.exports = {
  dropTarget: function dropTarget(node) {
    return true;
  }, // filter function to specify which nodes are valid drop targets
  grabbedNode: function grabbedNode(node) {
    return true;
  }, // filter function to specify which nodes are valid to grab and drop into other nodes
  newParentNode: function newParentNode(grabbedNode, dropTarget) {
    return {};
  }, // specifies element json for parent nodes added by dropping an orphan node on another orphan
  newJoinParentNode: function newJoinParentNode(joinedNodes) {
    return {};
  }, // specifies element json for parent nodes added by calls to join(joinedNodes)
  preview: true, // whether to add a preview node (on over) to simulate the resultant compound (on drop)
  tapholdToSplit: true, // whether to perform a split on a node on taphold
  threshold: 10 // adds a padding to the drop target area to make dropping easier
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    isParent = _require.isParent;

var join = function join(nodes) {
  var options = this.options,
      cy = this.cy;

  var parent = nodes.filter(isParent);
  var nonParents = nodes.not(parent);

  if (parent.length > 1) {
    console.warn('Can not join with more than one parent specified.  Bailing out of join...'); // eslint-disable-line no-console
    return;
  }

  if (parent.nonempty()) {
    // put all non parents into parent
    nonParents.filter(function (n) {
      return !parent.same(n.parent());
    }).move({ parent: parent.id() });
  } else {
    // put all children in a new parent node
    var newParent = cy.add(options.newJoinParentNode(nonParents));

    nonParents.move({ parent: newParent.id() });
  }
};

module.exports = { join: join };

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    isParent = _require.isParent,
    isChild = _require.isChild,
    getBounds = _require.getBounds,
    getBoundsTuple = _require.getBoundsTuple,
    boundsOverlap = _require.boundsOverlap,
    expandBounds = _require.expandBounds,
    setParent = _require.setParent,
    freshRef = _require.freshRef;

var addListener = function addListener(event, selector, callback) {
  this.listeners.push({ event: event, selector: selector, callback: callback });

  if (selector == null) {
    this.cy.on(event, callback);
  } else {
    this.cy.on(event, selector, callback);
  }
};

var addListeners = function addListeners() {
  var _this = this;

  var options = this.options,
      cy = this.cy;


  this.addListener('grab', 'node', function (e) {
    var node = e.target;

    if (!_this.enabled || isParent(node) || isChild(node) || node.selected() && cy.elements('node:selected').length > 1 // dragging multiple nodes not allowed
    || !options.grabbedNode(node)) {
      return;
    }

    _this.inGesture = true;
    _this.grabbedNode = node;
    _this.boundsTuples = cy.nodes(options.dropTarget).not(node).map(getBoundsTuple);
    _this.dropTarget = cy.collection();
  });

  this.addListener('drag', 'node', function () {
    if (!_this.inGesture || !_this.enabled) {
      return;
    }

    cy.startBatch();
    var bb = expandBounds(getBounds(_this.grabbedNode), options.threshold);
    var overlappingNodes = _this.boundsTuples.filter(function (t) {
      return boundsOverlap(bb, t.bb);
    }).map(function (t) {
      return t.node;
    });

    _this.dropTarget.removeClass('cdnd-drop-target');

    if (overlappingNodes.length > 0) {
      var overlappingParents = overlappingNodes.filter(isParent);

      _this.dropTarget = overlappingParents[0] || overlappingNodes[0]; // TODO select particular one by metric

      _this.addPreview();
      _this.resizePreview();

      _this.dropTarget.addClass('cdnd-drop-target');

      _this.grabbedNode.emit('cdndover', [_this.dropTarget]);
    } else {
      // no overlapping nodes
      if (_this.dropTarget.nonempty()) {
        _this.grabbedNode.emit('cdndout', [_this.dropTarget]);
      }

      _this.removePreview();

      _this.dropTarget = cy.collection();
    }

    cy.endBatch();
  });

  this.addListener('free', 'node', function () {
    if (!_this.inGesture) {
      return;
    }

    cy.startBatch();

    _this.dropTarget.removeClass('cdnd-drop-target');

    _this.removePreview();

    if (_this.dropTarget.nonempty()) {
      _this.dropTarget.removeClass('cdnd-drop-target');

      if (_this.dropTarget.isParent()) {
        setParent(_this.grabbedNode, _this.dropTarget);

        _this.grabbedNode = freshRef(_this.grabbedNode);

        _this.grabbedNode.emit('cdnddrop', [_this.dropTarget, _this.dropTarget]);
      } else {
        var parent = cy.add(options.newParentNode(_this.grabbedNode, _this.dropTarget));

        setParent(_this.dropTarget, parent);
        setParent(_this.grabbedNode, parent);

        _this.dropTarget = freshRef(_this.dropTarget);
        _this.grabbedNode = freshRef(_this.grabbedNode);

        _this.grabbedNode.emit('cdnddrop', [parent, _this.dropTarget]);
      }
    }

    _this.dropTarget = cy.collection();
    _this.inGesture = false;

    cy.endBatch();
  });

  this.addListener('taphold', 'node', function (e) {
    if (_this.inGesture) {
      return;
    } // shouldn't be possible, but just in case...

    var node = e.target;

    if (options.tapholdToSplit) {
      _this.split(node);
    }
  });
};

var removeListeners = function removeListeners() {
  var cy = this.cy;


  this.listeners.forEach(function (lis) {
    var event = lis.event,
        selector = lis.selector,
        callback = lis.callback;


    if (selector == null) {
      cy.removeListener(event, callback);
    } else {
      cy.removeListener(event, selector, callback);
    }
  });

  this.listeners = [];
};

module.exports = { addListener: addListener, addListeners: addListeners, removeListeners: removeListeners };

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    getBounds = _require.getBounds;

var addPreview = function addPreview() {
  if (this.preview != null && this.preview.nonempty()) {
    return this.preview; // make sure we don't have duplicates
  } else {
    this.preview = this.cy.add({
      group: 'nodes',
      classes: 'cdnd-preview'
    });

    return this.preview;
  }
};

var canUpdatePreview = function canUpdatePreview() {
  return this.options.preview && this.dropTarget != null && this.preview != null && this.preview.nonempty();
};

var resizePreview = function resizePreview() {
  if (!this.canUpdatePreview()) {
    return;
  }

  var dropTarget = this.dropTarget,
      grabbedNode = this.grabbedNode,
      preview = this.preview;


  var bb = void 0;

  if (dropTarget.isParent()) {
    dropTarget.addClass('cdnd-hidden-parent');

    bb = getBounds(dropTarget.children().union(grabbedNode));
  } else {
    bb = getBounds(dropTarget.union(grabbedNode));
  }

  preview.style({
    'width': bb.w,
    'height': bb.h
  }).position({
    x: (bb.x1 + bb.x2) / 2,
    y: (bb.y1 + bb.y2) / 2
  });
};

var removePreview = function removePreview() {
  if (!this.canUpdatePreview()) {
    return;
  }

  var dropTarget = this.dropTarget,
      preview = this.preview;


  dropTarget.removeClass('cdnd-hidden-parent');

  preview.remove();

  this.preview = null;
};

module.exports = { addPreview: addPreview, canUpdatePreview: canUpdatePreview, resizePreview: resizePreview, removePreview: removePreview };

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    isChild = _require.isChild,
    isParent = _require.isParent,
    freshRef = _require.freshRef;

var split = function split(eles) {
  var cy = this.cy;

  cy.batch(function () {
    var nodes = eles.nodes();
    var parents = nodes.filter(isParent);
    var children = nodes.filter(isChild);
    var toMove = parents.children().add(children);
    var emptyParents = children.parent().filter(function (n) {
      return toMove.contains(n.children());
    });
    var toRemove = parents.add(emptyParents);

    toMove.move({ parent: null });

    toRemove.map(freshRef).forEach(function (n) {
      return n.remove();
    });
  });
};

module.exports = { split: split };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function enable() {
  this.enabled = true;
}

function disable() {
  this.enabled = false;
}

module.exports = { enable: enable, disable: disable };

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(1);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('core', 'compoundDragAndDrop', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjZjI0OGIwODZjYzg2NDFmZjE3OCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC91dGlsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3Avam9pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9saXN0ZW5lcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AvcHJldmlldy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9zcGxpdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC90b2dnbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImlzUGFyZW50IiwibiIsImlzQ2hpbGQiLCJnZXRCb3VuZHMiLCJib3VuZGluZ0JveCIsImluY2x1ZGVPdmVybGF5cyIsImdldEJvdW5kc1R1cGxlIiwibm9kZSIsImJiIiwicmVtb3ZlUGFyZW50IiwibW92ZSIsInBhcmVudCIsInNldFBhcmVudCIsImlkIiwiZnJlc2hSZWYiLCJjeSIsImdldEVsZW1lbnRCeUlkIiwiYm91bmRzT3ZlcmxhcCIsImJiMSIsImJiMiIsIngxIiwieDIiLCJ5MiIsInkxIiwiZXhwYW5kQm91bmRzIiwicGFkZGluZyIsInciLCJoIiwibW9kdWxlIiwiZXhwb3J0cyIsImFzc2lnbiIsInJlcXVpcmUiLCJkZWZhdWx0cyIsInRvZ2dsZSIsImxpc3RlbmVycyIsInByZXZpZXciLCJzcGxpdCIsImpvaW4iLCJEcmFnQW5kRHJvcCIsIm9wdGlvbnMiLCJlbmFibGVkIiwiYWRkTGlzdGVuZXJzIiwiZGVzdHJveSIsInJlbW92ZUxpc3RlbmVycyIsImZvckVhY2giLCJwcm90b3R5cGUiLCJkZWYiLCJPYmplY3QiLCJiaW5kIiwidGd0Iiwic3JjcyIsImZpbHRlciIsInNyYyIsImtleXMiLCJrIiwiZHJvcFRhcmdldCIsImdyYWJiZWROb2RlIiwibmV3UGFyZW50Tm9kZSIsIm5ld0pvaW5QYXJlbnROb2RlIiwiam9pbmVkTm9kZXMiLCJ0YXBob2xkVG9TcGxpdCIsInRocmVzaG9sZCIsIm5vZGVzIiwibm9uUGFyZW50cyIsIm5vdCIsImxlbmd0aCIsImNvbnNvbGUiLCJ3YXJuIiwibm9uZW1wdHkiLCJzYW1lIiwibmV3UGFyZW50IiwiYWRkIiwiYWRkTGlzdGVuZXIiLCJldmVudCIsInNlbGVjdG9yIiwiY2FsbGJhY2siLCJwdXNoIiwib24iLCJlIiwidGFyZ2V0Iiwic2VsZWN0ZWQiLCJlbGVtZW50cyIsImluR2VzdHVyZSIsImJvdW5kc1R1cGxlcyIsIm1hcCIsImNvbGxlY3Rpb24iLCJzdGFydEJhdGNoIiwib3ZlcmxhcHBpbmdOb2RlcyIsInQiLCJyZW1vdmVDbGFzcyIsIm92ZXJsYXBwaW5nUGFyZW50cyIsImFkZFByZXZpZXciLCJyZXNpemVQcmV2aWV3IiwiYWRkQ2xhc3MiLCJlbWl0IiwicmVtb3ZlUHJldmlldyIsImVuZEJhdGNoIiwibGlzIiwicmVtb3ZlTGlzdGVuZXIiLCJncm91cCIsImNsYXNzZXMiLCJjYW5VcGRhdGVQcmV2aWV3IiwiY2hpbGRyZW4iLCJ1bmlvbiIsInN0eWxlIiwicG9zaXRpb24iLCJ4IiwieSIsInJlbW92ZSIsImVsZXMiLCJiYXRjaCIsInBhcmVudHMiLCJ0b01vdmUiLCJlbXB0eVBhcmVudHMiLCJjb250YWlucyIsInRvUmVtb3ZlIiwiZW5hYmxlIiwiZGlzYWJs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a0I7QUFDaEIsT0FBSzdFLE9BQUwsR0FBZSxLQUFmO0FBQ0Q7O0FBRURaLE9BQU9DLE9BQVAsR0FBaUIsRUFBRXVGLGNBQUYsRUFBVUMsZ0JBQVYsRUFBakIsQzs7Ozs7Ozs7O0FDUkEsSUFBTUMsT0FBT3ZGLG1CQUFPQSxDQUFDLENBQVIsQ0FBYjs7QUFFQTtBQUNBLElBQUl3RixXQUFXLFNBQVhBLFFBQVcsQ0FBVUMsU0FBVixFQUFxQjtBQUNsQyxNQUFJLENBQUNBLFNBQUwsRUFBZ0I7QUFBRTtBQUFTLEdBRE8sQ0FDTjs7QUFFNUJBLFlBQVcsTUFBWCxFQUFtQixxQkFBbkIsRUFBMENGLElBQTFDLEVBSGtDLENBR2dCO0FBQ25ELENBSkQ7O0FBTUEsSUFBSSxPQUFPRSxTQUFQLEtBQXFCLFdBQXpCLEVBQXNDO0FBQUU7QUFDdENELFdBQVVDLFNBQVY7QUFDRDs7QUFFRDVGLE9BQU9DLE9BQVAsR0FBaUIwRixRQUFqQixDIiwiZmlsZSI6ImN5dG9zY2FwZS1jb21wb3VuZC1kcmFnLWFuZC1kcm9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiY3l0b3NjYXBlQ29tcG91bmREcmFnQW5kRHJvcFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJjeXRvc2NhcGVDb21wb3VuZERyYWdBbmREcm9wXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gOSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgY2YyNDhiMDg2Y2M4NjQxZmYxNzgiLCJjb25zdCBpc1BhcmVudCA9IG4gPT4gbi5pc1BhcmVudCgpO1xuY29uc3QgaXNDaGlsZCA9IG4gPT4gbi5pc0NoaWxkKCk7XG5cbmNvbnN0IGdldEJvdW5kcyA9IG4gPT4gbi5ib3VuZGluZ0JveCh7IGluY2x1ZGVPdmVybGF5czogZmFsc2UgfSk7XG5jb25zdCBnZXRCb3VuZHNUdXBsZSA9IG4gPT4gKHsgbm9kZTogbiwgYmI6IGdldEJvdW5kcyhuKSB9KTtcblxuY29uc3QgcmVtb3ZlUGFyZW50ID0gbiA9PiBuLm1vdmUoeyBwYXJlbnQ6IG51bGwgfSk7XG5jb25zdCBzZXRQYXJlbnQgPSAobiwgcGFyZW50KSA9PiBuLm1vdmUoeyBwYXJlbnQ6IHBhcmVudC5pZCgpIH0pO1xuY29uc3QgZnJlc2hSZWYgPSBuID0+IG4uY3koKS5nZXRFbGVtZW50QnlJZChuLmlkKCkpO1xuXG5jb25zdCBib3VuZHNPdmVybGFwID0gKGJiMSwgYmIyKSA9PiB7XG4gIC8vIGNhc2U6IG9uZSBiYiB0byByaWdodCBvZiBvdGhlclxuICBpZiggYmIxLngxID4gYmIyLngyICl7IHJldHVybiBmYWxzZTsgfVxuICBpZiggYmIyLngxID4gYmIxLngyICl7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIGNhc2U6IG9uZSBiYiB0byBsZWZ0IG9mIG90aGVyXG4gIGlmKCBiYjEueDIgPCBiYjIueDEgKXsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmKCBiYjIueDIgPCBiYjEueDEgKXsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gY2FzZTogb25lIGJiIGFib3ZlIG90aGVyXG4gIGlmKCBiYjEueTIgPCBiYjIueTEgKXsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmKCBiYjIueTIgPCBiYjEueTEgKXsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gY2FzZTogb25lIGJiIGJlbG93IG90aGVyXG4gIGlmKCBiYjEueTEgPiBiYjIueTIgKXsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmKCBiYjIueTEgPiBiYjEueTIgKXsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gb3RoZXJ3aXNlLCBtdXN0IGhhdmUgc29tZSBvdmVybGFwXG4gIHJldHVybiB0cnVlO1xufTtcblxuY29uc3QgZXhwYW5kQm91bmRzID0gKGJiLCBwYWRkaW5nKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDE6IGJiLngxIC0gcGFkZGluZyxcbiAgICB4MjogYmIueDIgKyBwYWRkaW5nLFxuICAgIHc6IGJiLncgKyAyICogcGFkZGluZyxcbiAgICB5MTogYmIueTEgLSBwYWRkaW5nLFxuICAgIHkyOiBiYi55MiArIHBhZGRpbmcsXG4gICAgaDogYmIuaCArIDIgKiBwYWRkaW5nXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNQYXJlbnQsIGlzQ2hpbGQsXG4gIGdldEJvdW5kc1R1cGxlLCBib3VuZHNPdmVybGFwLCBnZXRCb3VuZHMsIGV4cGFuZEJvdW5kcyxcbiAgcmVtb3ZlUGFyZW50LCBzZXRQYXJlbnQsIGZyZXNoUmVmXG4gfTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC91dGlsLmpzIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZSgnLi4vYXNzaWduJyk7XG5jb25zdCBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoJy4vdG9nZ2xlJyk7XG5jb25zdCBsaXN0ZW5lcnMgPSByZXF1aXJlKCcuL2xpc3RlbmVycycpO1xuY29uc3QgcHJldmlldyA9IHJlcXVpcmUoJy4vcHJldmlldycpO1xuY29uc3Qgc3BsaXQgPSByZXF1aXJlKCcuL3NwbGl0Jyk7XG5jb25zdCBqb2luID0gcmVxdWlyZSgnLi9qb2luJyk7XG5cbmNvbnN0IERyYWdBbmREcm9wID0gZnVuY3Rpb24oY3ksIG9wdGlvbnMpe1xuICB0aGlzLmN5ID0gY3k7XG4gIHRoaXMub3B0aW9ucyA9IGFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG59O1xuXG5jb25zdCBkZXN0cm95ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5yZW1vdmVMaXN0ZW5lcnMoKTtcbn07XG5cbltcbiAgdG9nZ2xlLFxuICBsaXN0ZW5lcnMsXG4gIHByZXZpZXcsXG4gIHNwbGl0LFxuICBqb2luLFxuICB7IGRlc3Ryb3kgfVxuXS5mb3JFYWNoKGRlZiA9PiB7XG4gIGFzc2lnbihEcmFnQW5kRHJvcC5wcm90b3R5cGUsIGRlZik7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgbGV0IGN5ID0gdGhpcztcblxuICByZXR1cm4gbmV3IERyYWdBbmREcm9wKGN5LCBvcHRpb25zKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9pbmRleC5qcyIsIi8vIFNpbXBsZSwgaW50ZXJuYWwgT2JqZWN0LmFzc2lnbigpIHBvbHlmaWxsIGZvciBvcHRpb25zIG9iamVjdHMgZXRjLlxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gIT0gbnVsbCA/IE9iamVjdC5hc3NpZ24uYmluZCggT2JqZWN0ICkgOiBmdW5jdGlvbiggdGd0LCAuLi5zcmNzICl7XG4gIHNyY3MuZmlsdGVyKHNyYyA9PiBzcmMgIT0gbnVsbCkuZm9yRWFjaCggc3JjID0+IHtcbiAgICBPYmplY3Qua2V5cyggc3JjICkuZm9yRWFjaCggayA9PiB0Z3Rba10gPSBzcmNba10gKTtcbiAgfSApO1xuXG4gIHJldHVybiB0Z3Q7XG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hc3NpZ24uanMiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZHJvcFRhcmdldDogbm9kZSA9PiB0cnVlLCAvLyBmaWx0ZXIgZnVuY3Rpb24gdG8gc3BlY2lmeSB3aGljaCBub2RlcyBhcmUgdmFsaWQgZHJvcCB0YXJnZXRzXG4gIGdyYWJiZWROb2RlOiBub2RlID0+IHRydWUsIC8vIGZpbHRlciBmdW5jdGlvbiB0byBzcGVjaWZ5IHdoaWNoIG5vZGVzIGFyZSB2YWxpZCB0byBncmFiIGFuZCBkcm9wIGludG8gb3RoZXIgbm9kZXNcbiAgbmV3UGFyZW50Tm9kZTogKGdyYWJiZWROb2RlLCBkcm9wVGFyZ2V0KSA9PiAoe30pLCAvLyBzcGVjaWZpZXMgZWxlbWVudCBqc29uIGZvciBwYXJlbnQgbm9kZXMgYWRkZWQgYnkgZHJvcHBpbmcgYW4gb3JwaGFuIG5vZGUgb24gYW5vdGhlciBvcnBoYW5cbiAgbmV3Sm9pblBhcmVudE5vZGU6IChqb2luZWROb2RlcykgPT4gKHt9KSwgLy8gc3BlY2lmaWVzIGVsZW1lbnQganNvbiBmb3IgcGFyZW50IG5vZGVzIGFkZGVkIGJ5IGNhbGxzIHRvIGpvaW4oam9pbmVkTm9kZXMpXG4gIHByZXZpZXc6IHRydWUsIC8vIHdoZXRoZXIgdG8gYWRkIGEgcHJldmlldyBub2RlIChvbiBvdmVyKSB0byBzaW11bGF0ZSB0aGUgcmVzdWx0YW50IGNvbXBvdW5kIChvbiBkcm9wKVxuICB0YXBob2xkVG9TcGxpdDogdHJ1ZSwgLy8gd2hldGhlciB0byBwZXJmb3JtIGEgc3BsaXQgb24gYSBub2RlIG9uIHRhcGhvbGRcbiAgdGhyZXNob2xkOiAxMCwgLy8gYWRkcyBhIHBhZGRpbmcgdG8gdGhlIGRyb3AgdGFyZ2V0IGFyZWEgdG8gbWFrZSBkcm9wcGluZyBlYXNpZXJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AvZGVmYXVsdHMuanMiLCJjb25zdCB7IGlzUGFyZW50IH0gPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuY29uc3Qgam9pbiA9IGZ1bmN0aW9uKG5vZGVzKXtcbiAgY29uc3QgeyBvcHRpb25zLCBjeSB9ID0gdGhpcztcbiAgY29uc3QgcGFyZW50ID0gbm9kZXMuZmlsdGVyKGlzUGFyZW50KTtcbiAgY29uc3Qgbm9uUGFyZW50cyA9IG5vZGVzLm5vdChwYXJlbnQpO1xuXG4gIGlmKCBwYXJlbnQubGVuZ3RoID4gMSApe1xuICAgIGNvbnNvbGUud2FybihgQ2FuIG5vdCBqb2luIHdpdGggbW9yZSB0aGFuIG9uZSBwYXJlbnQgc3BlY2lmaWVkLiAgQmFpbGluZyBvdXQgb2Ygam9pbi4uLmApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiggcGFyZW50Lm5vbmVtcHR5KCkgKXsgLy8gcHV0IGFsbCBub24gcGFyZW50cyBpbnRvIHBhcmVudFxuICAgIG5vblBhcmVudHMuZmlsdGVyKG4gPT4gIXBhcmVudC5zYW1lKG4ucGFyZW50KCkpKS5tb3ZlKHsgcGFyZW50OiBwYXJlbnQuaWQoKSB9KTtcbiAgfSBlbHNlIHsgLy8gcHV0IGFsbCBjaGlsZHJlbiBpbiBhIG5ldyBwYXJlbnQgbm9kZVxuICAgIGNvbnN0IG5ld1BhcmVudCA9IGN5LmFkZCggb3B0aW9ucy5uZXdKb2luUGFyZW50Tm9kZShub25QYXJlbnRzKSApO1xuXG4gICAgbm9uUGFyZW50cy5tb3ZlKHsgcGFyZW50OiBuZXdQYXJlbnQuaWQoKSB9KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7IGpvaW4gfTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9qb2luLmpzIiwiY29uc3Qge1xuICBpc1BhcmVudCwgaXNDaGlsZCxcbiAgZ2V0Qm91bmRzLCBnZXRCb3VuZHNUdXBsZSwgYm91bmRzT3ZlcmxhcCwgZXhwYW5kQm91bmRzLFxuICBzZXRQYXJlbnQsIGZyZXNoUmVmXG59ID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IGFkZExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjayl7XG4gIHRoaXMubGlzdGVuZXJzLnB1c2goeyBldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrIH0pO1xuXG4gIGlmKCBzZWxlY3RvciA9PSBudWxsICl7XG4gICAgdGhpcy5jeS5vbihldmVudCwgY2FsbGJhY2spO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuY3kub24oZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjayk7XG4gIH1cbn07XG5cbmNvbnN0IGFkZExpc3RlbmVycyA9IGZ1bmN0aW9uKCl7XG4gIGNvbnN0IHsgb3B0aW9ucywgY3kgfSA9IHRoaXM7XG5cbiAgdGhpcy5hZGRMaXN0ZW5lcignZ3JhYicsICdub2RlJywgZSA9PiB7XG4gICAgY29uc3Qgbm9kZSA9IGUudGFyZ2V0O1xuXG4gICAgaWYoXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgICB8fCBpc1BhcmVudChub2RlKSB8fCBpc0NoaWxkKG5vZGUpXG4gICAgICB8fCAobm9kZS5zZWxlY3RlZCgpICYmIGN5LmVsZW1lbnRzKCdub2RlOnNlbGVjdGVkJykubGVuZ3RoID4gMSkgLy8gZHJhZ2dpbmcgbXVsdGlwbGUgbm9kZXMgbm90IGFsbG93ZWRcbiAgICAgIHx8ICFvcHRpb25zLmdyYWJiZWROb2RlKG5vZGUpXG4gICAgKXsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLmluR2VzdHVyZSA9IHRydWU7XG4gICAgdGhpcy5ncmFiYmVkTm9kZSA9IG5vZGU7XG4gICAgdGhpcy5ib3VuZHNUdXBsZXMgPSBjeS5ub2RlcyhvcHRpb25zLmRyb3BUYXJnZXQpLm5vdChub2RlKS5tYXAoZ2V0Qm91bmRzVHVwbGUpO1xuICAgIHRoaXMuZHJvcFRhcmdldCA9IGN5LmNvbGxlY3Rpb24oKTtcbiAgfSk7XG5cbiAgdGhpcy5hZGRMaXN0ZW5lcignZHJhZycsICdub2RlJywgKCkgPT4ge1xuICAgIGlmKCAhdGhpcy5pbkdlc3R1cmUgfHwgIXRoaXMuZW5hYmxlZCApeyByZXR1cm47IH1cblxuICAgIGN5LnN0YXJ0QmF0Y2goKTtcbiAgICBjb25zdCBiYiA9IGV4cGFuZEJvdW5kcyggZ2V0Qm91bmRzKHRoaXMuZ3JhYmJlZE5vZGUpLCBvcHRpb25zLnRocmVzaG9sZCApO1xuICAgIGNvbnN0IG92ZXJsYXBwaW5nTm9kZXMgPSB0aGlzLmJvdW5kc1R1cGxlcy5maWx0ZXIodCA9PiBib3VuZHNPdmVybGFwKGJiLCB0LmJiKSkubWFwKHQgPT4gdC5ub2RlKTtcblxuICAgIHRoaXMuZHJvcFRhcmdldC5yZW1vdmVDbGFzcygnY2RuZC1kcm9wLXRhcmdldCcpO1xuXG4gICAgaWYoIG92ZXJsYXBwaW5nTm9kZXMubGVuZ3RoID4gMCApe1xuICAgICAgY29uc3Qgb3ZlcmxhcHBpbmdQYXJlbnRzID0gb3ZlcmxhcHBpbmdOb2Rlcy5maWx0ZXIoaXNQYXJlbnQpO1xuXG4gICAgICB0aGlzLmRyb3BUYXJnZXQgPSBvdmVybGFwcGluZ1BhcmVudHNbMF0gfHwgb3ZlcmxhcHBpbmdOb2Rlc1swXTsgLy8gVE9ETyBzZWxlY3QgcGFydGljdWxhciBvbmUgYnkgbWV0cmljXG5cbiAgICAgIHRoaXMuYWRkUHJldmlldygpO1xuICAgICAgdGhpcy5yZXNpemVQcmV2aWV3KCk7XG5cbiAgICAgIHRoaXMuZHJvcFRhcmdldC5hZGRDbGFzcygnY2RuZC1kcm9wLXRhcmdldCcpO1xuXG4gICAgICB0aGlzLmdyYWJiZWROb2RlLmVtaXQoJ2NkbmRvdmVyJywgW3RoaXMuZHJvcFRhcmdldF0pO1xuICAgIH0gZWxzZSB7IC8vIG5vIG92ZXJsYXBwaW5nIG5vZGVzXG4gICAgICBpZiggdGhpcy5kcm9wVGFyZ2V0Lm5vbmVtcHR5KCkgKXtcbiAgICAgICAgdGhpcy5ncmFiYmVkTm9kZS5lbWl0KCdjZG5kb3V0JywgW3RoaXMuZHJvcFRhcmdldF0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbW92ZVByZXZpZXcoKTtcblxuICAgICAgdGhpcy5kcm9wVGFyZ2V0ID0gY3kuY29sbGVjdGlvbigpO1xuICAgIH1cblxuICAgIGN5LmVuZEJhdGNoKCk7XG4gIH0pO1xuXG4gIHRoaXMuYWRkTGlzdGVuZXIoJ2ZyZWUnLCAnbm9kZScsICgpID0+IHtcbiAgICBpZiggIXRoaXMuaW5HZXN0dXJlICl7IHJldHVybjsgfVxuXG4gICAgY3kuc3RhcnRCYXRjaCgpO1xuXG4gICAgdGhpcy5kcm9wVGFyZ2V0LnJlbW92ZUNsYXNzKCdjZG5kLWRyb3AtdGFyZ2V0Jyk7XG5cbiAgICB0aGlzLnJlbW92ZVByZXZpZXcoKTtcblxuICAgIGlmKCB0aGlzLmRyb3BUYXJnZXQubm9uZW1wdHkoKSApe1xuICAgICAgdGhpcy5kcm9wVGFyZ2V0LnJlbW92ZUNsYXNzKCdjZG5kLWRyb3AtdGFyZ2V0Jyk7XG5cbiAgICAgIGlmKCB0aGlzLmRyb3BUYXJnZXQuaXNQYXJlbnQoKSApe1xuICAgICAgICBzZXRQYXJlbnQodGhpcy5ncmFiYmVkTm9kZSwgdGhpcy5kcm9wVGFyZ2V0KTtcblxuICAgICAgICB0aGlzLmdyYWJiZWROb2RlID0gZnJlc2hSZWYodGhpcy5ncmFiYmVkTm9kZSk7XG5cbiAgICAgICAgdGhpcy5ncmFiYmVkTm9kZS5lbWl0KCdjZG5kZHJvcCcsIFt0aGlzLmRyb3BUYXJnZXQsIHRoaXMuZHJvcFRhcmdldF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gY3kuYWRkKCBvcHRpb25zLm5ld1BhcmVudE5vZGUodGhpcy5ncmFiYmVkTm9kZSwgdGhpcy5kcm9wVGFyZ2V0KSApO1xuXG4gICAgICAgIHNldFBhcmVudCh0aGlzLmRyb3BUYXJnZXQsIHBhcmVudCk7XG4gICAgICAgIHNldFBhcmVudCh0aGlzLmdyYWJiZWROb2RlLCBwYXJlbnQpO1xuXG4gICAgICAgIHRoaXMuZHJvcFRhcmdldCA9IGZyZXNoUmVmKHRoaXMuZHJvcFRhcmdldCk7XG4gICAgICAgIHRoaXMuZ3JhYmJlZE5vZGUgPSBmcmVzaFJlZih0aGlzLmdyYWJiZWROb2RlKTtcblxuICAgICAgICB0aGlzLmdyYWJiZWROb2RlLmVtaXQoJ2NkbmRkcm9wJywgW3BhcmVudCwgdGhpcy5kcm9wVGFyZ2V0XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kcm9wVGFyZ2V0ID0gY3kuY29sbGVjdGlvbigpO1xuICAgIHRoaXMuaW5HZXN0dXJlID0gZmFsc2U7XG5cbiAgICBjeS5lbmRCYXRjaCgpO1xuICB9KTtcblxuICB0aGlzLmFkZExpc3RlbmVyKCd0YXBob2xkJywgJ25vZGUnLCBlID0+IHtcbiAgICBpZiggdGhpcy5pbkdlc3R1cmUgKXsgcmV0dXJuOyB9IC8vIHNob3VsZG4ndCBiZSBwb3NzaWJsZSwgYnV0IGp1c3QgaW4gY2FzZS4uLlxuXG4gICAgY29uc3Qgbm9kZSA9IGUudGFyZ2V0O1xuXG4gICAgaWYoIG9wdGlvbnMudGFwaG9sZFRvU3BsaXQgKXtcbiAgICAgIHRoaXMuc3BsaXQobm9kZSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmNvbnN0IHJlbW92ZUxpc3RlbmVycyA9IGZ1bmN0aW9uKCl7XG4gIGNvbnN0IHsgY3kgfSA9IHRoaXM7XG5cbiAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChsaXMgPT4ge1xuICAgIGNvbnN0IHsgZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjayB9ID0gbGlzO1xuXG4gICAgaWYoIHNlbGVjdG9yID09IG51bGwgKXtcbiAgICAgIGN5LnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN5LnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0geyBhZGRMaXN0ZW5lciwgYWRkTGlzdGVuZXJzLCByZW1vdmVMaXN0ZW5lcnMgfTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9saXN0ZW5lcnMuanMiLCJjb25zdCB7IGdldEJvdW5kcyB9ID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IGFkZFByZXZpZXcgPSBmdW5jdGlvbigpe1xuICBpZiggdGhpcy5wcmV2aWV3ICE9IG51bGwgJiYgdGhpcy5wcmV2aWV3Lm5vbmVtcHR5KCkgKXtcbiAgICByZXR1cm4gdGhpcy5wcmV2aWV3OyAvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgaGF2ZSBkdXBsaWNhdGVzXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wcmV2aWV3ID0gdGhpcy5jeS5hZGQoe1xuICAgICAgZ3JvdXA6ICdub2RlcycsXG4gICAgICBjbGFzc2VzOiAnY2RuZC1wcmV2aWV3J1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMucHJldmlldztcbiAgfVxufTtcblxuY29uc3QgY2FuVXBkYXRlUHJldmlldyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0aGlzLm9wdGlvbnMucHJldmlldyAmJiB0aGlzLmRyb3BUYXJnZXQgIT0gbnVsbCAmJiB0aGlzLnByZXZpZXcgIT0gbnVsbCAmJiB0aGlzLnByZXZpZXcubm9uZW1wdHkoKTtcbn07XG5cbmNvbnN0IHJlc2l6ZVByZXZpZXcgPSBmdW5jdGlvbigpe1xuICBpZiggIXRoaXMuY2FuVXBkYXRlUHJldmlldygpICl7IHJldHVybjsgfVxuXG4gIGNvbnN0IHsgZHJvcFRhcmdldCwgZ3JhYmJlZE5vZGUsIHByZXZpZXcgfSA9IHRoaXM7XG5cbiAgbGV0IGJiO1xuXG4gIGlmKCBkcm9wVGFyZ2V0LmlzUGFyZW50KCkgKXtcbiAgICBkcm9wVGFyZ2V0LmFkZENsYXNzKCdjZG5kLWhpZGRlbi1wYXJlbnQnKTtcblxuICAgIGJiID0gZ2V0Qm91bmRzKCBkcm9wVGFyZ2V0LmNoaWxkcmVuKCkudW5pb24oZ3JhYmJlZE5vZGUpICk7XG4gIH0gZWxzZSB7XG4gICAgYmIgPSBnZXRCb3VuZHMoIGRyb3BUYXJnZXQudW5pb24oZ3JhYmJlZE5vZGUpICk7XG4gIH1cblxuICBwcmV2aWV3LnN0eWxlKHtcbiAgICAnd2lkdGgnOiBiYi53LFxuICAgICdoZWlnaHQnOiBiYi5oXG4gIH0pLnBvc2l0aW9uKHtcbiAgICB4OiAoYmIueDEgKyBiYi54MikvMixcbiAgICB5OiAoYmIueTEgKyBiYi55MikvMlxuICB9KTtcbn07XG5cbmNvbnN0IHJlbW92ZVByZXZpZXcgPSBmdW5jdGlvbigpe1xuICBpZiggIXRoaXMuY2FuVXBkYXRlUHJldmlldygpICl7IHJldHVybjsgfVxuXG4gIGNvbnN0IHsgZHJvcFRhcmdldCwgcHJldmlldyB9ID0gdGhpcztcblxuICBkcm9wVGFyZ2V0LnJlbW92ZUNsYXNzKCdjZG5kLWhpZGRlbi1wYXJlbnQnKTtcblxuICBwcmV2aWV3LnJlbW92ZSgpO1xuXG4gIHRoaXMucHJldmlldyA9IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHsgYWRkUHJldmlldywgY2FuVXBkYXRlUHJldmlldywgcmVzaXplUHJldmlldywgcmVtb3ZlUHJldmlldyB9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL3ByZXZpZXcuanMiLCJjb25zdCB7IGlzQ2hpbGQsIGlzUGFyZW50LCBmcmVzaFJlZiB9ID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IHNwbGl0ID0gZnVuY3Rpb24oZWxlcyl7XG4gIGNvbnN0IGN5ID0gdGhpcy5jeTtcblxuICBjeS5iYXRjaCgoKSA9PiB7XG4gICAgY29uc3Qgbm9kZXMgPSBlbGVzLm5vZGVzKCk7XG4gICAgY29uc3QgcGFyZW50cyA9IG5vZGVzLmZpbHRlcihpc1BhcmVudCk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2Rlcy5maWx0ZXIoaXNDaGlsZCk7XG4gICAgY29uc3QgdG9Nb3ZlID0gcGFyZW50cy5jaGlsZHJlbigpLmFkZChjaGlsZHJlbik7XG4gICAgY29uc3QgZW1wdHlQYXJlbnRzID0gY2hpbGRyZW4ucGFyZW50KCkuZmlsdGVyKG4gPT4gdG9Nb3ZlLmNvbnRhaW5zKG4uY2hpbGRyZW4oKSkpO1xuICAgIGNvbnN0IHRvUmVtb3ZlID0gcGFyZW50cy5hZGQoZW1wdHlQYXJlbnRzKTtcblxuICAgIHRvTW92ZS5tb3ZlKHsgcGFyZW50OiBudWxsIH0pO1xuXG4gICAgdG9SZW1vdmUubWFwKGZyZXNoUmVmKS5mb3JFYWNoKG4gPT4gbi5yZW1vdmUoKSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7IHNwbGl0IH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3Avc3BsaXQuanMiLCJmdW5jdGlvbiBlbmFibGUoKXtcbiAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZGlzYWJsZSgpe1xuICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IGVuYWJsZSwgZGlzYWJsZSB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AvdG9nZ2xlLmpzIiwiY29uc3QgaW1wbCA9IHJlcXVpcmUoJy4vY29tcG91bmQtZHJhZy1hbmQtZHJvcCcpO1xuXG4vLyByZWdpc3RlcnMgdGhlIGV4dGVuc2lvbiBvbiBhIGN5dG9zY2FwZSBsaWIgcmVmXG5sZXQgcmVnaXN0ZXIgPSBmdW5jdGlvbiggY3l0b3NjYXBlICl7XG4gIGlmKCAhY3l0b3NjYXBlICl7IHJldHVybjsgfSAvLyBjYW4ndCByZWdpc3RlciBpZiBjeXRvc2NhcGUgdW5zcGVjaWZpZWRcblxuICBjeXRvc2NhcGUoICdjb3JlJywgJ2NvbXBvdW5kRHJhZ0FuZERyb3AnLCBpbXBsICk7IC8vIHJlZ2lzdGVyIHdpdGggY3l0b3NjYXBlLmpzXG59O1xuXG5pZiggdHlwZW9mIGN5dG9zY2FwZSAhPT0gJ3VuZGVmaW5lZCcgKXsgLy8gZXhwb3NlIHRvIGdsb2JhbCBjeXRvc2NhcGUgKGkuZS4gd2luZG93LmN5dG9zY2FwZSlcbiAgcmVnaXN0ZXIoIGN5dG9zY2FwZSApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==