---
title: IsEmpty
description: Tests whether the node has zero immediate nodes of every kind and an empty virtual value, while ignoring its name.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, empty, children, value]
---

```Delphi
function IsEmpty: Boolean;
```

### Example

```Delphi
procedure MarkEmptyElement(Node: TXMLNode);
begin
  if (Node <> nil) and (Node.ElementType = xeElement) and Node.IsEmpty then
    Node.Value := 'Missing';
end;
```

### Usage

`IsEmpty` tests whether the node has zero immediate nodes of every kind and an empty value, while ignoring its name.

### Additional Technical Info
`IsEmpty` returns true only when the native all-node child count is zero and `Length(Value) = 0`. It ignores [`Name`](../Properties/Name.md), so `<Item/>` can be empty while [`IsClear`](IsClear.md) is false.

The child count includes attributes, elements, character data, whitespace, comments, CDATA and structural nodes. A node with no child elements can therefore still be nonempty. [`ElementCount`](../Properties/ElementCount.md) is the separate element-only count.

Value is virtual. For an element it concatenates immediate character-data, whitespace and CDATA child values; for attributes and text-like nodes it uses that node kind's own storage. IsEmpty does not trim text. A whitespace-only value has nonzero length and is not empty.

The test is shallow: it does not inspect whether child elements are themselves empty. It also does not indicate whether the element will use `<Name/>` or paired tags because closing style is a separate native setting not exposed here.

The operation has no side effect. Cost is normally constant for the hidden NodeCount plus the cost of calculating the virtual Value; element Value scans and concatenates relevant immediate children, so it can allocate proportionally to text size.

The example is source-reviewed only; no element value was changed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - `IsEmpty`, node-count and virtual-value implementation.
- [W3C XML empty-element tags](https://www.w3.org/TR/xml/#sec-starttags) - XML empty-element syntax, distinct from this API predicate.

<small>Created 2026-07-15</small>
