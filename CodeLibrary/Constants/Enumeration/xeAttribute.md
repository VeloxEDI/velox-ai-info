---
title: xeAttribute
description: Identifies a NativeXML attribute node stored in a container's raw direct-node list but excluded from element-only access.
sidebar_position: 190
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, attribute, node]
---

```Delphi
xeAttribute = 1
```

### Example

```Delphi
function IsAttributeNode(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeAttribute);
end;
```

### Usage

`xeAttribute` identifies a Velox XML attribute node stored in a container's raw direct-node list but excluded from element-only access.

### Additional Technical Info
`xeAttribute` identifies NativeXML's concrete attribute node. Parsed attributes are inserted at the start of their owning container's raw node list, before ordinary content. They are not child elements.

[`ElementCount`](../../Classes/XML/TXMLNode/Properties/ElementCount.md) and [`Elements`](../../Classes/XML/TXMLNode/Properties/Elements.md) exclude attributes, while raw traversal and name lookup can return them. Check [`ElementType`](../../Classes/XML/TXMLNode/Methods/ElementType.md) before treating a result from `FindFirst`, `FindNext`, `FindNode`, `NodeByName` or sibling navigation as an element.

**Name, value and quoting**

An attribute stores its name plus an owned quoted-text object. Reading `Value` resolves XML entity/reference escapes and platform line endings. Writing `Value` escapes XML-special characters before serialization and retains the internal single-quote or double-quote style parsed for the value.

The quoted-text object used for a normal attribute is owned directly by the attribute rather than inserted as a separately traversable child. [`xeQuotedText`](xeQuotedText.md) can still appear as a raw node inside some DTD structures.

The broad script wrapper exposes `Name` and `Value` read/write for every node kind. NativeXML does not turn that into XML-schema validation: assigning an invalid attribute name or creating duplicate names can produce invalid or ambiguous output. Keep the document alive while using the borrowed node and do not retain it across clear, reload or document destruction.

**Related entries**

- [`xeElement`](xeElement.md) identifies ordinary element nodes.
- [`TsdElementType`](../../Types/Enumerations/TsdElementType.md) lists every raw node kind.

**External references**

- [W3C XML attributes and start-tags](https://www.w3.org/TR/xml/#sec-starttags)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
