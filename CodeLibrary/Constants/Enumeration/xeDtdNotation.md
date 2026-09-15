---
title: xeDtdNotation
description: Identifies NativeXML's lightweight raw representation of a NOTATION declaration in a document-type internal subset.
sidebar_position: 200
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, dtd, notation]
---

```Delphi
xeDtdNotation = 12
```

### Example

```Delphi
function IsNotationDeclaration(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeDtdNotation);
end;
```

### Usage

`xeDtdNotation` identifies Velox XML's lightweight raw representation of a NOTATION declaration in a document-type internal subset.

### Additional Technical Info
`xeDtdNotation` identifies a parsed `<!NOTATION ...>` declaration within a [`xeDocType`](xeDocType.md) internal subset.

NativeXML separates the notation name and stores the rest of the declaration largely as raw character data through `>`. It does not expose a complete script-visible semantic model or perform comprehensive DTD validation. A node of this type is therefore useful for classification and diagnostics, not proof that its `SYSTEM` or `PUBLIC` identifier is valid or usable.

The node is excluded by element-only accessors but can be encountered through raw traversal and searches. Broad `Name` and `Value` setters do not validate notation grammar; arbitrary edits may serialize malformed XML. External identifiers should be treated as data, not automatic authority to access a resource.

This is a borrowed node owned by its document and becomes invalid after clear, reload or destruction.

**External references**

- [W3C XML notation declarations](https://www.w3.org/TR/xml/#Notations)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
