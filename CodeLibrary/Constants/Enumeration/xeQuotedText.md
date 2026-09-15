---
title: xeQuotedText
description: Identifies NativeXML's internal quoted-literal node, traversable in some DTD structures but directly owned inside normal attributes.
sidebar_position: 205
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, quoted-text, attribute, dtd]
---

```Delphi
xeQuotedText = 15
```

### Example

```Delphi
function IsQuotedLiteral(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeQuotedText);
end;
```

### Usage

`xeQuotedText` identifies a quoted literal used in some Velox XML DTD structures. Normal attribute values expose their text directly instead of as separate quoted-literal nodes.

### Additional Technical Info
`xeQuotedText` identifies NativeXML's lexical model for a single-quoted or double-quoted literal. The object retains which quote delimiter was parsed so it can serialize using that style.

Normal [`xeAttribute`](xeAttribute.md) values use a quoted-text object owned directly by the attribute. That object is not inserted into the attribute's or element's raw child list and therefore cannot normally be discovered as a separate node. In contrast, quoted tokens parsed inside some DTD structures—especially [`xeDtdEntity`](xeDtdEntity.md)—can be raw traversable child nodes of this type.

Do not assume that every XML quoted value appears as an `xeQuotedText` node, or that element-only accessors will return one. Read normal attribute values through the attribute node. If raw traversal returns this kind, treat it as parser-level syntax associated with its parent and keep the owning document alive.

Generic value changes are not a substitute for validating the surrounding attribute or DTD declaration. Quote retention alone does not guarantee that arbitrary content produces valid XML.

**External references**

- [W3C XML common syntactic constructs](https://www.w3.org/TR/xml/#sec-common-syn)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
