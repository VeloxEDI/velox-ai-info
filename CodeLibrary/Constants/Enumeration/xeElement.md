---
title: xeElement
description: Identifies an ordinary NativeXML element, the only node kind created by the Velox XML node factory methods.
sidebar_position: 201
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, element, node]
---

```Delphi
xeElement = 0
```

### Example

```Delphi
function IsOrdinaryElement(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeElement);
end;
```

### Usage

`xeElement` identifies an ordinary Velox XML element, the only node kind created by the Velox XML node factory methods.

### Additional Technical Info
`xeElement` identifies an ordinary XML element. It is the default and most commonly visible NativeXML node kind, and the only kind created by Velox's [`NodeNew`](../../Classes/XML/TNativeXML/Methods/NodeNew.md) and [`NodeNewText`](../../Classes/XML/TNativeXML/Methods/NodeNewText.md) factories. Other node kinds normally enter the model through parsing.

[`ElementCount`](../../Classes/XML/TXMLNode/Properties/ElementCount.md) and [`Elements`](../../Classes/XML/TXMLNode/Properties/Elements.md) include immediate children of this kind only. Raw sibling traversal and searches can also return attributes, comments, text, CDATA, processing instructions and DTD nodes, so test `ElementType` where element-only semantics matter.

**Value behavior and important quirks**

- Reading an element's [`Value`](../../Classes/XML/TXMLNode/Properties/Value.md) concatenates only its immediate [`xeCharData`](xeCharData.md), [`xeWhiteSpace`](xeWhiteSpace.md) and [`xeCData`](xeCData.md) children. It does not recursively include descendant-element text.
- Text parsing right-trims each element text segment. NativeXML's default compact-whitespace mode can therefore make the value differ from a whitespace-preserving DOM.
- Assigning `Value` is allowed only for a narrow simple-content shape. More than one character-data child, or any whitespace or CDATA child, causes the implementation to reject the assignment rather than silently replacing mixed content.
- Generic `Name` assignment does not validate an XML name. Validate names and the serialized result when building XML dynamically.

Nodes returned by parsing, searching or factory calls are document-owned references. Do not keep them across document clear, reload or destruction.

**External references**

- [W3C XML element start-tags](https://www.w3.org/TR/xml/#sec-starttags)
- [W3C XML element end-tags](https://www.w3.org/TR/xml/#ETag)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
