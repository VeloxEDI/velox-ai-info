---
title: Elements
description: Returns a borrowed immediate element by zero-based filtered index, or nil when the receiver or index has no such element.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, elements, index, borrowed-reference]
---

```Delphi
property Elements[Index: Integer]: TXMLNode read;
```

### Example

```Delphi
procedure MarkElements(Node: TXMLNode);
var
  I: Integer;
  Child: TXMLNode;
begin
  if Node = nil then Exit;

  for I := 0 to Node.ElementCount - 1 do
  begin
    Child := Node.Elements[I];
    if Child <> nil then
      Child.Value := 'Processed';
  end;
end;
```

### Usage

`Elements` returns a borrowed immediate element by zero-based filtered index, or nil when the receiver or index has no such element.

### Additional Technical Info
`Elements` returns the `Index`th immediate child whose native runtime class is an ordinary `TsdElement`. The index is zero-based within this filtered view, not within the container's full node list.

Attributes, text, whitespace, comments, CDATA and structural nodes are skipped. The scan does not recurse. Use [`ElementCount`](ElementCount.md) for the valid range and [`FindNode`](../Methods/FindNode.md) for descendant search.

The native getter returns nil for a negative index, an index at or above ElementCount, a non-container receiver, or any scan that does not find that filtered element. It does not raise a bounds exception for those ordinary cases. The importer widens the native `TsdElement` result to `TXMLNode`, so only the common scripting surface is available.

The returned reference is borrowed and document-owned. Do not Free it. Removing/replacing children, clearing/loading the document or freeing it can invalidate both the reference and the meaning of later filtered indices.

Each access scans from the start of the relevant immediate list until it reaches the requested filtered index. Iterating `Elements[I]` for every I can therefore become quadratic for a large list. This is normally acceptable for modest configuration XML; avoid repeated indexed scans for very large documents.

The example is source-reviewed only; no element value was changed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - filtered element getter and nil bounds behavior.
- [W3C XML Information Set](https://www.w3.org/TR/xml-infoset/) - ordered element content and other information-item kinds.

<small>Created 2026-07-15</small>
