---
title: HasAttribute
description: Reports whether the node has an immediate attribute whose UTF-8 name exactly matches the supplied case-sensitive name.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, attribute, name, case-sensitive]
---

```Delphi
function HasAttribute(const AName: UTF8String): Boolean;
```

### Example

```Delphi
procedure CheckIdentifier(Node: TXMLNode);
var
  HasId: Boolean;
begin
  HasId := (Node <> nil) and Node.HasAttribute('id');
end;
```

### Usage

`HasAttribute` reports whether the node has an immediate attribute whose UTF-8 name exactly matches the supplied case-sensitive name.

### Additional Technical Info
`HasAttribute` scans the receiver's immediate attribute view and returns true when an attribute Name equals `AName` using the Delphi `=` operator.

The comparison is case-sensitive and byte-sensitive. `id` and `ID` are different, which follows XML's case-sensitive naming rule. This differs from [`FindNode`](FindNode.md) and [`NodeByName`](NodeByName.md), which use NativeXML's case-insensitive comparison. Preserve the exact source spelling.

Only actual attribute nodes exposed through NativeXML's attribute filter are considered. Child elements with the same Name do not count. A non-container node normally has zero attributes and returns false. An empty name returns true only if an invalid/constructed empty-name attribute is present; the method performs no XML name validation.

The scripting surface exposes this existence check but not the native attribute collection/value properties. It therefore cannot retrieve the matching value through `TXMLNode` alone. Use this method as a guard or classify the limitation in the surrounding flow design.

The operation is linear in the immediate attribute count, allocates no caller-owned object and does not change the tree. The node must still be live.

The example is source-reviewed only; no attribute list was scanned.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - attribute filtering and exact-name comparison implementation.
- [W3C XML attributes](https://www.w3.org/TR/xml/#sec-starttags) - attribute syntax and name rules.

<small>Created 2026-07-15</small>
