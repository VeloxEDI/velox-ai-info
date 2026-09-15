---
title: FindFirst
description: Returns the first top-level node in document order, which can be a declaration or other prolog node rather than the root element.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, traversal, document-order, node]
---

```Delphi
function FindFirst: TXMLNode;
```

### Example

```Delphi
procedure VisitAllNodes(Xml: TNativeXML);
var
  Node: TXMLNode;
begin
  if Xml = nil then Exit;

  Node := Xml.FindFirst;
  while Node <> nil do
  begin
    Node := Xml.FindNext(Node);
  end;
end;
```

### Usage

`FindFirst` returns the first top-level node in document order, which can be a declaration or other prolog node rather than the root element.

### Additional Technical Info
`FindFirst` returns item zero from the document's owned root-node list, or nil when that list is empty. It is the starting point for [`FindNext`](FindNext.md) depth-first traversal.

"First" means first node in serialized document order, not first element. A document created by [`New`](New.md) normally returns its XML declaration first. Loaded content can begin with a declaration, comment, stylesheet or doctype. A default document made by Create returns its unnamed root because that is its only top-level node.

Use [`Root`](../Properties/Root.md) when the goal is specifically the first top-level XML element. Use FindFirst/FindNext when declarations, attributes, text, comments and other node kinds must also be visited.

The returned node is borrowed and owned by the document tree. Clear, New, any Load operation or freeing the document invalidates it. Tree mutation during traversal can change order or destroy the current/next node; do not mutate structurally until traversal completes unless the mutation algorithm is explicitly designed around these ownership rules.

FindFirst performs no parsing or allocation and does not filter node types. An internal uninitialized root-list reference would return nil, although a successfully constructed document always allocates the list.

The example is source-reviewed only; no traversal was executed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream traversal implementation lineage.
- [W3C XML Information Set](https://www.w3.org/TR/xml-infoset/) - document information items and document order context.

<small>Created 2026-07-15</small>
