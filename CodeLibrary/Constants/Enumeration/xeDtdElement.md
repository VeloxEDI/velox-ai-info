---
title: xeDtdElement
description: Identifies NativeXML's lightweight representation of an ELEMENT declaration inside a document-type internal subset.
sidebar_position: 198
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, dtd, element-declaration]
---

```Delphi
xeDtdElement = 9
```

### Example

```Delphi
function IsElementDeclaration(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeDtdElement);
end;
```

### Usage

`xeDtdElement` identifies Velox XML's lightweight representation of an ELEMENT declaration inside a document-type internal subset.

### Additional Technical Info
`xeDtdElement` identifies a parsed `<!ELEMENT ...>` declaration inside a [`xeDocType`](xeDocType.md) internal subset. It describes a DTD content model; it is not an ordinary document [`xeElement`](xeElement.md).

NativeXML parses the declared element name and retains the remaining content-model text largely as raw character data through the closing `>`. It does not expose or validate a complete grammar tree for sequences, choices, occurrence indicators or mixed content. Seeing this node therefore confirms only that the parser classified the declaration, not that the DTD or document is valid.

Element-only accessors exclude DTD declarations; raw traversal can expose them. Although the shared script wrapper exposes `Name` and `Value` setters, NativeXML does not validate arbitrary replacement text. Avoid using generic setters to synthesise DTD declarations unless the resulting XML is validated independently.

This is a document-owned borrowed node. Its reference is invalid after document clear, reload or destruction.

**External references**

- [W3C XML element declarations](https://www.w3.org/TR/xml/#elemdecls)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
