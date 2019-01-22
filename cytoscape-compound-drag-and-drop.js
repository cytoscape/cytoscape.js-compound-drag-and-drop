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

module.exports = {
  isParent: isParent, isChild: isChild,
  getBoundsTuple: getBoundsTuple, boundsOverlap: boundsOverlap, getBounds: getBounds,
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
  preview: true // whether to add a preview node (on over) to simulate the resultant compound (on drop)
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var join = function join(nodes) {
  // TODO
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

    if (!_this.enabled || isParent(node) || isChild(node) || node.selected() && cy.elements('node:selected').length > 1) {
      return;
    }

    _this.inGesture = true;
    _this.grabbedNode = node;
    _this.boundsTuples = cy.nodes().not(node).map(getBoundsTuple);
    _this.dropTarget = cy.collection();
  });

  this.addListener('drag', 'node', function () {
    if (!_this.inGesture || !_this.enabled) {
      return;
    }

    cy.startBatch();
    var bb = getBounds(_this.grabbedNode);
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
        var parent = cy.add({ group: 'nodes' }); // TODO parameterise

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5YTY2YzJmYzE2YWQzYzUwOTQ1NyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC91dGlsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3Avam9pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9saXN0ZW5lcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AvcHJldmlldy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9zcGxpdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC90b2dnbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImlzUGFyZW50IiwibiIsImlzQ2hpbGQiLCJnZXRCb3VuZHMiLCJib3VuZGluZ0JveCIsImluY2x1ZGVPdmVybGF5cyIsImdldEJvdW5kc1R1cGxlIiwibm9kZSIsImJiIiwicmVtb3ZlUGFyZW50IiwibW92ZSIsInBhcmVudCIsInNldFBhcmVudCIsImlkIiwiZnJlc2hSZWYiLCJjeSIsImdldEVsZW1lbnRCeUlkIiwiYm91bmRzT3ZlcmxhcCIsImJiMSIsImJiMiIsIngxIiwieDIiLCJ5MiIsInkxIiwibW9kdWxlIiwiZXhwb3J0cyIsImFzc2lnbiIsInJlcXVpcmUiLCJkZWZhdWx0cyIsInRvZ2dsZSIsImxpc3RlbmVycyIsInByZXZpZXciLCJzcGxpdCIsImpvaW4iLCJEcmFnQW5kRHJvcCIsIm9wdGlvbnMiLCJlbmFibGVkIiwiYWRkTGlzdGVuZXJzIiwiZGVzdHJveSIsInJlbW92ZUxpc3RlbmVycyIsImZvckVhY2giLCJwcm90b3R5cGUiLCJkZWYiLCJPYmplY3QiLCJiaW5kIiwidGd0Iiwic3JjcyIsImZpbHRlciIsInNyYyIsImtleXMiLCJrIiwibm9kZXMiLCJhZGRMaXN0ZW5lciIsImV2ZW50Iiwic2VsZWN0b3IiLCJjYWxsYmFjayIsInB1c2giLCJvbiIsImUiLCJ0YXJnZXQiLCJzZWxlY3RlZCIsImVsZW1lbnRzIiwibGVuZ3RoIiwiaW5HZXN0dXJlIiwiZ3JhYmJlZE5vZGUiLCJib3VuZHNUdXBsZXMiLCJub3QiLCJtYXAiLCJkcm9wVGFyZ2V0IiwiY29sbGVjdGlvbiIsInN0YXJ0QmF0Y2giLCJvdmVybGFwcGluZ05vZGVzIiwidCIsInJlbW92ZUNsYXNzIiwib3ZlcmxhcHBpbmdQYXJlbnRzIiwiYWRkUHJldmlldyIsInJlc2l6ZVByZXZpZXciLCJhZGRDbGFzcyIsImVtaXQiLCJub25lbXB0eSIsInJlbW92ZVByZXZpZXciLCJlbmRCYXRjaCIsImFkZCIsImdyb3VwIiwibGlzIiwicmVtb3ZlTGlzdGVuZXIiLCJjbGFzc2VzIiwiY2FuVXBkYXRlUHJldmlldyIsImNoaWxkcmVuIiwidW5pb24iLCJzdHlsZSIsInciLCJoIiwicG9zaXRpb24iLCJ4IiwieSIsInJlbW92ZSIsImVsZXMiLCJiYXRjaCIsInBhcmVudHMiLCJ0b01vdmUiLCJlbXB0eVBhcmVudHMiLCJjb250YWlucyIsInRvUmVtb3ZlIiwiZW5hYmxlIiwiZGlzYWJsZSIsImltcGwiLCJyZWdpc3RlciIsImN5dG9zY2FwZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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ZSxJQUFmO0FBQ0Q7O0FBRUQsU0FBU3FFLE9BQVQsR0FBa0I7QUFDaEIsT0FBS3JFLE9BQUwsR0FBZSxLQUFmO0FBQ0Q7O0FBRURaLE9BQU9DLE9BQVAsR0FBaUIsRUFBRStFLGNBQUYsRUFBVUMsZ0JBQVYsRUFBakIsQzs7Ozs7Ozs7O0FDUkEsSUFBTUMsT0FBTy9FLG1CQUFPQSxDQUFDLENBQVIsQ0FBYjs7QUFFQTtBQUNBLElBQUlnRixXQUFXLFNBQVhBLFFBQVcsQ0FBVUMsU0FBVixFQUFxQjtBQUNsQyxNQUFJLENBQUNBLFNBQUwsRUFBZ0I7QUFBRTtBQUFTLEdBRE8sQ0FDTjs7QUFFNUJBLFlBQVcsTUFBWCxFQUFtQixxQkFBbkIsRUFBMENGLElBQTFDLEVBSGtDLENBR2dCO0FBQ25ELENBSkQ7O0FBTUEsSUFBSSxPQUFPRSxTQUFQLEtBQXFCLFdBQXpCLEVBQXNDO0FBQUU7QUFDdENELFdBQVVDLFNBQVY7QUFDRDs7QUFFRHBGLE9BQU9DLE9BQVAsR0FBaUJrRixRQUFqQixDIiwiZmlsZSI6ImN5dG9zY2FwZS1jb21wb3VuZC1kcmFnLWFuZC1kcm9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiY3l0b3NjYXBlQ29tcG91bmREcmFnQW5kRHJvcFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJjeXRvc2NhcGVDb21wb3VuZERyYWdBbmREcm9wXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gOSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOWE2NmMyZmMxNmFkM2M1MDk0NTciLCJjb25zdCBpc1BhcmVudCA9IG4gPT4gbi5pc1BhcmVudCgpO1xuY29uc3QgaXNDaGlsZCA9IG4gPT4gbi5pc0NoaWxkKCk7XG5cbmNvbnN0IGdldEJvdW5kcyA9IG4gPT4gbi5ib3VuZGluZ0JveCh7IGluY2x1ZGVPdmVybGF5czogZmFsc2UgfSk7XG5jb25zdCBnZXRCb3VuZHNUdXBsZSA9IG4gPT4gKHsgbm9kZTogbiwgYmI6IGdldEJvdW5kcyhuKSB9KTtcblxuY29uc3QgcmVtb3ZlUGFyZW50ID0gbiA9PiBuLm1vdmUoeyBwYXJlbnQ6IG51bGwgfSk7XG5jb25zdCBzZXRQYXJlbnQgPSAobiwgcGFyZW50KSA9PiBuLm1vdmUoeyBwYXJlbnQ6IHBhcmVudC5pZCgpIH0pO1xuY29uc3QgZnJlc2hSZWYgPSBuID0+IG4uY3koKS5nZXRFbGVtZW50QnlJZChuLmlkKCkpO1xuXG5jb25zdCBib3VuZHNPdmVybGFwID0gKGJiMSwgYmIyKSA9PiB7XG4gIC8vIGNhc2U6IG9uZSBiYiB0byByaWdodCBvZiBvdGhlclxuICBpZiggYmIxLngxID4gYmIyLngyICl7IHJldHVybiBmYWxzZTsgfVxuICBpZiggYmIyLngxID4gYmIxLngyICl7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIGNhc2U6IG9uZSBiYiB0byBsZWZ0IG9mIG90aGVyXG4gIGlmKCBiYjEueDIgPCBiYjIueDEgKXsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmKCBiYjIueDIgPCBiYjEueDEgKXsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gY2FzZTogb25lIGJiIGFib3ZlIG90aGVyXG4gIGlmKCBiYjEueTIgPCBiYjIueTEgKXsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmKCBiYjIueTIgPCBiYjEueTEgKXsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gY2FzZTogb25lIGJiIGJlbG93IG90aGVyXG4gIGlmKCBiYjEueTEgPiBiYjIueTIgKXsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmKCBiYjIueTEgPiBiYjEueTIgKXsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gb3RoZXJ3aXNlLCBtdXN0IGhhdmUgc29tZSBvdmVybGFwXG4gIHJldHVybiB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzUGFyZW50LCBpc0NoaWxkLFxuICBnZXRCb3VuZHNUdXBsZSwgYm91bmRzT3ZlcmxhcCwgZ2V0Qm91bmRzLFxuICByZW1vdmVQYXJlbnQsIHNldFBhcmVudCwgZnJlc2hSZWZcbiB9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL3V0aWwuanMiLCJjb25zdCBhc3NpZ24gPSByZXF1aXJlKCcuLi9hc3NpZ24nKTtcbmNvbnN0IGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi90b2dnbGUnKTtcbmNvbnN0IGxpc3RlbmVycyA9IHJlcXVpcmUoJy4vbGlzdGVuZXJzJyk7XG5jb25zdCBwcmV2aWV3ID0gcmVxdWlyZSgnLi9wcmV2aWV3Jyk7XG5jb25zdCBzcGxpdCA9IHJlcXVpcmUoJy4vc3BsaXQnKTtcbmNvbnN0IGpvaW4gPSByZXF1aXJlKCcuL2pvaW4nKTtcblxuY29uc3QgRHJhZ0FuZERyb3AgPSBmdW5jdGlvbihjeSwgb3B0aW9ucyl7XG4gIHRoaXMuY3kgPSBjeTtcbiAgdGhpcy5vcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gIHRoaXMubGlzdGVuZXJzID0gW107XG4gIHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cbiAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbn07XG5cbmNvbnN0IGRlc3Ryb3kgPSBmdW5jdGlvbigpe1xuICB0aGlzLnJlbW92ZUxpc3RlbmVycygpO1xufTtcblxuW1xuICB0b2dnbGUsXG4gIGxpc3RlbmVycyxcbiAgcHJldmlldyxcbiAgc3BsaXQsXG4gIGpvaW4sXG4gIHsgZGVzdHJveSB9XG5dLmZvckVhY2goZGVmID0+IHtcbiAgYXNzaWduKERyYWdBbmREcm9wLnByb3RvdHlwZSwgZGVmKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICBsZXQgY3kgPSB0aGlzO1xuXG4gIHJldHVybiBuZXcgRHJhZ0FuZERyb3AoY3ksIG9wdGlvbnMpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2luZGV4LmpzIiwiLy8gU2ltcGxlLCBpbnRlcm5hbCBPYmplY3QuYXNzaWduKCkgcG9seWZpbGwgZm9yIG9wdGlvbnMgb2JqZWN0cyBldGMuXG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiAhPSBudWxsID8gT2JqZWN0LmFzc2lnbi5iaW5kKCBPYmplY3QgKSA6IGZ1bmN0aW9uKCB0Z3QsIC4uLnNyY3MgKXtcbiAgc3Jjcy5maWx0ZXIoc3JjID0+IHNyYyAhPSBudWxsKS5mb3JFYWNoKCBzcmMgPT4ge1xuICAgIE9iamVjdC5rZXlzKCBzcmMgKS5mb3JFYWNoKCBrID0+IHRndFtrXSA9IHNyY1trXSApO1xuICB9ICk7XG5cbiAgcmV0dXJuIHRndDtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Fzc2lnbi5qcyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwcmV2aWV3OiB0cnVlIC8vIHdoZXRoZXIgdG8gYWRkIGEgcHJldmlldyBub2RlIChvbiBvdmVyKSB0byBzaW11bGF0ZSB0aGUgcmVzdWx0YW50IGNvbXBvdW5kIChvbiBkcm9wKVxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9kZWZhdWx0cy5qcyIsImNvbnN0IGpvaW4gPSBmdW5jdGlvbihub2Rlcyl7XG4gIC8vIFRPRE9cbn07XG5cbm1vZHVsZS5leHBvcnRzID0geyBqb2luIH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3Avam9pbi5qcyIsImNvbnN0IHsgaXNQYXJlbnQsIGlzQ2hpbGQsIGdldEJvdW5kcywgZ2V0Qm91bmRzVHVwbGUsIGJvdW5kc092ZXJsYXAsIHNldFBhcmVudCwgZnJlc2hSZWYgfSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBhZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2spe1xuICB0aGlzLmxpc3RlbmVycy5wdXNoKHsgZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjayB9KTtcblxuICBpZiggc2VsZWN0b3IgPT0gbnVsbCApe1xuICAgIHRoaXMuY3kub24oZXZlbnQsIGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmN5Lm9uKGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2spO1xuICB9XG59O1xuXG5jb25zdCBhZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpe1xuICBjb25zdCB7IG9wdGlvbnMsIGN5IH0gPSB0aGlzO1xuXG4gIHRoaXMuYWRkTGlzdGVuZXIoJ2dyYWInLCAnbm9kZScsIGUgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSBlLnRhcmdldDtcblxuICAgIGlmKCAhdGhpcy5lbmFibGVkIHx8IGlzUGFyZW50KG5vZGUpIHx8IGlzQ2hpbGQobm9kZSkgfHwgKG5vZGUuc2VsZWN0ZWQoKSAmJiBjeS5lbGVtZW50cygnbm9kZTpzZWxlY3RlZCcpLmxlbmd0aCA+IDEpICl7IHJldHVybjsgfVxuXG4gICAgdGhpcy5pbkdlc3R1cmUgPSB0cnVlO1xuICAgIHRoaXMuZ3JhYmJlZE5vZGUgPSBub2RlO1xuICAgIHRoaXMuYm91bmRzVHVwbGVzID0gY3kubm9kZXMoKS5ub3Qobm9kZSkubWFwKGdldEJvdW5kc1R1cGxlKTtcbiAgICB0aGlzLmRyb3BUYXJnZXQgPSBjeS5jb2xsZWN0aW9uKCk7XG4gIH0pO1xuXG4gIHRoaXMuYWRkTGlzdGVuZXIoJ2RyYWcnLCAnbm9kZScsICgpID0+IHtcbiAgICBpZiggIXRoaXMuaW5HZXN0dXJlIHx8ICF0aGlzLmVuYWJsZWQgKXsgcmV0dXJuOyB9XG5cbiAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgY29uc3QgYmIgPSBnZXRCb3VuZHModGhpcy5ncmFiYmVkTm9kZSk7XG4gICAgY29uc3Qgb3ZlcmxhcHBpbmdOb2RlcyA9IHRoaXMuYm91bmRzVHVwbGVzLmZpbHRlcih0ID0+IGJvdW5kc092ZXJsYXAoYmIsIHQuYmIpKS5tYXAodCA9PiB0Lm5vZGUpO1xuXG4gICAgdGhpcy5kcm9wVGFyZ2V0LnJlbW92ZUNsYXNzKCdjZG5kLWRyb3AtdGFyZ2V0Jyk7XG5cbiAgICBpZiggb3ZlcmxhcHBpbmdOb2Rlcy5sZW5ndGggPiAwICl7XG4gICAgICBjb25zdCBvdmVybGFwcGluZ1BhcmVudHMgPSBvdmVybGFwcGluZ05vZGVzLmZpbHRlcihpc1BhcmVudCk7XG5cbiAgICAgIHRoaXMuZHJvcFRhcmdldCA9IG92ZXJsYXBwaW5nUGFyZW50c1swXSB8fCBvdmVybGFwcGluZ05vZGVzWzBdOyAvLyBUT0RPIHNlbGVjdCBwYXJ0aWN1bGFyIG9uZSBieSBtZXRyaWNcblxuICAgICAgdGhpcy5hZGRQcmV2aWV3KCk7XG4gICAgICB0aGlzLnJlc2l6ZVByZXZpZXcoKTtcblxuICAgICAgdGhpcy5kcm9wVGFyZ2V0LmFkZENsYXNzKCdjZG5kLWRyb3AtdGFyZ2V0Jyk7XG5cbiAgICAgIHRoaXMuZ3JhYmJlZE5vZGUuZW1pdCgnY2RuZG92ZXInLCBbdGhpcy5kcm9wVGFyZ2V0XSk7XG4gICAgfSBlbHNlIHsgLy8gbm8gb3ZlcmxhcHBpbmcgbm9kZXNcbiAgICAgIGlmKCB0aGlzLmRyb3BUYXJnZXQubm9uZW1wdHkoKSApe1xuICAgICAgICB0aGlzLmdyYWJiZWROb2RlLmVtaXQoJ2NkbmRvdXQnLCBbdGhpcy5kcm9wVGFyZ2V0XSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVtb3ZlUHJldmlldygpO1xuXG4gICAgICB0aGlzLmRyb3BUYXJnZXQgPSBjeS5jb2xsZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgY3kuZW5kQmF0Y2goKTtcbiAgfSk7XG5cbiAgdGhpcy5hZGRMaXN0ZW5lcignZnJlZScsICdub2RlJywgKCkgPT4ge1xuICAgIGlmKCAhdGhpcy5pbkdlc3R1cmUgKXsgcmV0dXJuOyB9XG5cbiAgICBjeS5zdGFydEJhdGNoKCk7XG5cbiAgICB0aGlzLmRyb3BUYXJnZXQucmVtb3ZlQ2xhc3MoJ2NkbmQtZHJvcC10YXJnZXQnKTtcblxuICAgIHRoaXMucmVtb3ZlUHJldmlldygpO1xuXG4gICAgaWYoIHRoaXMuZHJvcFRhcmdldC5ub25lbXB0eSgpICl7XG4gICAgICB0aGlzLmRyb3BUYXJnZXQucmVtb3ZlQ2xhc3MoJ2NkbmQtZHJvcC10YXJnZXQnKTtcblxuICAgICAgaWYoIHRoaXMuZHJvcFRhcmdldC5pc1BhcmVudCgpICl7XG4gICAgICAgIHNldFBhcmVudCh0aGlzLmdyYWJiZWROb2RlLCB0aGlzLmRyb3BUYXJnZXQpO1xuXG4gICAgICAgIHRoaXMuZ3JhYmJlZE5vZGUgPSBmcmVzaFJlZih0aGlzLmdyYWJiZWROb2RlKTtcblxuICAgICAgICB0aGlzLmdyYWJiZWROb2RlLmVtaXQoJ2NkbmRkcm9wJywgW3RoaXMuZHJvcFRhcmdldCwgdGhpcy5kcm9wVGFyZ2V0XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSBjeS5hZGQoeyBncm91cDogJ25vZGVzJyB9KTsgLy8gVE9ETyBwYXJhbWV0ZXJpc2VcblxuICAgICAgICBzZXRQYXJlbnQodGhpcy5kcm9wVGFyZ2V0LCBwYXJlbnQpO1xuICAgICAgICBzZXRQYXJlbnQodGhpcy5ncmFiYmVkTm9kZSwgcGFyZW50KTtcblxuICAgICAgICB0aGlzLmRyb3BUYXJnZXQgPSBmcmVzaFJlZih0aGlzLmRyb3BUYXJnZXQpO1xuICAgICAgICB0aGlzLmdyYWJiZWROb2RlID0gZnJlc2hSZWYodGhpcy5ncmFiYmVkTm9kZSk7XG5cbiAgICAgICAgdGhpcy5ncmFiYmVkTm9kZS5lbWl0KCdjZG5kZHJvcCcsIFtwYXJlbnQsIHRoaXMuZHJvcFRhcmdldF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZHJvcFRhcmdldCA9IGN5LmNvbGxlY3Rpb24oKTtcbiAgICB0aGlzLmluR2VzdHVyZSA9IGZhbHNlO1xuXG4gICAgY3kuZW5kQmF0Y2goKTtcbiAgfSk7XG59O1xuXG5jb25zdCByZW1vdmVMaXN0ZW5lcnMgPSBmdW5jdGlvbigpe1xuICBjb25zdCB7IGN5IH0gPSB0aGlzO1xuXG4gIHRoaXMubGlzdGVuZXJzLmZvckVhY2gobGlzID0+IHtcbiAgICBjb25zdCB7IGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2sgfSA9IGxpcztcblxuICAgIGlmKCBzZWxlY3RvciA9PSBudWxsICl7XG4gICAgICBjeS5yZW1vdmVMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBjeS5yZW1vdmVMaXN0ZW5lcihldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0pO1xuXG4gIHRoaXMubGlzdGVuZXJzID0gW107XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHsgYWRkTGlzdGVuZXIsIGFkZExpc3RlbmVycywgcmVtb3ZlTGlzdGVuZXJzIH07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AvbGlzdGVuZXJzLmpzIiwiY29uc3QgeyBnZXRCb3VuZHMgfSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBhZGRQcmV2aWV3ID0gZnVuY3Rpb24oKXtcbiAgaWYoIHRoaXMucHJldmlldyAhPSBudWxsICYmIHRoaXMucHJldmlldy5ub25lbXB0eSgpICl7XG4gICAgcmV0dXJuIHRoaXMucHJldmlldzsgLy8gbWFrZSBzdXJlIHdlIGRvbid0IGhhdmUgZHVwbGljYXRlc1xuICB9IGVsc2Uge1xuICAgIHRoaXMucHJldmlldyA9IHRoaXMuY3kuYWRkKHtcbiAgICAgIGdyb3VwOiAnbm9kZXMnLFxuICAgICAgY2xhc3NlczogJ2NkbmQtcHJldmlldydcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLnByZXZpZXc7XG4gIH1cbn07XG5cbmNvbnN0IGNhblVwZGF0ZVByZXZpZXcgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gdGhpcy5vcHRpb25zLnByZXZpZXcgJiYgdGhpcy5kcm9wVGFyZ2V0ICE9IG51bGwgJiYgdGhpcy5wcmV2aWV3ICE9IG51bGwgJiYgdGhpcy5wcmV2aWV3Lm5vbmVtcHR5KCk7XG59O1xuXG5jb25zdCByZXNpemVQcmV2aWV3ID0gZnVuY3Rpb24oKXtcbiAgaWYoICF0aGlzLmNhblVwZGF0ZVByZXZpZXcoKSApeyByZXR1cm47IH1cblxuICBjb25zdCB7IGRyb3BUYXJnZXQsIGdyYWJiZWROb2RlLCBwcmV2aWV3IH0gPSB0aGlzO1xuXG4gIGxldCBiYjtcblxuICBpZiggZHJvcFRhcmdldC5pc1BhcmVudCgpICl7XG4gICAgZHJvcFRhcmdldC5hZGRDbGFzcygnY2RuZC1oaWRkZW4tcGFyZW50Jyk7XG5cbiAgICBiYiA9IGdldEJvdW5kcyggZHJvcFRhcmdldC5jaGlsZHJlbigpLnVuaW9uKGdyYWJiZWROb2RlKSApO1xuICB9IGVsc2Uge1xuICAgIGJiID0gZ2V0Qm91bmRzKCBkcm9wVGFyZ2V0LnVuaW9uKGdyYWJiZWROb2RlKSApO1xuICB9XG5cbiAgcHJldmlldy5zdHlsZSh7XG4gICAgJ3dpZHRoJzogYmIudyxcbiAgICAnaGVpZ2h0JzogYmIuaFxuICB9KS5wb3NpdGlvbih7XG4gICAgeDogKGJiLngxICsgYmIueDIpLzIsXG4gICAgeTogKGJiLnkxICsgYmIueTIpLzJcbiAgfSk7XG59O1xuXG5jb25zdCByZW1vdmVQcmV2aWV3ID0gZnVuY3Rpb24oKXtcbiAgaWYoICF0aGlzLmNhblVwZGF0ZVByZXZpZXcoKSApeyByZXR1cm47IH1cblxuICBjb25zdCB7IGRyb3BUYXJnZXQsIHByZXZpZXcgfSA9IHRoaXM7XG5cbiAgZHJvcFRhcmdldC5yZW1vdmVDbGFzcygnY2RuZC1oaWRkZW4tcGFyZW50Jyk7XG5cbiAgcHJldmlldy5yZW1vdmUoKTtcblxuICB0aGlzLnByZXZpZXcgPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7IGFkZFByZXZpZXcsIGNhblVwZGF0ZVByZXZpZXcsIHJlc2l6ZVByZXZpZXcsIHJlbW92ZVByZXZpZXcgfTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9wcmV2aWV3LmpzIiwiY29uc3QgeyBpc0NoaWxkLCBpc1BhcmVudCwgZnJlc2hSZWYgfSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBzcGxpdCA9IGZ1bmN0aW9uKGVsZXMpe1xuICBjb25zdCBjeSA9IHRoaXMuY3k7XG5cbiAgY3kuYmF0Y2goKCkgPT4ge1xuICAgIGNvbnN0IG5vZGVzID0gZWxlcy5ub2RlcygpO1xuICAgIGNvbnN0IHBhcmVudHMgPSBub2Rlcy5maWx0ZXIoaXNQYXJlbnQpO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZXMuZmlsdGVyKGlzQ2hpbGQpO1xuICAgIGNvbnN0IHRvTW92ZSA9IHBhcmVudHMuY2hpbGRyZW4oKS5hZGQoY2hpbGRyZW4pO1xuICAgIGNvbnN0IGVtcHR5UGFyZW50cyA9IGNoaWxkcmVuLnBhcmVudCgpLmZpbHRlcihuID0+IHRvTW92ZS5jb250YWlucyhuLmNoaWxkcmVuKCkpKTtcbiAgICBjb25zdCB0b1JlbW92ZSA9IHBhcmVudHMuYWRkKGVtcHR5UGFyZW50cyk7XG5cbiAgICB0b01vdmUubW92ZSh7IHBhcmVudDogbnVsbCB9KTtcblxuICAgIHRvUmVtb3ZlLm1hcChmcmVzaFJlZikuZm9yRWFjaChuID0+IG4ucmVtb3ZlKCkpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0geyBzcGxpdCB9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL3NwbGl0LmpzIiwiZnVuY3Rpb24gZW5hYmxlKCl7XG4gIHRoaXMuZW5hYmxlZCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGRpc2FibGUoKXtcbiAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBlbmFibGUsIGRpc2FibGUgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL3RvZ2dsZS5qcyIsImNvbnN0IGltcGwgPSByZXF1aXJlKCcuL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AnKTtcblxuLy8gcmVnaXN0ZXJzIHRoZSBleHRlbnNpb24gb24gYSBjeXRvc2NhcGUgbGliIHJlZlxubGV0IHJlZ2lzdGVyID0gZnVuY3Rpb24oIGN5dG9zY2FwZSApe1xuICBpZiggIWN5dG9zY2FwZSApeyByZXR1cm47IH0gLy8gY2FuJ3QgcmVnaXN0ZXIgaWYgY3l0b3NjYXBlIHVuc3BlY2lmaWVkXG5cbiAgY3l0b3NjYXBlKCAnY29yZScsICdjb21wb3VuZERyYWdBbmREcm9wJywgaW1wbCApOyAvLyByZWdpc3RlciB3aXRoIGN5dG9zY2FwZS5qc1xufTtcblxuaWYoIHR5cGVvZiBjeXRvc2NhcGUgIT09ICd1bmRlZmluZWQnICl7IC8vIGV4cG9zZSB0byBnbG9iYWwgY3l0b3NjYXBlIChpLmUuIHdpbmRvdy5jeXRvc2NhcGUpXG4gIHJlZ2lzdGVyKCBjeXRvc2NhcGUgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZWdpc3RlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=