---
title: Create
description: Creates a NativeXML document with an unnamed root, no declaration and default compact UTF-8 serialization settings.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, constructor, root, ownership, utf8]
---

```Delphi
constructor Create(AOwner: TComponent);
```

### Example

```Delphi
procedure CreatePayload;
var
  Xml: TNativeXML;
begin
  Xml := TNativeXML.Create(nil);
  try
    Xml.Root.Name := 'Payload';
  finally
    Xml.Free;
  end;
end;
```

### Usage

Creates a Velox XML document with an unnamed root, no declaration and default compact UTF-8 serialisation settings.

### Additional Technical Info
`Create` allocates the NativeXML symbol table and owned top-level node list, applies vendor defaults, and builds one root element whose Name is empty. It creates no XML declaration and no doctype.

Set [`Root.Name`](../../TXMLNode/Properties/Name.md) to a valid XML element name before serialization. The constructor does not validate or infer a root name, and the default empty root still makes [`IsEmpty`](IsEmpty.md) true.

Default output is compact UTF-8 without a BOM. Other vendor defaults include Windows CRLF for readable formatting, tab indentation and self-closing `/>`, but the corresponding options are not exposed by this scripting surface.

`AOwner` follows TComponent ownership. With nil, the script owns the document and must Free it. With a nonnil component owner, that component can free the document automatically; manually freeing it is allowed only while normal component notification/lifetime rules remain satisfied. Passing an unrelated stale component reference is unsafe.

The created document owns its attached nodes. References returned through Root or later traversal are borrowed and must not outlive the document. The class is mutable and not thread-safe.

Only this owner-based constructor is exposed. NativeXML constructors that choose declaration/doctype/root presence or a root name are unavailable; use Root.Name and, if required, [`New`](New.md) for the limited exposed setup.

The example is source-reviewed only; no document was created.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream constructor implementation lineage.
- [W3C XML elements](https://www.w3.org/TR/xml/#sec-starttags) - element-name and start/end-tag requirements.

<small>Created 2026-07-15</small>
