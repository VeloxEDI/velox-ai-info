---
title: ElementType
description: Returns the virtual NativeXML node-kind enumeration value for the concrete node referenced through TXMLNode.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, element-type, enumeration, polymorphism]
---

```Delphi
function ElementType: TsdElementType;
```

### Example

```Delphi
procedure SetElementValue(Node: TXMLNode);
begin
  if (Node <> nil) and (Node.ElementType = xeElement) then
    Node.Value := 'Ready';
end;
```

### Usage

`ElementType` returns the Velox XML node-kind enumeration value for the node referenced through TXMLNode.

### Additional Technical Info
`ElementType` identifies the concrete NativeXML node kind behind a `TXMLNode` reference. The base implementation returns `xeError`, but the concrete document-created descendants override it, so normal nodes return their actual kind.

The script-visible `TsdElementType` values, in ordinal order, are `xeElement`, `xeAttribute`, `xeCharData`, `xeComment`, `xeCData`, `xeCondSection`, `xeDeclaration`, `xeStylesheet`, `xeDocType`, `xeDtdElement`, `xeDtdAttList`, `xeDtdEntity`, `xeDtdNotation`, `xeInstruction`, `xeWhiteSpace`, `xeQuotedText`, `xeEndTag` and `xeError`.

Use this method before reading a returned node as an element. Whole-document traversal and name lookup can return attributes, text, comments and structural nodes. [`ElementCount`](../Properties/ElementCount.md) and [`Elements`](../Properties/Elements.md) are the element-only alternatives for immediate children.

`xeEndTag` is chiefly a parser/binary-format signal and is not normally retained as a document node. `xeError` means the unoverridden/unknown path; do not treat it as a normal XML element.

The result is computed from the object's runtime class and has no side effect. It does not validate whether the node reference is still live; calling through a stale reference remains unsafe.

[`ElementTypeName`](ElementTypeName.md) maps the result to NativeXML's fixed English display string. Compare the enumeration value for program logic because the name is descriptive, not a serialized XML token.

The example is source-reviewed only; no node value was changed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - concrete node classes and `TsdElementType` mapping.
- [W3C XML Information Set](https://www.w3.org/TR/xml-infoset/) - XML information-item categories.

<small>Created 2026-07-15</small>
