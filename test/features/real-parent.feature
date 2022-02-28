Feature: Real Parent
  Dragging one node over another creates a parent node with a class "cdnd-new-parent".
  The fake parent is removed after all its children are pulled outside of it.

  Instead of using a fake parent we can chose to make the dropTarget node the parent for the compound.
  This is done using the newParentNode function.


  Background:
    Given I have opened the cytoscape canvas
    And I set the newParentNode function to
    """
      (grabbedNode, dropTarget) => {
        return dropTarget;
      }
    """

  Rule: Dragging a node over another node transforms the drop target to a compound node
    Example: Drag a node over a sibling nodes
      Given I have the following nodes
        | Node | Parent |
        | a    |        |
        | b    |        |
      When I drag node "a" over node "b"
      Then Node "b" becomes a compound node
      And Node "a" becomes a child of node "b"

    Example: Drag a node over a node that is already a parent
      Given I have the following nodes
        | Node | Parent |
        | a    |        |
        | b    | a      |
        | c    |        |
      When I drag node "c" over node "a"
      And Node "c" becomes a child of node "a"

  Rule: Dragging the last node out of a real parent preserves the parent
    Example: Removing the last child from a pre-existing compound
      Given I have the following nodes
        | Node | Parent |
        | a    |        |
        | b    | a      |
      When I drag node "b" outside of node "a"
      Then Node "a" is no longer a compound node
      And Node "a" is no longer the parent of node "b"

