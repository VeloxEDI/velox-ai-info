---
title: xeDeclaration
description: Identifies NativeXML's root-level XML declaration container for version, encoding and declaration attributes.
sidebar_position: 195
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, declaration, encoding]
---

```Delphi
xeDeclaration = 6
```

### Example

```Delphi
function IsXMLDeclaration(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeDeclaration);
end;
```

### Usage

`xeDeclaration` identifies Velox XML's root-level XML declaration container for version, encoding and declaration attributes.

### Additional Technical Info
`xeDeclaration` identifies the specialised `<?xml ...?>` declaration node. NativeXML models it as a root-level container whose attributes include values such as `version` and `encoding`; its fixed node name is `xml`.

`TNativeXML.Root` returns the first ordinary [`xeElement`](xeElement.md), not the declaration. Use raw `FindFirst`/`FindNext` traversal when declaration nodes matter, and check the enum before using the broad Name/Value properties.

**Parser and writer behavior**

The declaration parser reads an attribute list, requires the `?>` terminator and specially consumes an immediately following CR/LF pair. The document records the declaration encoding for its parser/writer configuration. Saving writes `<?xml`, the stored attributes, `?>` and the configured separator.

This kind is distinct from a generic [`xeInstruction`](xeInstruction.md) and the specialised [`xeStylesheet`](xeStylesheet.md). It does not represent an element named `xml`.

The broad script wrapper exposes Name and Value setters even though native virtual behavior varies by node kind. Declaration content should be changed through valid attributes in APIs that expose them; arbitrary Name/Value mutation is not a safe declaration editor and can raise or yield malformed output.

Borrowed declaration and attribute references are document-owned and invalid after clear, reload or free.

**External references**

- [W3C XML declaration and prolog](https://www.w3.org/TR/xml/#sec-prolog-dtd)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
