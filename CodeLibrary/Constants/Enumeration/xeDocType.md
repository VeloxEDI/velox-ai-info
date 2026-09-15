---
title: xeDocType
description: Identifies a NativeXML document-type declaration and its raw, nonvalidating model of external identifiers and internal-subset declarations.
sidebar_position: 196
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, doctype, dtd]
---

```Delphi
xeDocType = 8
```

### Example

```Delphi
function IsDocumentType(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeDocType);
end;
```

### Usage

`xeDocType` identifies a Velox XML document-type declaration and its raw, nonvalidating model of external identifiers and internal-subset declarations.

### Additional Technical Info
`xeDocType` identifies NativeXML's concrete `<!DOCTYPE ...>` node. It is normally a top-level raw node before the document element, so [`Root`](../../Classes/XML/TNativeXML/Properties/Root.md) does not return it. Raw traversal or document-level searching can expose it.

The node records the declared document name, an optional `SYSTEM` or `PUBLIC` external identifier, its quoted system/public literals, and declarations in an internal subset. Internal-subset children can include [`xeDtdElement`](xeDtdElement.md), [`xeDtdAttList`](xeDtdAttList.md), [`xeDtdEntity`](xeDtdEntity.md), [`xeDtdNotation`](xeDtdNotation.md), comments, instructions and character data.

**Important boundaries**

- NativeXML parses much of the DTD material into raw strings or lightweight nodes. This is not full DTD grammar validation and does not prove that an input document conforms to its declared DTD.
- A DOCTYPE or external identifier in input is not authority to fetch or trust an external resource. Apply the integration's own resource, network and input policies before accepting untrusted XML.
- The script wrapper exposes no DTD-specific factory or strongly typed DOCTYPE properties. Generic `Name` and `Value` setters do not make arbitrary edits valid XML.
- This is a borrowed node owned by the document. Do not retain it after clear, reload or destruction.

**External references**

- [W3C XML document-type declaration](https://www.w3.org/TR/xml/#NT-doctypedecl)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
