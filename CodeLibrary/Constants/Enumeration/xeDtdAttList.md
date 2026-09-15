---
title: xeDtdAttList
description: Identifies NativeXML's lightweight representation of an ATTLIST declaration inside a document-type internal subset.
sidebar_position: 197
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, dtd, attlist]
---

```Delphi
xeDtdAttList = 10
```

### Example

```Delphi
function IsAttributeListDeclaration(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeDtdAttList);
end;
```

### Usage

`xeDtdAttList` identifies Velox XML's lightweight representation of an ATTLIST declaration inside a document-type internal subset.

### Additional Technical Info
`xeDtdAttList` identifies a parsed `<!ATTLIST ...>` declaration in a [`xeDocType`](xeDocType.md) internal subset. It is a DTD declaration node, not an [`xeAttribute`](xeAttribute.md) attached to an ordinary element.

The NativeXML parser separates the declared element name, then retains the remainder of the declaration largely as raw character data until `>`. It does not expose a complete script-visible model of attribute definitions, types, defaults or constraints and should not be treated as a DTD validator.

Raw traversal can expose this node; element-only [`ElementCount`](../../Classes/XML/TXMLNode/Properties/ElementCount.md) and [`Elements`](../../Classes/XML/TXMLNode/Properties/Elements.md) exclude it. The generic wrapper permits broad `Name` and `Value` assignments, but invalid names, malformed declaration text or an embedded closing delimiter can produce invalid XML output. Prefer reading the node diagnostically rather than rewriting DTD syntax through generic setters.

The node is borrowed from its owning document and becomes invalid when that document is cleared, reloaded or destroyed.

**External references**

- [W3C XML attribute-list declarations](https://www.w3.org/TR/xml/#attdecls)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
