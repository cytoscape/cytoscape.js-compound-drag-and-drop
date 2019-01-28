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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign = __webpack_require__(1);
var defaults = __webpack_require__(2);
var toggle = __webpack_require__(4);
var listeners = __webpack_require__(3);

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

[toggle, listeners, { destroy: destroy }].forEach(function (def) {
  assign(DragAndDrop.prototype, def);
});

module.exports = function (options) {
  var cy = this;

  return new DragAndDrop(cy, options);
};

/***/ }),
/* 1 */
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
/* 2 */
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
  newParentNode: function newParentNode(grabbedNode, dropSibling) {
    return {};
  }, // specifies element json for parent nodes added by dropping an orphan node on another orphan
  overThreshold: 10, // make dragging over a drop target easier by expanding the hit area by this amount on all sides
  outThreshold: 10 // make dragging out of a drop target a bit harder by expanding the hit area by this amount on all sides
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(5),
    isParent = _require.isParent,
    isChild = _require.isChild,
    isOnlyChild = _require.isOnlyChild,
    getBounds = _require.getBounds,
    getBoundsTuple = _require.getBoundsTuple,
    boundsOverlap = _require.boundsOverlap,
    expandBounds = _require.expandBounds,
    getBoundsCopy = _require.getBoundsCopy,
    setParent = _require.setParent,
    removeParent = _require.removeParent;

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
    var isMultiplySelected = function isMultiplySelected(n) {
      return n.selected() && cy.elements('node:selected').length > 1;
    };
    var canBeGrabbed = function canBeGrabbed(n) {
      return !isParent(n) && !isMultiplySelected(n) && options.grabbedNode(n);
    };
    var canBeDropTarget = function canBeDropTarget(n) {
      return !isChild(n) && !n.same(node) && options.dropTarget(n);
    };
    var canPullFromParent = function canPullFromParent(n) {
      return isChild(n);
    };

    if (!_this.enabled || !canBeGrabbed(node)) {
      return;
    }

    _this.inGesture = true;
    _this.grabbedNode = node;
    _this.boundsTuples = cy.nodes(canBeDropTarget).map(getBoundsTuple);
    _this.dropTarget = cy.collection();
    _this.dropSibling = cy.collection();

    if (canPullFromParent(node)) {
      _this.dropTarget = node.parent();
      _this.dropTargetBounds = getBoundsCopy(_this.dropTarget);
    }

    _this.grabbedNode.addClass('cdnd-grabbed-node');
    _this.dropTarget.addClass('cdnd-drop-target');

    node.emit('cdndgrab');
  });

  this.addListener('drag', 'node', function () {
    if (!_this.inGesture || !_this.enabled) {
      return;
    }

    if (_this.dropTarget.nonempty()) {
      // already in a parent
      var bb = expandBounds(getBounds(_this.grabbedNode), options.outThreshold);
      var parent = _this.dropTarget;
      var rmFromParent = !boundsOverlap(_this.dropTargetBounds, bb);
      var grabbedIsOnlyChild = isOnlyChild(_this.grabbedNode);

      if (rmFromParent) {
        removeParent(_this.grabbedNode);
        removeParent(_this.dropSibling);

        _this.dropTarget.removeClass('cdnd-drop-target');
        _this.dropSibling.removeClass('cdnd-drop-sibling');

        if (_this.dropSibling.nonempty() // remove extension-created parents on out
        || grabbedIsOnlyChild // remove empty parents
        ) {
            _this.dropTarget.remove();
          }

        // make sure the removal updates the bounds tuples properly
        for (var i = _this.boundsTuples.length - 1; i >= 0; i--) {
          var tuple = _this.boundsTuples[i];

          if (tuple.node.same(_this.dropTarget)) {
            if (_this.dropTarget.removed()) {
              _this.boundsTuples.splice(i, 1);
            } else {
              tuple.bb = getBoundsCopy(_this.dropTarget);
            }

            break;
          }
        }

        _this.dropTarget = cy.collection();
        _this.dropSibling = cy.collection();
        _this.dropTargetBounds = null;

        _this.grabbedNode.emit('cdndout', [parent]);
      }
    } else {
      // not in a parent
      var _bb = expandBounds(getBounds(_this.grabbedNode), options.overThreshold);
      var overlappingNodes = _this.boundsTuples.filter(function (t) {
        return boundsOverlap(_bb, t.bb);
      }).map(function (t) {
        return t.node;
      });

      if (overlappingNodes.length > 0) {
        // potential parent
        var overlappingParents = overlappingNodes.filter(isParent);
        var _parent = void 0,
            sibling = void 0;

        if (overlappingParents.length > 0) {
          sibling = cy.collection();
          _parent = overlappingParents[0]; // TODO maybe use a metric here to select which one
        } else {
          sibling = overlappingNodes[0]; // TODO maybe use a metric here to select which one
          _parent = cy.add(options.newParentNode(_this.grabbedNode, sibling));
        }

        _parent.addClass('cdnd-drop-target');
        sibling.addClass('cdnd-drop-sibling');

        setParent(sibling, _parent);

        _this.dropTargetBounds = getBoundsCopy(_parent);

        setParent(_this.grabbedNode, _parent);

        _this.dropTarget = _parent;
        _this.dropSibling = sibling;

        _this.grabbedNode.emit('cdndover', [_parent, sibling]);
      }
    }
  });

  this.addListener('free', 'node', function () {
    if (!_this.inGesture || !_this.enabled) {
      return;
    }

    var grabbedNode = _this.grabbedNode,
        dropTarget = _this.dropTarget,
        dropSibling = _this.dropSibling;


    grabbedNode.removeClass('cdnd-grabbed-node');
    dropTarget.removeClass('cdnd-drop-target');
    dropSibling.removeClass('cdnd-drop-sibling');

    _this.grabbedNode = cy.collection();
    _this.dropTarget = cy.collection();
    _this.dropSibling = cy.collection();
    _this.dropTargetBounds = null;
    _this.boundsTuples = [];
    _this.inGesture = false;

    grabbedNode.emit('cdnddrop', [dropTarget, dropSibling]);
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
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isParent = function isParent(n) {
  return n.isParent();
};
var isChild = function isChild(n) {
  return n.isChild();
};
var isOnlyChild = function isOnlyChild(n) {
  return isChild(n) && n.parent().children().length === 1;
};

var getBounds = function getBounds(n) {
  return n.boundingBox({ includeOverlays: false });
};
var getBoundsTuple = function getBoundsTuple(n) {
  return { node: n, bb: copyBounds(getBounds(n)) };
};
var copyBounds = function copyBounds(bb) {
  return { x1: bb.x1, x2: bb.x2, y1: bb.y1, y2: bb.y2, w: bb.w, h: bb.h };
};
var getBoundsCopy = function getBoundsCopy(n) {
  return copyBounds(getBounds(n));
};

var removeParent = function removeParent(n) {
  return n.move({ parent: null });
};
var setParent = function setParent(n, parent) {
  return n.move({ parent: parent.id() });
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

var copyPosition = function copyPosition(p) {
  return { x: p.x, y: p.y };
};

var arePointsFartherApartThan = function arePointsFartherApartThan(p1, p2, dist) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;

  return dx * dx + dy * dy > dist * dist;
};

module.exports = {
  isParent: isParent, isChild: isChild, isOnlyChild: isOnlyChild,
  getBoundsTuple: getBoundsTuple, boundsOverlap: boundsOverlap, getBounds: getBounds, expandBounds: expandBounds, copyBounds: copyBounds, getBoundsCopy: getBoundsCopy,
  copyPosition: copyPosition, arePointsFartherApartThan: arePointsFartherApartThan,
  removeParent: removeParent, setParent: setParent
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(0);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2MzU0MDkwNWY3YmE5NzlhMTJjZCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzaWduLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2RlZmF1bHRzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2xpc3RlbmVycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC90b2dnbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiYXNzaWduIiwicmVxdWlyZSIsImRlZmF1bHRzIiwidG9nZ2xlIiwibGlzdGVuZXJzIiwiRHJhZ0FuZERyb3AiLCJjeSIsIm9wdGlvbnMiLCJlbmFibGVkIiwiYWRkTGlzdGVuZXJzIiwiZGVzdHJveSIsInJlbW92ZUxpc3RlbmVycyIsImZvckVhY2giLCJwcm90b3R5cGUiLCJkZWYiLCJtb2R1bGUiLCJleHBvcnRzIiwiT2JqZWN0IiwiYmluZCIsInRndCIsInNyY3MiLCJmaWx0ZXIiLCJzcmMiLCJrZXlzIiwiayIsImRyb3BUYXJnZXQiLCJncmFiYmVkTm9kZSIsIm5ld1BhcmVudE5vZGUiLCJkcm9wU2libGluZyIsIm92ZXJUaHJlc2hvbGQiLCJvdXRUaHJlc2hvbGQiLCJpc1BhcmVudCIsImlzQ2hpbGQiLCJpc09ubHlDaGlsZCIsImdldEJvdW5kcyIsImdldEJvdW5kc1R1cGxlIiwiYm91bmRzT3ZlcmxhcCIsImV4cGFuZEJvdW5kcyIsImdldEJvdW5kc0NvcHkiLCJzZXRQYXJlbnQiLCJyZW1vdmVQYXJlbnQiLCJhZGRMaXN0ZW5lciIsImV2ZW50Iiwic2VsZWN0b3IiLCJjYWxsYmFjayIsInB1c2giLCJvbiIsIm5vZGUiLCJlIiwidGFyZ2V0IiwiaXNNdWx0aXBseVNlbGVjdGVkIiwibiIsInNlbGVjdGVkIiwiZWxlbWVudHMiLCJsZW5ndGgiLCJjYW5CZUdyYWJiZWQiLCJjYW5CZURyb3BUYXJnZXQiLCJzYW1lIiwiY2FuUHVsbEZyb21QYXJlbnQiLCJpbkdlc3R1cmUiLCJib3VuZHNUdXBsZXMiLCJub2RlcyIsIm1hcCIsImNvbGxlY3Rpb24iLCJwYXJlbnQiLCJkcm9wVGFyZ2V0Qm91bmRzIiwiYWRkQ2xhc3MiLCJlbWl0Iiwibm9uZW1wdHkiLCJiYiIsInJtRnJvbVBhcmVudCIsImdyYWJiZWRJc09ubHlDaGlsZCIsInJlbW92ZUNsYXNzIiwicmVtb3ZlIiwiaSIsInR1cGxlIiwicmVtb3ZlZCIsInNwbGljZSIsIm92ZXJsYXBwaW5nTm9kZXMiLCJ0Iiwib3ZlcmxhcHBpbmdQYXJlbnRzIiwic2libGluZyIsImFkZCIsImxpcyIsInJlbW92ZUxpc3RlbmVyIiwiZW5hYmxlIiwiZGlzYWJsZSIsImNoaWxkcmVuIiwiYm91bmRpbmdCb3giLCJpbmNsdWRlT3ZlcmxheXMiLCJjb3B5Qm91bmRzIiwieDEiLCJ4MiIsInkxIiwieTIiLCJ3IiwiaCIsIm1vdmUiLCJpZCIsImJiMSIsImJiMiIsInBhZGRpbmciLCJjb3B5UG9zaXRpb24iLCJ4IiwicCIsInkiLCJhcmVQb2ludHNGYXJ0aGVyQXBhcnRUaGFuIiwicDEiLCJwMiIsImRpc3QiLCJkeCIsImR5IiwiaW1wbCIsInJlZ2lzdGVyIiwiY3l0b3NjYXBlIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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QyxHQUFHQyxFQUFFRCxDQUFQLEVBQVVFLEdBQUdELEVBQUVDLENBQWYsRUFBTjtBQUFBLENBQXJCOztBQUVBLElBQU1DLDRCQUE0QixTQUE1QkEseUJBQTRCLENBQUNDLEVBQUQsRUFBS0MsRUFBTCxFQUFTQyxJQUFULEVBQWtCO0FBQ2xELE1BQU1DLEtBQUtGLEdBQUdMLENBQUgsR0FBT0ksR0FBR0osQ0FBckI7QUFDQSxNQUFNUSxLQUFLSCxHQUFHSCxDQUFILEdBQU9FLEdBQUdGLENBQXJCOztBQUVBLFNBQU9LLEtBQUtBLEVBQUwsR0FBVUMsS0FBS0EsRUFBZixHQUFvQkYsT0FBT0EsSUFBbEM7QUFDRCxDQUxEOztBQU9BOUYsT0FBT0MsT0FBUCxHQUFpQjtBQUNmZSxvQkFEZSxFQUNMQyxnQkFESyxFQUNJQyx3QkFESjtBQUVmRSxnQ0FGZSxFQUVDQyw0QkFGRCxFQUVnQkYsb0JBRmhCLEVBRTJCRywwQkFGM0IsRUFFeUNxRCxzQkFGekMsRUFFcURwRCw0QkFGckQ7QUFHZmdFLDRCQUhlLEVBR0RJLG9EQUhDO0FBSWZsRSw0QkFKZSxFQUlERDtBQUpDLENBQWpCLEM7Ozs7Ozs7OztBQ3JEQSxJQUFNeUUsT0FBTy9HLG1CQUFPQSxDQUFDLENBQVIsQ0FBYjs7QUFFQTtBQUNBLElBQUlnSCxXQUFXLFNBQVhBLFFBQVcsQ0FBVUMsU0FBVixFQUFxQjtBQUNsQyxNQUFJLENBQUNBLFNBQUwsRUFBZ0I7QUFBRTtBQUFTLEdBRE8sQ0FDTjs7QUFFNUJBLFlBQVcsTUFBWCxFQUFtQixxQkFBbkIsRUFBMENGLElBQTFDLEVBSGtDLENBR2dCO0FBQ25ELENBSkQ7O0FBTUEsSUFBSSxPQUFPRSxTQUFQLEtBQXFCLFdBQXpCLEVBQXNDO0FBQUU7QUFDdENELFdBQVVDLFNBQVY7QUFDRDs7QUFFRG5HLE9BQU9DLE9BQVAsR0FBaUJpRyxRQUFqQixDIiwiZmlsZSI6ImN5dG9zY2FwZS1jb21wb3VuZC1kcmFnLWFuZC1kcm9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiY3l0b3NjYXBlQ29tcG91bmREcmFnQW5kRHJvcFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJjeXRvc2NhcGVDb21wb3VuZERyYWdBbmREcm9wXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjM1NDA5MDVmN2JhOTc5YTEyY2QiLCJjb25zdCBhc3NpZ24gPSByZXF1aXJlKCcuLi9hc3NpZ24nKTtcbmNvbnN0IGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi90b2dnbGUnKTtcbmNvbnN0IGxpc3RlbmVycyA9IHJlcXVpcmUoJy4vbGlzdGVuZXJzJyk7XG5cbmNvbnN0IERyYWdBbmREcm9wID0gZnVuY3Rpb24oY3ksIG9wdGlvbnMpe1xuICB0aGlzLmN5ID0gY3k7XG4gIHRoaXMub3B0aW9ucyA9IGFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG59O1xuXG5jb25zdCBkZXN0cm95ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5yZW1vdmVMaXN0ZW5lcnMoKTtcbn07XG5cbltcbiAgdG9nZ2xlLFxuICBsaXN0ZW5lcnMsXG4gIHsgZGVzdHJveSB9XG5dLmZvckVhY2goZGVmID0+IHtcbiAgYXNzaWduKERyYWdBbmREcm9wLnByb3RvdHlwZSwgZGVmKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICBsZXQgY3kgPSB0aGlzO1xuXG4gIHJldHVybiBuZXcgRHJhZ0FuZERyb3AoY3ksIG9wdGlvbnMpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2luZGV4LmpzIiwiLy8gU2ltcGxlLCBpbnRlcm5hbCBPYmplY3QuYXNzaWduKCkgcG9seWZpbGwgZm9yIG9wdGlvbnMgb2JqZWN0cyBldGMuXG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiAhPSBudWxsID8gT2JqZWN0LmFzc2lnbi5iaW5kKCBPYmplY3QgKSA6IGZ1bmN0aW9uKCB0Z3QsIC4uLnNyY3MgKXtcbiAgc3Jjcy5maWx0ZXIoc3JjID0+IHNyYyAhPSBudWxsKS5mb3JFYWNoKCBzcmMgPT4ge1xuICAgIE9iamVjdC5rZXlzKCBzcmMgKS5mb3JFYWNoKCBrID0+IHRndFtrXSA9IHNyY1trXSApO1xuICB9ICk7XG5cbiAgcmV0dXJuIHRndDtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Fzc2lnbi5qcyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkcm9wVGFyZ2V0OiBub2RlID0+IHRydWUsIC8vIGZpbHRlciBmdW5jdGlvbiB0byBzcGVjaWZ5IHdoaWNoIG5vZGVzIGFyZSB2YWxpZCBkcm9wIHRhcmdldHNcbiAgZ3JhYmJlZE5vZGU6IG5vZGUgPT4gdHJ1ZSwgLy8gZmlsdGVyIGZ1bmN0aW9uIHRvIHNwZWNpZnkgd2hpY2ggbm9kZXMgYXJlIHZhbGlkIHRvIGdyYWIgYW5kIGRyb3AgaW50byBvdGhlciBub2Rlc1xuICBuZXdQYXJlbnROb2RlOiAoZ3JhYmJlZE5vZGUsIGRyb3BTaWJsaW5nKSA9PiAoe30pLCAvLyBzcGVjaWZpZXMgZWxlbWVudCBqc29uIGZvciBwYXJlbnQgbm9kZXMgYWRkZWQgYnkgZHJvcHBpbmcgYW4gb3JwaGFuIG5vZGUgb24gYW5vdGhlciBvcnBoYW5cbiAgb3ZlclRocmVzaG9sZDogMTAsIC8vIG1ha2UgZHJhZ2dpbmcgb3ZlciBhIGRyb3AgdGFyZ2V0IGVhc2llciBieSBleHBhbmRpbmcgdGhlIGhpdCBhcmVhIGJ5IHRoaXMgYW1vdW50IG9uIGFsbCBzaWRlc1xuICBvdXRUaHJlc2hvbGQ6IDEwIC8vIG1ha2UgZHJhZ2dpbmcgb3V0IG9mIGEgZHJvcCB0YXJnZXQgYSBiaXQgaGFyZGVyIGJ5IGV4cGFuZGluZyB0aGUgaGl0IGFyZWEgYnkgdGhpcyBhbW91bnQgb24gYWxsIHNpZGVzXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2RlZmF1bHRzLmpzIiwiY29uc3Qge1xuICBpc1BhcmVudCwgaXNDaGlsZCwgaXNPbmx5Q2hpbGQsXG4gIGdldEJvdW5kcywgZ2V0Qm91bmRzVHVwbGUsIGJvdW5kc092ZXJsYXAsIGV4cGFuZEJvdW5kcywgZ2V0Qm91bmRzQ29weSxcbiAgc2V0UGFyZW50LCByZW1vdmVQYXJlbnRcbn0gPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuY29uc3QgYWRkTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrKXtcbiAgdGhpcy5saXN0ZW5lcnMucHVzaCh7IGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2sgfSk7XG5cbiAgaWYoIHNlbGVjdG9yID09IG51bGwgKXtcbiAgICB0aGlzLmN5Lm9uKGV2ZW50LCBjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5jeS5vbihldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrKTtcbiAgfVxufTtcblxuY29uc3QgYWRkTGlzdGVuZXJzID0gZnVuY3Rpb24oKXtcbiAgY29uc3QgeyBvcHRpb25zLCBjeSB9ID0gdGhpcztcblxuICB0aGlzLmFkZExpc3RlbmVyKCdncmFiJywgJ25vZGUnLCBlID0+IHtcbiAgICBjb25zdCBub2RlID0gZS50YXJnZXQ7XG4gICAgY29uc3QgaXNNdWx0aXBseVNlbGVjdGVkID0gbiA9PiBuLnNlbGVjdGVkKCkgJiYgY3kuZWxlbWVudHMoJ25vZGU6c2VsZWN0ZWQnKS5sZW5ndGggPiAxO1xuICAgIGNvbnN0IGNhbkJlR3JhYmJlZCA9IG4gPT4gIWlzUGFyZW50KG4pICYmICFpc011bHRpcGx5U2VsZWN0ZWQobikgJiYgb3B0aW9ucy5ncmFiYmVkTm9kZShuKTtcbiAgICBjb25zdCBjYW5CZURyb3BUYXJnZXQgPSBuID0+ICFpc0NoaWxkKG4pICYmICFuLnNhbWUobm9kZSkgJiYgb3B0aW9ucy5kcm9wVGFyZ2V0KG4pO1xuICAgIGNvbnN0IGNhblB1bGxGcm9tUGFyZW50ID0gbiA9PiBpc0NoaWxkKG4pO1xuXG4gICAgaWYoICF0aGlzLmVuYWJsZWQgfHwgIWNhbkJlR3JhYmJlZChub2RlKSApeyByZXR1cm47IH1cblxuICAgIHRoaXMuaW5HZXN0dXJlID0gdHJ1ZTtcbiAgICB0aGlzLmdyYWJiZWROb2RlID0gbm9kZTtcbiAgICB0aGlzLmJvdW5kc1R1cGxlcyA9IGN5Lm5vZGVzKGNhbkJlRHJvcFRhcmdldCkubWFwKGdldEJvdW5kc1R1cGxlKTtcbiAgICB0aGlzLmRyb3BUYXJnZXQgPSBjeS5jb2xsZWN0aW9uKCk7XG4gICAgdGhpcy5kcm9wU2libGluZyA9IGN5LmNvbGxlY3Rpb24oKTtcblxuICAgIGlmKCBjYW5QdWxsRnJvbVBhcmVudChub2RlKSApe1xuICAgICAgdGhpcy5kcm9wVGFyZ2V0ID0gbm9kZS5wYXJlbnQoKTtcbiAgICAgIHRoaXMuZHJvcFRhcmdldEJvdW5kcyA9IGdldEJvdW5kc0NvcHkodGhpcy5kcm9wVGFyZ2V0KTtcbiAgICB9XG5cbiAgICB0aGlzLmdyYWJiZWROb2RlLmFkZENsYXNzKCdjZG5kLWdyYWJiZWQtbm9kZScpO1xuICAgIHRoaXMuZHJvcFRhcmdldC5hZGRDbGFzcygnY2RuZC1kcm9wLXRhcmdldCcpO1xuXG4gICAgbm9kZS5lbWl0KCdjZG5kZ3JhYicpO1xuICB9KTtcblxuICB0aGlzLmFkZExpc3RlbmVyKCdkcmFnJywgJ25vZGUnLCAoKSA9PiB7XG4gICAgaWYoICF0aGlzLmluR2VzdHVyZSB8fCAhdGhpcy5lbmFibGVkICl7IHJldHVybjsgfVxuXG4gICAgaWYoIHRoaXMuZHJvcFRhcmdldC5ub25lbXB0eSgpICl7IC8vIGFscmVhZHkgaW4gYSBwYXJlbnRcbiAgICAgIGNvbnN0IGJiID0gZXhwYW5kQm91bmRzKCBnZXRCb3VuZHModGhpcy5ncmFiYmVkTm9kZSksIG9wdGlvbnMub3V0VGhyZXNob2xkICk7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmRyb3BUYXJnZXQ7XG4gICAgICBjb25zdCBybUZyb21QYXJlbnQgPSAhYm91bmRzT3ZlcmxhcCh0aGlzLmRyb3BUYXJnZXRCb3VuZHMsIGJiKTtcbiAgICAgIGNvbnN0IGdyYWJiZWRJc09ubHlDaGlsZCA9IGlzT25seUNoaWxkKHRoaXMuZ3JhYmJlZE5vZGUpO1xuXG4gICAgICBpZiggcm1Gcm9tUGFyZW50ICl7XG4gICAgICAgIHJlbW92ZVBhcmVudCh0aGlzLmdyYWJiZWROb2RlKTtcbiAgICAgICAgcmVtb3ZlUGFyZW50KHRoaXMuZHJvcFNpYmxpbmcpO1xuXG4gICAgICAgIHRoaXMuZHJvcFRhcmdldC5yZW1vdmVDbGFzcygnY2RuZC1kcm9wLXRhcmdldCcpO1xuICAgICAgICB0aGlzLmRyb3BTaWJsaW5nLnJlbW92ZUNsYXNzKCdjZG5kLWRyb3Atc2libGluZycpO1xuXG4gICAgICAgIGlmKFxuICAgICAgICAgIHRoaXMuZHJvcFNpYmxpbmcubm9uZW1wdHkoKSAvLyByZW1vdmUgZXh0ZW5zaW9uLWNyZWF0ZWQgcGFyZW50cyBvbiBvdXRcbiAgICAgICAgICB8fCBncmFiYmVkSXNPbmx5Q2hpbGQgLy8gcmVtb3ZlIGVtcHR5IHBhcmVudHNcbiAgICAgICAgKXtcbiAgICAgICAgICB0aGlzLmRyb3BUYXJnZXQucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHJlbW92YWwgdXBkYXRlcyB0aGUgYm91bmRzIHR1cGxlcyBwcm9wZXJseVxuICAgICAgICBmb3IoIGxldCBpID0gdGhpcy5ib3VuZHNUdXBsZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0gKXtcbiAgICAgICAgICBsZXQgdHVwbGUgPSB0aGlzLmJvdW5kc1R1cGxlc1tpXTtcblxuICAgICAgICAgIGlmKCB0dXBsZS5ub2RlLnNhbWUodGhpcy5kcm9wVGFyZ2V0KSApe1xuICAgICAgICAgICAgaWYoIHRoaXMuZHJvcFRhcmdldC5yZW1vdmVkKCkgKXtcbiAgICAgICAgICAgICAgdGhpcy5ib3VuZHNUdXBsZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdHVwbGUuYmIgPSBnZXRCb3VuZHNDb3B5KHRoaXMuZHJvcFRhcmdldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJvcFRhcmdldCA9IGN5LmNvbGxlY3Rpb24oKTtcbiAgICAgICAgdGhpcy5kcm9wU2libGluZyA9IGN5LmNvbGxlY3Rpb24oKTtcbiAgICAgICAgdGhpcy5kcm9wVGFyZ2V0Qm91bmRzID0gbnVsbDtcblxuICAgICAgICB0aGlzLmdyYWJiZWROb2RlLmVtaXQoJ2NkbmRvdXQnLCBbcGFyZW50XSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gbm90IGluIGEgcGFyZW50XG4gICAgICBjb25zdCBiYiA9IGV4cGFuZEJvdW5kcyggZ2V0Qm91bmRzKHRoaXMuZ3JhYmJlZE5vZGUpLCBvcHRpb25zLm92ZXJUaHJlc2hvbGQgKTtcbiAgICAgIGNvbnN0IG92ZXJsYXBwaW5nTm9kZXMgPSB0aGlzLmJvdW5kc1R1cGxlcy5maWx0ZXIodCA9PiBib3VuZHNPdmVybGFwKGJiLCB0LmJiKSkubWFwKHQgPT4gdC5ub2RlKTtcblxuICAgICAgaWYoIG92ZXJsYXBwaW5nTm9kZXMubGVuZ3RoID4gMCApeyAvLyBwb3RlbnRpYWwgcGFyZW50XG4gICAgICAgIGNvbnN0IG92ZXJsYXBwaW5nUGFyZW50cyA9IG92ZXJsYXBwaW5nTm9kZXMuZmlsdGVyKGlzUGFyZW50KTtcbiAgICAgICAgbGV0IHBhcmVudCwgc2libGluZztcblxuICAgICAgICBpZiggb3ZlcmxhcHBpbmdQYXJlbnRzLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgICBzaWJsaW5nID0gY3kuY29sbGVjdGlvbigpO1xuICAgICAgICAgIHBhcmVudCA9IG92ZXJsYXBwaW5nUGFyZW50c1swXTsgLy8gVE9ETyBtYXliZSB1c2UgYSBtZXRyaWMgaGVyZSB0byBzZWxlY3Qgd2hpY2ggb25lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2libGluZyA9IG92ZXJsYXBwaW5nTm9kZXNbMF07IC8vIFRPRE8gbWF5YmUgdXNlIGEgbWV0cmljIGhlcmUgdG8gc2VsZWN0IHdoaWNoIG9uZVxuICAgICAgICAgIHBhcmVudCA9IGN5LmFkZCggb3B0aW9ucy5uZXdQYXJlbnROb2RlKHRoaXMuZ3JhYmJlZE5vZGUsIHNpYmxpbmcpICk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJlbnQuYWRkQ2xhc3MoJ2NkbmQtZHJvcC10YXJnZXQnKTtcbiAgICAgICAgc2libGluZy5hZGRDbGFzcygnY2RuZC1kcm9wLXNpYmxpbmcnKTtcblxuICAgICAgICBzZXRQYXJlbnQoc2libGluZywgcGFyZW50KTtcblxuICAgICAgICB0aGlzLmRyb3BUYXJnZXRCb3VuZHMgPSBnZXRCb3VuZHNDb3B5KHBhcmVudCk7XG5cbiAgICAgICAgc2V0UGFyZW50KHRoaXMuZ3JhYmJlZE5vZGUsIHBhcmVudCk7XG5cbiAgICAgICAgdGhpcy5kcm9wVGFyZ2V0ID0gcGFyZW50O1xuICAgICAgICB0aGlzLmRyb3BTaWJsaW5nID0gc2libGluZztcblxuICAgICAgICB0aGlzLmdyYWJiZWROb2RlLmVtaXQoJ2NkbmRvdmVyJywgW3BhcmVudCwgc2libGluZ10pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy5hZGRMaXN0ZW5lcignZnJlZScsICdub2RlJywgKCkgPT4ge1xuICAgIGlmKCAhdGhpcy5pbkdlc3R1cmUgfHwgIXRoaXMuZW5hYmxlZCApeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHsgZ3JhYmJlZE5vZGUsIGRyb3BUYXJnZXQsIGRyb3BTaWJsaW5nIH0gPSB0aGlzO1xuXG4gICAgZ3JhYmJlZE5vZGUucmVtb3ZlQ2xhc3MoJ2NkbmQtZ3JhYmJlZC1ub2RlJyk7XG4gICAgZHJvcFRhcmdldC5yZW1vdmVDbGFzcygnY2RuZC1kcm9wLXRhcmdldCcpO1xuICAgIGRyb3BTaWJsaW5nLnJlbW92ZUNsYXNzKCdjZG5kLWRyb3Atc2libGluZycpO1xuXG4gICAgdGhpcy5ncmFiYmVkTm9kZSA9IGN5LmNvbGxlY3Rpb24oKTtcbiAgICB0aGlzLmRyb3BUYXJnZXQgPSBjeS5jb2xsZWN0aW9uKCk7XG4gICAgdGhpcy5kcm9wU2libGluZyA9IGN5LmNvbGxlY3Rpb24oKTtcbiAgICB0aGlzLmRyb3BUYXJnZXRCb3VuZHMgPSBudWxsO1xuICAgIHRoaXMuYm91bmRzVHVwbGVzID0gW107XG4gICAgdGhpcy5pbkdlc3R1cmUgPSBmYWxzZTtcblxuICAgIGdyYWJiZWROb2RlLmVtaXQoJ2NkbmRkcm9wJywgW2Ryb3BUYXJnZXQsIGRyb3BTaWJsaW5nXSk7XG4gIH0pO1xufTtcblxuY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gZnVuY3Rpb24oKXtcbiAgY29uc3QgeyBjeSB9ID0gdGhpcztcblxuICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGxpcyA9PiB7XG4gICAgY29uc3QgeyBldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrIH0gPSBsaXM7XG5cbiAgICBpZiggc2VsZWN0b3IgPT0gbnVsbCApe1xuICAgICAgY3kucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3kucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjayk7XG4gICAgfVxuICB9KTtcblxuICB0aGlzLmxpc3RlbmVycyA9IFtdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7IGFkZExpc3RlbmVyLCBhZGRMaXN0ZW5lcnMsIHJlbW92ZUxpc3RlbmVycyB9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2xpc3RlbmVycy5qcyIsImZ1bmN0aW9uIGVuYWJsZSgpe1xuICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBkaXNhYmxlKCl7XG4gIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgZW5hYmxlLCBkaXNhYmxlIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC90b2dnbGUuanMiLCJjb25zdCBpc1BhcmVudCA9IG4gPT4gbi5pc1BhcmVudCgpO1xuY29uc3QgaXNDaGlsZCA9IG4gPT4gbi5pc0NoaWxkKCk7XG5jb25zdCBpc09ubHlDaGlsZCA9IG4gPT4gaXNDaGlsZChuKSAmJiBuLnBhcmVudCgpLmNoaWxkcmVuKCkubGVuZ3RoID09PSAxO1xuXG5jb25zdCBnZXRCb3VuZHMgPSBuID0+IG4uYm91bmRpbmdCb3goeyBpbmNsdWRlT3ZlcmxheXM6IGZhbHNlIH0pO1xuY29uc3QgZ2V0Qm91bmRzVHVwbGUgPSBuID0+ICh7IG5vZGU6IG4sIGJiOiBjb3B5Qm91bmRzKGdldEJvdW5kcyhuKSkgfSk7XG5jb25zdCBjb3B5Qm91bmRzID0gYmIgPT4gKHsgeDE6IGJiLngxLCB4MjogYmIueDIsIHkxOiBiYi55MSwgeTI6IGJiLnkyLCB3OiBiYi53LCBoOiBiYi5oIH0pO1xuY29uc3QgZ2V0Qm91bmRzQ29weSA9IG4gPT4gY29weUJvdW5kcyhnZXRCb3VuZHMobikpO1xuXG5jb25zdCByZW1vdmVQYXJlbnQgPSBuID0+IG4ubW92ZSh7IHBhcmVudDogbnVsbCB9KTtcbmNvbnN0IHNldFBhcmVudCA9IChuLCBwYXJlbnQpID0+IG4ubW92ZSh7IHBhcmVudDogcGFyZW50LmlkKCkgfSk7XG5cbmNvbnN0IGJvdW5kc092ZXJsYXAgPSAoYmIxLCBiYjIpID0+IHtcbiAgLy8gY2FzZTogb25lIGJiIHRvIHJpZ2h0IG9mIG90aGVyXG4gIGlmKCBiYjEueDEgPiBiYjIueDIgKXsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmKCBiYjIueDEgPiBiYjEueDIgKXsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gY2FzZTogb25lIGJiIHRvIGxlZnQgb2Ygb3RoZXJcbiAgaWYoIGJiMS54MiA8IGJiMi54MSApeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYoIGJiMi54MiA8IGJiMS54MSApeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBjYXNlOiBvbmUgYmIgYWJvdmUgb3RoZXJcbiAgaWYoIGJiMS55MiA8IGJiMi55MSApeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYoIGJiMi55MiA8IGJiMS55MSApeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBjYXNlOiBvbmUgYmIgYmVsb3cgb3RoZXJcbiAgaWYoIGJiMS55MSA+IGJiMi55MiApeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYoIGJiMi55MSA+IGJiMS55MiApeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBvdGhlcndpc2UsIG11c3QgaGF2ZSBzb21lIG92ZXJsYXBcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5jb25zdCBleHBhbmRCb3VuZHMgPSAoYmIsIHBhZGRpbmcpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB4MTogYmIueDEgLSBwYWRkaW5nLFxuICAgIHgyOiBiYi54MiArIHBhZGRpbmcsXG4gICAgdzogYmIudyArIDIgKiBwYWRkaW5nLFxuICAgIHkxOiBiYi55MSAtIHBhZGRpbmcsXG4gICAgeTI6IGJiLnkyICsgcGFkZGluZyxcbiAgICBoOiBiYi5oICsgMiAqIHBhZGRpbmdcbiAgfTtcbn07XG5cbmNvbnN0IGNvcHlQb3NpdGlvbiA9IHAgPT4gKHsgeDogcC54LCB5OiBwLnkgfSk7XG5cbmNvbnN0IGFyZVBvaW50c0ZhcnRoZXJBcGFydFRoYW4gPSAocDEsIHAyLCBkaXN0KSA9PiB7XG4gIGNvbnN0IGR4ID0gcDIueCAtIHAxLng7XG4gIGNvbnN0IGR5ID0gcDIueSAtIHAxLnk7XG5cbiAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5ID4gZGlzdCAqIGRpc3Q7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNQYXJlbnQsIGlzQ2hpbGQsIGlzT25seUNoaWxkLFxuICBnZXRCb3VuZHNUdXBsZSwgYm91bmRzT3ZlcmxhcCwgZ2V0Qm91bmRzLCBleHBhbmRCb3VuZHMsIGNvcHlCb3VuZHMsIGdldEJvdW5kc0NvcHksXG4gIGNvcHlQb3NpdGlvbiwgYXJlUG9pbnRzRmFydGhlckFwYXJ0VGhhbixcbiAgcmVtb3ZlUGFyZW50LCBzZXRQYXJlbnRcbiB9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL3V0aWwuanMiLCJjb25zdCBpbXBsID0gcmVxdWlyZSgnLi9jb21wb3VuZC1kcmFnLWFuZC1kcm9wJyk7XG5cbi8vIHJlZ2lzdGVycyB0aGUgZXh0ZW5zaW9uIG9uIGEgY3l0b3NjYXBlIGxpYiByZWZcbmxldCByZWdpc3RlciA9IGZ1bmN0aW9uKCBjeXRvc2NhcGUgKXtcbiAgaWYoICFjeXRvc2NhcGUgKXsgcmV0dXJuOyB9IC8vIGNhbid0IHJlZ2lzdGVyIGlmIGN5dG9zY2FwZSB1bnNwZWNpZmllZFxuXG4gIGN5dG9zY2FwZSggJ2NvcmUnLCAnY29tcG91bmREcmFnQW5kRHJvcCcsIGltcGwgKTsgLy8gcmVnaXN0ZXIgd2l0aCBjeXRvc2NhcGUuanNcbn07XG5cbmlmKCB0eXBlb2YgY3l0b3NjYXBlICE9PSAndW5kZWZpbmVkJyApeyAvLyBleHBvc2UgdG8gZ2xvYmFsIGN5dG9zY2FwZSAoaS5lLiB3aW5kb3cuY3l0b3NjYXBlKVxuICByZWdpc3RlciggY3l0b3NjYXBlICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9