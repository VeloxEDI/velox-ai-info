---
title: xeWhiteSpace
description: Identifies a NativeXML whitespace-only character node, normally removed by compact parsing and not configurable through the Velox wrapper.
sidebar_position: 207
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, whitespace, text]
---

```Delphi
xeWhiteSpace = 14
```

### Example

```Delphi
function IsWhitespaceNode(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeWhiteSpace);
end;
```

### Usage

`xeWhiteSpace` identifies a Velox XML whitespace-only character node, normally removed by compact parsing and not configurable through the Velox function.

### Additional Technical Info
`xeWhiteSpace` identifies NativeXML's whitespace-only subclass of [`xeCharData`](xeCharData.md). The parser creates this distinct kind for some preserved non-default blank runs in container syntax, including attribute and DOCTYPE lists.

Velox's `TNativeXML` wrapper does not expose NativeXML's `PreserveWhitespace` or `XmlFormat` setting. The vendor default is compact mode: whitespace nodes are normally removed and adjacent character data is trimmed during parsing. Code should therefore not rely on receiving indentation or line-break nodes through the standard Velox API.

Ordinary text between element tags follows a different code path: it is created as [`xeCharData`](xeCharData.md) after right-trimming, even in the relevant element parser. Enabling native preservation would therefore not mean that every indentation run becomes `xeWhiteSpace`.

When a whitespace node is present, raw traversal can return it and an element's [`Value`](../../Classes/XML/TXMLNode/Properties/Value.md) includes its immediate text. Element-only accessors exclude it. An element containing any whitespace node is also outside the simple shape accepted by that element's `Value` setter, so assigning the parent value can raise rather than flattening the mixed content.

Whitespace at the start of otherwise non-whitespace character data can remain part of [`xeCharData`](xeCharData.md); the classifications are not equivalent to every leading or trailing space. Borrowed node references expire when the owning document is cleared, reloaded or destroyed.

**External references**

- [W3C XML white space handling](https://www.w3.org/TR/xml/#sec-white-space)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
