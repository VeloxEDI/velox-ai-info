---
title: NodeAdd
description: Appends a node to a concrete container's owning raw-node list and sets Parent without defensive ownership or cycle checks.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, add, ownership, parent, mutation]
---

```Delphi
function NodeAdd(ANode: TXMLNode): Integer;
```

### Example

```Delphi
procedure AddStatus(Xml: TNativeXML);
var
  StatusNode: TXMLNode;
  NodeIndex: Integer;
begin
  if Xml.Root = nil then Exit;

  StatusNode := Xml.NodeNewText('Status', 'Ready');
  NodeIndex := Xml.Root.NodeAdd(StatusNode);
  // StatusNode is now owned by Xml.Root; do not Free it.
end;
```

### Usage

`NodeAdd` appends a node to a container's owning raw-node list and sets Parent without defensive ownership or cycle checks.

### Additional Technical Info
`NodeAdd` appends `ANode` to a concrete NativeXML container's raw owning list, sets `ANode.Parent` to the receiver and returns the zero-based raw-list index. Ordinary element nodes are containers. A non-container node uses the base implementation and raises `Cannot add node`.

Passing nil to a container returns `-1` and makes no change. A successful result counts every node kind, not just elements, so it need not equal `ElementCount - 1`.

Use this method for a node made by [`TNativeXML.NodeNew`](../../TNativeXML/Methods/NodeNew.md) or [`NodeNewText`](../../TNativeXML/Methods/NodeNewText.md), and attach it exactly once within the same document. After success, the container's object list owns the node; do not Free it separately.

#### Critical ownership constraints

The container override does not verify that the node belongs to the same `TNativeXML`, is currently detached, is absent from other owning lists, or would not create an ancestor cycle. It simply appends the pointer and overwrites Parent.

Adding an already attached node leaves the old list still owning the same pointer, which can cause double destruction. Adding a cross-document node leaves its owner/symbol-table association with the original document while another document list owns it. Adding an ancestor beneath its descendant can make recursive path/search/write operations nonterminating and can corrupt destruction. These are caller-enforced invariants.

Although the native comment says attributes should be placed before other nodes, generic NodeAdd always appends. The specialized native AttributeAdd path maintains attribute ordering but is not exposed here. Do not use generic script-created nodes as synthetic attributes; the exposed document factories create elements.

The method performs no XML name, hierarchy, namespace, schema or document-element validation. A mutation is immediate and has no rollback if later processing fails. Stored child/sibling references and iteration order can change.

The example is source-reviewed only; no node was allocated or attached.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - owning node-list and Parent assignment implementation.
- [W3C XML document structure](https://www.w3.org/TR/xml/#sec-documents) - XML structural constraints that NodeAdd itself does not enforce.

<small>Created 2026-07-15</small>
