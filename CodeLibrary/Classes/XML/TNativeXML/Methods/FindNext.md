---
title: FindNext
description: Returns the next node in depth-first pre-order across every NativeXML node kind, using a current node from the same document.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, traversal, depth-first, node, document-order]
---

```Delphi
function FindNext(ANode: TXMLNode): TXMLNode;
```

### Example

```Delphi
procedure CountDocumentNodes(Xml: TNativeXML);
var
  Node: TXMLNode;
  Count: Integer;
begin
  Count := 0;
  Node := Xml.FindFirst;
  while Node <> nil do
  begin
    Count := Count + 1;
    Node := Xml.FindNext(Node);
  end;
end;
```

### Usage

`FindNext` returns the next node in depth-first pre-order across every Velox XML node kind, using a current node from the same document.

### Additional Technical Info
`FindNext` advances a whole-document depth-first pre-order traversal. If `ANode` has children, it returns child zero. Otherwise it climbs through parents until it can return a next sibling. It returns nil after the last top-level node or when `ANode` is nil.

Traversal is not element-only. NativeXML container child lists include attributes, character data, whitespace, comments and other structural nodes as well as elements. Use [`ElementType`](../../TXMLNode/Methods/ElementType.md) to filter, and begin with [`FindFirst`](FindFirst.md).

`ANode` must be a live node in this document's graph. A detached node, a stale reference or a node owned by another document can cause a missing-index exception or traverse foreign parent links before failing. The method performs no owner/provenance check at its public boundary.

The result is borrowed. Structural mutation can invalidate the current node, its parent/sibling lists and the next traversal step. Do not add, detach, clear or reload while using the simple loop unless references and order are deliberately recomputed.

The traversal is recursive in data shape but implemented iteratively per call. Repeated calls over `n` nodes are normally linear overall; malformed ownership cycles created outside the normal API could prevent correct termination. The class provides no synchronization.

The example is source-reviewed only; no nodes were counted.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream depth-first traversal implementation lineage.
- [W3C XML Information Set](https://www.w3.org/TR/xml-infoset/) - XML information-item kinds and document organization.

<small>Created 2026-07-15</small>
