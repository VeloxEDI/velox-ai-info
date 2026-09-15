---
title: New
description: Permanently enables a default UTF-8 declaration flag and destructively rebuilds the document while preserving output encoding state.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, new, declaration, reset, encoding, invalidation]
---

```Delphi
procedure New;
```

### Example

```Delphi
procedure StartNewDocument(Xml: TNativeXML);
begin
  if Xml = nil then Exit;

  Xml.New;
  Xml.Root.Name := 'Envelope';
end;
```

### Usage

`New` permanently enables a default UTF-8 declaration flag and destructively rebuilds the document while preserving output encoding state.

### Additional Technical Info
`New` sets the document's persistent `HasDeclaration` flag to true and calls [`Clear`](Clear.md). It destroys all current nodes, clears the symbol table, and recreates a default XML declaration plus the configured root (an unnamed element for the exposed constructor).

The flag change is persistent. Later Clear calls continue recreating the declaration. The scripting surface does not expose the native overload that chooses declaration/doctype flags, so there is no corresponding script method to turn the declaration flag off again on the same object.

Set [`Root.Name`](../../TXMLNode/Properties/Name.md) after New. The method does not infer a legal document-element name. Every reference obtained before the call becomes invalid.

#### Preserved encoding quirk

New is not a complete defaults reset. It does not change the remembered external encoding, code page or BOM. The newly created declaration always says `encoding="utf-8"`, but if this object previously loaded ANSI or UTF-16 XML, SaveToStream can still emit that remembered non-UTF-8 byte encoding. This produces an XML declaration/byte mismatch.

For unrelated output after a parsed document, create a fresh TNativeXML instead of reusing it with New. A fresh instance restores compact UTF-8/no-BOM output state.

New is destructive and nontransactional. Allocation failure while recreating nodes can leave incomplete state. [`IsEmpty`](IsEmpty.md) returns true after a normal call until the unnamed root is populated.

The example is source-reviewed only; no document was reset.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream New/Clear implementation lineage.
- [W3C XML encoding declaration](https://www.w3.org/TR/xml/#NT-EncodingDecl) - required agreement between declaration and entity encoding.

<small>Created 2026-07-15</small>
