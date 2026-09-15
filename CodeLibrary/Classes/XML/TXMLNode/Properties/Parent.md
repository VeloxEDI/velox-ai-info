---
title: Parent
description: Returns the borrowed current parent node assigned by NativeXML's owning tree, or nil for top-level and detached nodes.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, parent, ownership, borrowed-reference]
---

```Delphi
property Parent: TXMLNode read;
```

### Example

```Delphi
procedure ReadParentName(Node: TXMLNode);
var
  ParentName: UTF8String;
begin
  if (Node <> nil) and (Node.Parent <> nil) then
    ParentName := Node.Parent.Name;
end;
```

### Usage

Returns the borrowed current parent node assigned by Velox XML's owning tree, or nil for top-level and detached nodes.

### Additional Technical Info
`Parent` returns the node pointer currently stored in the native node's `FParent` field. [`NodeAdd`](../Methods/NodeAdd.md) sets it to the receiving container.

Top-level document nodes, including [`TNativeXML.Root`](../../TNativeXML/Properties/Root.md), have nil Parent because the document's root list is not exposed as a `TXMLNode`. Nodes created by `TNativeXML.NodeNew` or NodeNewText also have nil Parent until attached.

The result is borrowed and owned by the document tree. Do not Free it. Clearing/loading/freeing the document or deleting ancestors invalidates it and the original node. Re-read Parent after structural mutation.

The property is read-only to scripts, but that does not make the relationship defensively safe. Generic NodeAdd overwrites Parent without first removing the node from an old owning list or checking document identity/cycles. If that method is misused, Parent can disagree with the list that still owns the node. Navigation, FullPath, serialization and destruction can then fail or operate on corrupted topology.

Native extraction outside the exposed scripting surface can also remove a pointer from a list without clearing its Parent field. Treat Parent as trustworthy only for trees constructed through the documented attach-once pattern.

Use `Node.Parent.NextSibling(Node)` for a normal attached child after nil checks. Do not use Parent as a durable document identity or synchronization mechanism.

The example is source-reviewed only; no parent was read.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - parent-pointer assignment and owning-list model.
- [W3C XML Information Set](https://www.w3.org/TR/xml-infoset/) - parent/children relationships in an XML information set.

<small>Created 2026-07-15</small>
