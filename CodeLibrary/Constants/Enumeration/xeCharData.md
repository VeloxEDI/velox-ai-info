---
title: xeCharData
description: Identifies NativeXML character data with escaped core storage, resolved reads and right-trimmed element parsing.
sidebar_position: 192
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, text, character-data]
---

```Delphi
xeCharData = 2
```

### Example

```Delphi
function IsTextNode(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeCharData);
end;
```

### Usage

`xeCharData` identifies Velox XML character data with escaped core storage, resolved reads and right-trimmed element parsing.

### Additional Technical Info
`xeCharData` identifies ordinary character data between XML tags. It is a raw child node rather than an element, so element-only access excludes it even though a parent element's `Value` includes it.

NativeXML stores an escaped, normalised core string. Reading the script-visible `Value` resolves standard entity/reference escapes and restores the configured line-ending style. Assigning `Value` normalises line endings and escapes XML-special characters before storage.

**Parsing and mixed-content quirks**

Inside an element, NativeXML right-trims every text segment before constructing its CharData node. Leading whitespace remains in a non-empty segment, but trailing XML whitespace is lost even before script code sees the node. At document root, compact-mode parsing trims both ends and discards an all-whitespace segment.

A parent element's `Value` concatenates immediate CharData, WhiteSpace and CDATA values. It excludes nested element text, comments and processing instructions. It is therefore not a recursive XPath-style string value.

The parent `Value` setter accepts at most one ordinary CharData node and refuses the update when CDATA/WhiteSpace or multiple CharData nodes are present. Directly mutating the intended raw node avoids replacing the wrong mixed-content segment, but can still change document semantics.

**Traversal and lifetime**

Raw traversal can return text nodes and name-based search can encounter their fixed diagnostic name `Text`. Always check ElementType. Borrowed nodes are owned by the `TNativeXML` document and become invalid after clear, reload or free.

**External references**

- [W3C XML character data](https://www.w3.org/TR/xml/#syntax)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
