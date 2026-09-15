---
title: ElementCount
description: Returns the number of immediate native element children after filtering attributes, text and other raw node kinds.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, elements, count, children]
---

```Delphi
property ElementCount: Integer read;
```

### Example

```Delphi
procedure ReadLastElement(Node: TXMLNode);
var
  LastElement: TXMLNode;
begin
  if (Node = nil) or (Node.ElementCount = 0) then Exit;
  LastElement := Node.Elements[Node.ElementCount - 1];
end;
```

### Usage

`ElementCount` returns the number of immediate Velox element children after filtering attributes, text and other raw node kinds.

### Additional Technical Info
`ElementCount` scans a concrete container's immediate child list and counts objects whose native runtime class is `TsdElement`. It does not recurse.

Attributes, character data, whitespace, comments, CDATA, declarations, DTD nodes and processing instructions do not count. DTD element declarations are structural `TsdDtdElement` nodes, not ordinary `TsdElement` objects, so they are excluded despite their similar name.

Use the zero-based [`Elements`](Elements.md) property for indices from `0` through `ElementCount - 1`. This filtered index is not the raw node-list index returned by [`NodeAdd`](../Methods/NodeAdd.md), because raw nodes can occur between elements.

Non-container node kinds use the base implementation and return zero. A zero result can therefore mean an empty element, a container with only non-element content, or a non-container node. Check [`ElementType`](../Methods/ElementType.md) if that distinction matters.

The result is recalculated on every read by scanning relevant immediate nodes; it is not a stable snapshot. Structural mutation changes it immediately. Reading it inside a loop condition repeatedly rescans the list, so cache the count when the tree will not change and the list is large.

The property has no side effect and returns no owned object.

The example is source-reviewed only; no element was read.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - native `TsdElement` filtering implementation.
- [W3C XML element structure](https://www.w3.org/TR/xml/#sec-starttags) - ordinary XML elements and content.

<small>Created 2026-07-15</small>
