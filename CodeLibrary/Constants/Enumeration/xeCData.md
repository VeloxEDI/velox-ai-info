---
title: xeCData
description: Identifies a NativeXML CDATA-section node whose literal value joins element text but is written without delimiter validation.
sidebar_position: 191
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, cdata, node]
---

```Delphi
xeCData = 4
```

### Example

```Delphi
function IsCDataNode(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeCData);
end;
```

### Usage

`xeCData` identifies a Velox XML CDATA-section node whose literal value joins element text but is written without delimiter validation.

### Additional Technical Info
`xeCData` identifies a parsed `<![CDATA[...]]>` section. NativeXML keeps the section as a distinct raw node and returns its contained text literally rather than applying the character-data entity replacement used by [`xeCharData`](xeCharData.md).

An element's `Value` concatenates the values of its immediate CharData, WhiteSpace and CDATA nodes in raw order. CDATA is therefore text-like for `Value`, but it remains distinguishable through `ElementType`. Element-only child access excludes it.

**Mutation and serialization quirk**

The script wrapper exposes `TXMLNode.Value` read/write. Assigning a CDATA node replaces its literal stored content. The writer then emits:

```text
<![CDATA[stored content]]>
```

It does not split or reject a stored `]]>` sequence. If script mutation introduces that sequence, saving can terminate the section early and emit malformed XML. Validate or split such content before assignment.

Writing the parent element's `Value` is not an equivalent way to update CDATA. NativeXML's element setter raises when CDATA or other competing text-like nodes are present; mutate the intended borrowed node deliberately.

**Lifetime and traversal**

CDATA nodes are owned by the document. Raw traversal can return them; `Elements[...]` cannot. A borrowed reference is invalid after document clear, reload or destruction. The constant itself is immutable and side-effect free.

**External references**

- [W3C XML CDATA sections](https://www.w3.org/TR/xml/#sec-cdata-sect)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
