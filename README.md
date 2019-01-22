cytoscape-compound-drag-and-drop
================================================================================

**This extension is a work-in-progress.  It has not been released, and it should not be used in production yet.**

## Description

Drag-and-drop UI for creating and editing the children of compound parent nodes ([demo](https://cytoscape.github.io/cytoscape.js-compound-drag-and-drop))

This extension allows the user to drag a node over top of another node to create or add to compound parent nodes.  When dragging and dropping an orphan node over a parent node, the orphan is added to the parent.  When dragging and dropping an orphan node over another orphan node, both orphan nodes are added to a newly created parent.

## Dependencies

 * Cytoscape.js ^3.3.0


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-compound-drag-and-drop`,
 * via bower: `bower install cytoscape-compound-drag-and-drop`, or
 * via direct download in the repository (probably from a tag).

Import the library as appropriate for your project:

ES import:

```js
import cytoscape from 'cytoscape';
import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop';

cytoscape.use( compoundDragAndDrop );
```

CommonJS require:

```js
let cytoscape = require('cytoscape');
let compoundDragAndDrop = require('cytoscape-compound-drag-and-drop');

cytoscape.use( compoundDragAndDrop ); // register extension
```

AMD:

```js
require(['cytoscape', 'cytoscape-compound-drag-and-drop'], function( cytoscape, compoundDragAndDrop ){
  compoundDragAndDrop( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## API

Create an instance of the drag-and-drop UI:

```js
const cdnd = cy.compoundDragAndDrop(options);
```

The `options` object is outlined below with the default values:

```js
const options = {
  // TODO
};
```

There are a number of functions available on the `cdnd` object:

```js
cdnd.disable(); // disables the UI

cdnd.enable(); // re-enables the UI

cdnd.split(nodes); // split nodes from their parents

cdnd.split(parents); // split up all children in each parent

// TODO
cdnd.join(nodes); // join nodes into a single parent

cdnd.destroy(); // removes the UI
```

## Events

These events are emitted by the extension during its gesture cycle.

- `cdndover` : Emitted on a grabbed node when it is dragged over top of a drop target node, potentially creating or adding to a compound.  If enabled, a preview is shown on `cdndover`.
  - `grabbedNode.on('cdndover', (event, dropTargetNode) => {})`
- `cdndout` : Emmitted on a grabbed node when it is dragged off of a drop target node, cancelling the drag-and-drop gesture.
  - `grabbedNode.on('cdndout, (event, dropTargetNode) => {})`
- `cdnddrop` : Emitted on a grabbed node when it is dropped (freed) over a drop target node.  If the drop target is a parent, then the grabbed node is added to the parent.  If the drop target is not a parent, then the grabbed node and the drop target node are added to a new parent.
  - `droppedNode.on('cdnddrop', (event, dropTargetNode, parentNode) => {})`
  - When dropping on a parent node, `parentNode` and `dropTargetNode` are the same.
  - When dropping on a non-parent node, `parentNode` is a new node and `dropTargetNode` and `droppedNode` are made to be the children of `parentNode`.
  - Because changing compound hierarchy necessitates replacing child elements, the references to `droppedNode` and `dropTargetNode` may be different than in other events.  For this reason, it may make sense to use delegate selectors on listeners added to the core, e.g.: `cy.on('cdnddrop', 'node', ({ target: droppedNode }, dropTargetNode, parentNode)) => {}`

## Classes

These classes are applied to

- `cdnd-drop-target` : Applied to a drop target node, while the grabbed node is over it.
- `cdnd-preview` : Applied to a preview node (when `options.preview === true`).  The preview node is automatically sized to simulate the resulant compound bounds on drop.  For best effect, the preview node should be styled similarly to the compound parent nodes it is simulating.
- `cdnd-hidden-parent` : Applied to a drop target node that is a parent, when preview nodes are enabled (i.e. `options.preview === true`).  For best effect, this class should be specified in the stylesheet to hide the node body, label, etc. in order to allow the preview node to visually take its place until the grabbed node is dropped.  Note that `opacity`, `visibility` and `display` are not appropriate for this class, because those properties apply transitively to the descendant elements.

## Caveats

- Compound nodes are supported by this extension only to depth 1.
- The grabbed node may not be a parent.
- Two compound nodes may not be joined together.
- Only one node may be dragged into a compound node at a time.
- Performance may not be very good for large graphs.

## Build targets

* `npm run build` : Build `./src/**` into `cytoscape-compound-drag-and-drop.js`
* `npm run watch` : Automatically build on changes with live reloading (N.b. you must already have an HTTP server running)
* `npm run lint` : Run eslint on the source

N.b. all builds use babel, so modern ES features can be used in the `src`.


## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Build the extension : `npm run build:release`
1. Commit the build : `git commit -am "Build for release"`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Push to origin: `git push && git push --tags`
1. Publish to npm: `npm publish .`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-compound-drag-and-drop https://github.com/cytoscape/cytoscape.js-compound-drag-and-drop.git`
1. [Make a new release](https://github.com/cytoscape/cytoscape.js-compound-drag-and-drop/releases/new) for Zenodo.
