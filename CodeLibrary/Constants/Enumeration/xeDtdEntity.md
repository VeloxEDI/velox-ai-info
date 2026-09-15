---
title: xeDtdEntity
description: Identifies a NativeXML ENTITY declaration whose quoted literals are represented as raw quoted-text child nodes.
sidebar_position: 199
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, dtd, entity]
---

```Delphi
xeDtdEntity = 11
```

### Example

```Delphi
function IsEntityDeclaration(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeDtdEntity);
end;
```

### Usage

`xeDtdEntity` identifies a Velox XML ENTITY declaration whose quoted literals are represented as raw quoted-text child nodes.

### Additional Technical Info
`xeDtdEntity` identifies a parsed `<!ENTITY ...>` declaration inside a [`xeDocType`](xeDocType.md) internal subset. NativeXML stores its declaration content as a lightweight raw model. Unlike a normal attribute's internally owned quoted value, quoted literals in this declaration can appear as traversable [`xeQuotedText`](xeQuotedText.md) child nodes.

This classification does not establish that the entity declaration is safe, resolvable or standards-valid. It also does not document a secure external-entity policy: treat DTD and entity input as untrusted, constrain size and resource use, and do not infer permission to retrieve external resources from a declaration.

Element-only accessors exclude this node, while raw traversal can return it. Generic `Name` and `Value` mutation is not a DTD-aware editor and can create malformed output or change entity semantics unexpectedly. Prefer rejecting or independently validating integrations that depend on editable DTD declarations.

The returned node is borrowed and remains valid only while its owning document and parse remain unchanged.

**External references**

- [W3C XML entity declarations](https://www.w3.org/TR/xml/#sec-entity-decl)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
