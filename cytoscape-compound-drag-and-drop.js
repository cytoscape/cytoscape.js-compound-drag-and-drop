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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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


module.exports = {};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isParent = function isParent(n) {
  return n.isParent();
};
var isChild = function isChild(n) {
  return n.isChild();
};

var getBoundsTuple = function getBoundsTuple(n) {
  return { node: n, bb: n.boundingBox() };
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

    if (isParent(node)) {
      return;
    }

    _this.inGesture = true;
    _this.grabbedNode = node;
    _this.boundsTuples = cy.nodes().not(node).map(getBoundsTuple);
    _this.sibling = cy.collection();
    _this.parent = cy.collection();

    // if( isChild(node) ){
    //   removeParent(node);
    // }
  });

  this.addListener('drag', 'node', function (e) {
    if (!_this.inGesture) {
      return;
    }

    var node = e.target;
    var bb = node.boundingBox();
    var overlappingNodes = _this.boundsTuples.filter(function (t) {
      return boundsOverlap(bb, t.bb);
    }).map(function (t) {
      return t.node;
    });

    _this.sibling = cy.collection();
    _this.parent = cy.collection();

    if (overlappingNodes.length > 0) {
      var overlappingParents = overlappingNodes.filter(isParent);

      if (overlappingParents.length > 0) {
        _this.sibling = cy.collection();
        _this.parent = overlappingParents[0]; // TODO select particular one by metric

        // TODO event & style
      } else {
        _this.sibling = overlappingNodes[0]; // TODO select by metric
        _this.parent = cy.collection();

        // TODO event & style
      }
    }
  });

  this.addListener('free', 'node', function (e) {
    if (!_this.inGesture) {
      return;
    }

    var node = e.target;

    if (_this.parent.nonempty()) {
      setParent(node, _this.parent);

      // TODO event
    } else if (_this.sibling.nonempty()) {
      var parent = cy.add({ group: 'nodes' }); // TODO parameterise

      setParent(_this.sibling, parent);
      setParent(node, parent);

      // TODO event
    }

    _this.sibling = cy.collection();
    _this.parent = cy.collection();
    _this.inGesture = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAzMjIxNTEzM2E2YzdlYzc4MTRlMiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzaWduLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2RlZmF1bHRzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2xpc3RlbmVycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC90b2dnbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImFzc2lnbiIsInJlcXVpcmUiLCJkZWZhdWx0cyIsInRvZ2dsZSIsImxpc3RlbmVycyIsIkRyYWdBbmREcm9wIiwiY3kiLCJvcHRpb25zIiwiYWRkTGlzdGVuZXJzIiwiZGVzdHJveSIsInJlbW92ZUxpc3RlbmVycyIsImZvckVhY2giLCJwcm90b3R5cGUiLCJkZWYiLCJtb2R1bGUiLCJleHBvcnRzIiwiT2JqZWN0IiwiYmluZCIsInRndCIsInNyY3MiLCJmaWx0ZXIiLCJzcmMiLCJrZXlzIiwiayIsImlzUGFyZW50IiwibiIsImlzQ2hpbGQiLCJnZXRCb3VuZHNUdXBsZSIsIm5vZGUiLCJiYiIsImJvdW5kaW5nQm94IiwicmVtb3ZlUGFyZW50IiwibW92ZSIsInBhcmVudCIsInNldFBhcmVudCIsImlkIiwiYm91bmRzT3ZlcmxhcCIsImJiMSIsImJiMiIsIngxIiwieDIiLCJ5MiIsInkxIiwiYWRkTGlzdGVuZXIiLCJldmVudCIsInNlbGVjdG9yIiwiY2FsbGJhY2siLCJwdXNoIiwib24iLCJlIiwidGFyZ2V0IiwiaW5HZXN0dXJlIiwiZ3JhYmJlZE5vZGUiLCJib3VuZHNUdXBsZXMiLCJub2RlcyIsIm5vdCIsIm1hcCIsInNpYmxpbmciLCJjb2xsZWN0aW9uIiwib3ZlcmxhcHBpbmdOb2RlcyIsInQiLCJsZW5ndGgiLCJvdmVybGFwcGluZ1BhcmVudHMiLCJub25lbXB0eSIsImFkZCIsImdyb3VwIiwibGlzIiwicmVtb3ZlTGlzdGVuZXIiLCJlbmFibGUiLCJlbmFibGVkIiwiZGlzYWJsZSIsImltcGwiLCJyZWdpc3RlciIsImN5dG9zY2FwZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQ2hFQSxJQUFNQSxTQUFTQyxtQkFBT0EsQ0FBQyxDQUFSLENBQWY7QUFDQSxJQUFNQyxXQUFXRCxtQkFBT0EsQ0FBQyxDQUFSLENBQWpCO0FBQ0EsSUFBTUUsU0FBU0YsbUJBQU9BLENBQUMsQ0FBUixDQUFmO0FBQ0EsSUFBTUcsWUFBWUgsbUJBQU9BLENBQUMsQ0FBUixDQUFsQjs7QUFFQSxJQUFNSSxjQUFjLFNBQWRBLFdBQWMsQ0FBU0MsRUFBVCxFQUFhQyxPQUFiLEVBQXFCO0FBQ3ZDLE9BQUtELEVBQUwsR0FBVUEsRUFBVjtBQUNBLE9BQUtDLE9BQUwsR0FBZVAsT0FBTyxFQUFQLEVB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QUF5QkMsUUFBekIsRUFBbUNDLFFBQW5DO0FBQ0Q7QUFDRixHQVJEOztBQVVBLE9BQUsxQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0QsQ0FkRDs7QUFnQkFVLE9BQU9DLE9BQVAsR0FBaUIsRUFBRTRCLHdCQUFGLEVBQWVuQywwQkFBZixFQUE2QkUsZ0NBQTdCLEVBQWpCLEM7Ozs7Ozs7OztBQzdIQSxTQUFTMEQsTUFBVCxHQUFpQjtBQUNmLE9BQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0Q7O0FBRUQsU0FBU0MsT0FBVCxHQUFrQjtBQUNoQixPQUFLRCxPQUFMLEdBQWUsS0FBZjtBQUNEOztBQUVEdkQsT0FBT0MsT0FBUCxHQUFpQixFQUFFcUQsY0FBRixFQUFVRSxnQkFBVixFQUFqQixDOzs7Ozs7Ozs7QUNSQSxJQUFNQyxPQUFPdEUsbUJBQU9BLENBQUMsQ0FBUixDQUFiOztBQUVBO0FBQ0EsSUFBSXVFLFdBQVcsU0FBWEEsUUFBVyxDQUFVQyxTQUFWLEVBQXFCO0FBQ2xDLE1BQUksQ0FBQ0EsU0FBTCxFQUFnQjtBQUFFO0FBQVMsR0FETyxDQUNOOztBQUU1QkEsWUFBVyxNQUFYLEVBQW1CLHFCQUFuQixFQUEwQ0YsSUFBMUMsRUFIa0MsQ0FHZ0I7QUFDbkQsQ0FKRDs7QUFNQSxJQUFJLE9BQU9FLFNBQVAsS0FBcUIsV0FBekIsRUFBc0M7QUFBRTtBQUN0Q0QsV0FBVUMsU0FBVjtBQUNEOztBQUVEM0QsT0FBT0MsT0FBUCxHQUFpQnlELFFBQWpCLEMiLCJmaWxlIjoiY3l0b3NjYXBlLWNvbXBvdW5kLWRyYWctYW5kLWRyb3AuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJjeXRvc2NhcGVDb21wb3VuZERyYWdBbmREcm9wXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImN5dG9zY2FwZUNvbXBvdW5kRHJhZ0FuZERyb3BcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzMjIxNTEzM2E2YzdlYzc4MTRlMiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJy4uL2Fzc2lnbicpO1xuY29uc3QgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5jb25zdCB0b2dnbGUgPSByZXF1aXJlKCcuL3RvZ2dsZScpO1xuY29uc3QgbGlzdGVuZXJzID0gcmVxdWlyZSgnLi9saXN0ZW5lcnMnKTtcblxuY29uc3QgRHJhZ0FuZERyb3AgPSBmdW5jdGlvbihjeSwgb3B0aW9ucyl7XG4gIHRoaXMuY3kgPSBjeTtcbiAgdGhpcy5vcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gIHRoaXMubGlzdGVuZXJzID0gW107XG5cbiAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbn07XG5cbmNvbnN0IGRlc3Ryb3kgPSBmdW5jdGlvbigpe1xuICB0aGlzLnJlbW92ZUxpc3RlbmVycygpO1xufTtcblxuW1xuICB0b2dnbGUsXG4gIGxpc3RlbmVycyxcbiAgeyBkZXN0cm95IH1cbl0uZm9yRWFjaChkZWYgPT4ge1xuICBhc3NpZ24oRHJhZ0FuZERyb3AucHJvdG90eXBlLCBkZWYpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gIGxldCBjeSA9IHRoaXM7XG5cbiAgcmV0dXJuIG5ldyBEcmFnQW5kRHJvcChjeSwgb3B0aW9ucyk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AvaW5kZXguanMiLCIvLyBTaW1wbGUsIGludGVybmFsIE9iamVjdC5hc3NpZ24oKSBwb2x5ZmlsbCBmb3Igb3B0aW9ucyBvYmplY3RzIGV0Yy5cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduICE9IG51bGwgPyBPYmplY3QuYXNzaWduLmJpbmQoIE9iamVjdCApIDogZnVuY3Rpb24oIHRndCwgLi4uc3JjcyApe1xuICBzcmNzLmZpbHRlcihzcmMgPT4gc3JjICE9IG51bGwpLmZvckVhY2goIHNyYyA9PiB7XG4gICAgT2JqZWN0LmtleXMoIHNyYyApLmZvckVhY2goIGsgPT4gdGd0W2tdID0gc3JjW2tdICk7XG4gIH0gKTtcblxuICByZXR1cm4gdGd0O1xufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYXNzaWduLmpzIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvdW5kLWRyYWctYW5kLWRyb3AvZGVmYXVsdHMuanMiLCJjb25zdCBpc1BhcmVudCA9IG4gPT4gbi5pc1BhcmVudCgpO1xuY29uc3QgaXNDaGlsZCA9IG4gPT4gbi5pc0NoaWxkKCk7XG5cbmNvbnN0IGdldEJvdW5kc1R1cGxlID0gbiA9PiAoeyBub2RlOiBuLCBiYjogbi5ib3VuZGluZ0JveCgpIH0pO1xuXG5jb25zdCByZW1vdmVQYXJlbnQgPSBuID0+IG4ubW92ZSh7IHBhcmVudDogbnVsbCB9KTtcbmNvbnN0IHNldFBhcmVudCA9IChuLCBwYXJlbnQpID0+IG4ubW92ZSh7IHBhcmVudDogcGFyZW50LmlkKCkgfSk7XG5cbmNvbnN0IGJvdW5kc092ZXJsYXAgPSAoYmIxLCBiYjIpID0+IHtcbiAgLy8gY2FzZTogb25lIGJiIHRvIHJpZ2h0IG9mIG90aGVyXG4gIGlmKCBiYjEueDEgPiBiYjIueDIgKXsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmKCBiYjIueDEgPiBiYjEueDIgKXsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gY2FzZTogb25lIGJiIHRvIGxlZnQgb2Ygb3RoZXJcbiAgaWYoIGJiMS54MiA8IGJiMi54MSApeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYoIGJiMi54MiA8IGJiMS54MSApeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBjYXNlOiBvbmUgYmIgYWJvdmUgb3RoZXJcbiAgaWYoIGJiMS55MiA8IGJiMi55MSApeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYoIGJiMi55MiA8IGJiMS55MSApeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBjYXNlOiBvbmUgYmIgYmVsb3cgb3RoZXJcbiAgaWYoIGJiMS55MSA+IGJiMi55MiApeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYoIGJiMi55MSA+IGJiMS55MiApeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBvdGhlcndpc2UsIG11c3QgaGF2ZSBzb21lIG92ZXJsYXBcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5jb25zdCBhZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2spe1xuICB0aGlzLmxpc3RlbmVycy5wdXNoKHsgZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjayB9KTtcblxuICBpZiggc2VsZWN0b3IgPT0gbnVsbCApe1xuICAgIHRoaXMuY3kub24oZXZlbnQsIGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmN5Lm9uKGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2spO1xuICB9XG59O1xuXG5jb25zdCBhZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpe1xuICBjb25zdCB7IG9wdGlvbnMsIGN5IH0gPSB0aGlzO1xuXG4gIHRoaXMuYWRkTGlzdGVuZXIoJ2dyYWInLCAnbm9kZScsIGUgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSBlLnRhcmdldDtcblxuICAgIGlmKCBpc1BhcmVudChub2RlKSApeyByZXR1cm47IH1cblxuICAgIHRoaXMuaW5HZXN0dXJlID0gdHJ1ZTtcbiAgICB0aGlzLmdyYWJiZWROb2RlID0gbm9kZTtcbiAgICB0aGlzLmJvdW5kc1R1cGxlcyA9IGN5Lm5vZGVzKCkubm90KG5vZGUpLm1hcChnZXRCb3VuZHNUdXBsZSk7XG4gICAgdGhpcy5zaWJsaW5nID0gY3kuY29sbGVjdGlvbigpO1xuICAgIHRoaXMucGFyZW50ID0gY3kuY29sbGVjdGlvbigpO1xuXG4gICAgLy8gaWYoIGlzQ2hpbGQobm9kZSkgKXtcbiAgICAvLyAgIHJlbW92ZVBhcmVudChub2RlKTtcbiAgICAvLyB9XG4gIH0pO1xuXG4gIHRoaXMuYWRkTGlzdGVuZXIoJ2RyYWcnLCAnbm9kZScsIGUgPT4ge1xuICAgIGlmKCAhdGhpcy5pbkdlc3R1cmUgKXsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBub2RlID0gZS50YXJnZXQ7XG4gICAgY29uc3QgYmIgPSBub2RlLmJvdW5kaW5nQm94KCk7XG4gICAgY29uc3Qgb3ZlcmxhcHBpbmdOb2RlcyA9IHRoaXMuYm91bmRzVHVwbGVzLmZpbHRlcih0ID0+IGJvdW5kc092ZXJsYXAoYmIsIHQuYmIpKS5tYXAodCA9PiB0Lm5vZGUpO1xuXG4gICAgdGhpcy5zaWJsaW5nID0gY3kuY29sbGVjdGlvbigpO1xuICAgIHRoaXMucGFyZW50ID0gY3kuY29sbGVjdGlvbigpO1xuXG4gICAgaWYoIG92ZXJsYXBwaW5nTm9kZXMubGVuZ3RoID4gMCApe1xuICAgICAgY29uc3Qgb3ZlcmxhcHBpbmdQYXJlbnRzID0gb3ZlcmxhcHBpbmdOb2Rlcy5maWx0ZXIoaXNQYXJlbnQpO1xuXG4gICAgICBpZiggb3ZlcmxhcHBpbmdQYXJlbnRzLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgdGhpcy5zaWJsaW5nID0gY3kuY29sbGVjdGlvbigpO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG92ZXJsYXBwaW5nUGFyZW50c1swXTsgLy8gVE9ETyBzZWxlY3QgcGFydGljdWxhciBvbmUgYnkgbWV0cmljXG5cbiAgICAgICAgLy8gVE9ETyBldmVudCAmIHN0eWxlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNpYmxpbmcgPSBvdmVybGFwcGluZ05vZGVzWzBdOyAvLyBUT0RPIHNlbGVjdCBieSBtZXRyaWNcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBjeS5jb2xsZWN0aW9uKCk7XG5cbiAgICAgICAgLy8gVE9ETyBldmVudCAmIHN0eWxlXG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB0aGlzLmFkZExpc3RlbmVyKCdmcmVlJywgJ25vZGUnLCBlID0+IHtcbiAgICBpZiggIXRoaXMuaW5HZXN0dXJlICl7IHJldHVybjsgfVxuXG4gICAgY29uc3Qgbm9kZSA9IGUudGFyZ2V0O1xuXG4gICAgaWYoIHRoaXMucGFyZW50Lm5vbmVtcHR5KCkgKXtcbiAgICAgIHNldFBhcmVudChub2RlLCB0aGlzLnBhcmVudCk7XG5cbiAgICAgIC8vIFRPRE8gZXZlbnRcbiAgICB9IGVsc2UgaWYoIHRoaXMuc2libGluZy5ub25lbXB0eSgpICl7XG4gICAgICBjb25zdCBwYXJlbnQgPSBjeS5hZGQoeyBncm91cDogJ25vZGVzJyB9KTsgLy8gVE9ETyBwYXJhbWV0ZXJpc2VcblxuICAgICAgc2V0UGFyZW50KHRoaXMuc2libGluZywgcGFyZW50KTtcbiAgICAgIHNldFBhcmVudChub2RlLCBwYXJlbnQpO1xuXG4gICAgICAvLyBUT0RPIGV2ZW50XG4gICAgfVxuXG4gICAgdGhpcy5zaWJsaW5nID0gY3kuY29sbGVjdGlvbigpO1xuICAgIHRoaXMucGFyZW50ID0gY3kuY29sbGVjdGlvbigpO1xuICAgIHRoaXMuaW5HZXN0dXJlID0gZmFsc2U7XG4gIH0pO1xufTtcblxuY29uc3QgcmVtb3ZlTGlzdGVuZXJzID0gZnVuY3Rpb24oKXtcbiAgY29uc3QgeyBjeSB9ID0gdGhpcztcblxuICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGxpcyA9PiB7XG4gICAgY29uc3QgeyBldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrIH0gPSBsaXM7XG5cbiAgICBpZiggc2VsZWN0b3IgPT0gbnVsbCApe1xuICAgICAgY3kucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3kucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjayk7XG4gICAgfVxuICB9KTtcblxuICB0aGlzLmxpc3RlbmVycyA9IFtdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7IGFkZExpc3RlbmVyLCBhZGRMaXN0ZW5lcnMsIHJlbW92ZUxpc3RlbmVycyB9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb3VuZC1kcmFnLWFuZC1kcm9wL2xpc3RlbmVycy5qcyIsImZ1bmN0aW9uIGVuYWJsZSgpe1xuICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBkaXNhYmxlKCl7XG4gIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgZW5hYmxlLCBkaXNhYmxlIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG91bmQtZHJhZy1hbmQtZHJvcC90b2dnbGUuanMiLCJjb25zdCBpbXBsID0gcmVxdWlyZSgnLi9jb21wb3VuZC1kcmFnLWFuZC1kcm9wJyk7XG5cbi8vIHJlZ2lzdGVycyB0aGUgZXh0ZW5zaW9uIG9uIGEgY3l0b3NjYXBlIGxpYiByZWZcbmxldCByZWdpc3RlciA9IGZ1bmN0aW9uKCBjeXRvc2NhcGUgKXtcbiAgaWYoICFjeXRvc2NhcGUgKXsgcmV0dXJuOyB9IC8vIGNhbid0IHJlZ2lzdGVyIGlmIGN5dG9zY2FwZSB1bnNwZWNpZmllZFxuXG4gIGN5dG9zY2FwZSggJ2NvcmUnLCAnY29tcG91bmREcmFnQW5kRHJvcCcsIGltcGwgKTsgLy8gcmVnaXN0ZXIgd2l0aCBjeXRvc2NhcGUuanNcbn07XG5cbmlmKCB0eXBlb2YgY3l0b3NjYXBlICE9PSAndW5kZWZpbmVkJyApeyAvLyBleHBvc2UgdG8gZ2xvYmFsIGN5dG9zY2FwZSAoaS5lLiB3aW5kb3cuY3l0b3NjYXBlKVxuICByZWdpc3RlciggY3l0b3NjYXBlICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9