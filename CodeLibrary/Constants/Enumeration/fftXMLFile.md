---
title: fftXMLFile
description: Selects the Velox XML file-definition engine, XML data-module type and application/xml media default.
sidebar_position: 66
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, xml, xsd, namespace, engine]
---

```Delphi
fftXMLFile = 1
```

### Example

```Delphi
procedure ConfigureXML(FileDef: TvxFileDef);
begin
  FileDef.FileType := fftXMLFile;
end;
```

### Usage

`fftXMLFile` selects the Velox XML file-definition engine, XML data-module type and application/xml media default.

### Additional Technical Info
`fftXMLFile` is ordinal 1 of [`TvxFileType`](../../Types/Enumerations/TvxFileType.md). It selects `TvxXMLFileEngine`, module class `TvxFileDefXML`, data type `fdtXMLFile`, and MIME default `application/xml`.

Velox XML File Definitions can load XSD/schema information and map root/child content through configured data views. The enum itself specifies none of the document contract: root element, namespaces, schema version, element/attribute mapping, repetition, ordering, whitespace, nil handling and character encoding remain explicit design decisions.

#### Configuration and interoperability boundaries

- Match elements by namespace URI plus local name where the contract is namespace-aware; prefixes are aliases and may vary between documents.
- Decide whether validation is required and which XSD/schema version is authoritative. Well-formed XML can still be invalid for the business mapping.
- Distinguish absent elements, empty elements, `xsi:nil`, empty attributes and whitespace-only text.
- External entities/DTD behavior is security-sensitive. Do not assume selecting the XML engine makes untrusted XML safe; constrain parser/resource access according to the deployed engine configuration.
- `application/xml` does not add a charset parameter in the current method. XML declaration/BOM/transport rules and the configured file encoding determine decoding.
- Request streams may currently be saved to a file before loading in the XML engine; engine selection does not promise streaming or bounded-memory behavior.

The example only selects configuration and was source-reviewed; no XML/XSD parse, entity, file, request-stream, runtime or image-function test was executed.

**External references**

- [W3C XML 1.0](https://www.w3.org/TR/xml/) - document syntax and processor requirements.
- [RFC 7303: XML Media Types](https://www.rfc-editor.org/rfc/rfc7303) - `application/xml` and encoding rules.

<small>Created 2026-07-15</small>
