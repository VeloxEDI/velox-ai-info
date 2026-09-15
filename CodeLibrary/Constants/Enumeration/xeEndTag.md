---
title: xeEndTag
description: Identifies NativeXML's transient end-tag sentinel, for which no persistent node class is mapped or returned to scripts.
sidebar_position: 202
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, end-tag, sentinel]
---

```Delphi
xeEndTag = 16
```

### Example

```Delphi
function IsParserSentinel(Kind: TsdElementType): Boolean;
begin
  Result := Kind = xeEndTag;
end;
```

### Usage

`xeEndTag` identifies Velox XML's transient end-tag sentinel, for which no persistent node class is mapped or returned to scripts.

### Additional Technical Info
`xeEndTag` is NativeXML's parser and binary-format signal for a closing tag. It is not a persistent `TXMLNode` kind in the document tree: the node-class table maps this enum member to `nil`.

During text parsing, `</...>` is classified as this kind so the recursive parser can finish the current element. During binary reading, the ordinal terminates the current child list and returns no node. A valid borrowed script node should therefore never have `Node.ElementType = xeEndTag`.

Do not use this value to search for closing-tag nodes or infer serialized structure from tree children. XML elements represent their start tag, content and matching end tag as one [`xeElement`](xeElement.md) object. The example compares an enum value only and does not imply that scripts can obtain a persistent sentinel node.

**External references**

- [W3C XML end-tags](https://www.w3.org/TR/xml/#ETag)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
