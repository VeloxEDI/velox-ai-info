---
title: fftJSONFile
description: Selects the Velox JSON file-definition engine, JSON data-module type and application/json media default.
sidebar_position: 65
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, json, engine, encoding, schema]
---

```Delphi
fftJSONFile = 4
```

### Example

```Delphi
procedure ConfigureJSON(FileDef: TvxFileDef);
begin
  FileDef.FileType := fftJSONFile;
end;
```

### Usage

`fftJSONFile` selects the Velox JSON file-definition engine, JSON data-module type and application/json media default.

### Additional Technical Info
`fftJSONFile` is ordinal 4 of [`TvxFileType`](../../Types/Enumerations/TvxFileType.md). It selects `TvxJSONFileEngine`, module class `TvxFileDefJSON`, data type `fdtJSONFile`, and MIME default `application/json`.

The constant chooses the engine family; it does not define the JSON document shape. Root object/array expectations, repeated records, nested paths, missing/null properties, number/date interpretation and output property names belong to the File Definition/data-view/schema mapping.

#### Data-contract boundaries

- JSON names and String values are case/Unicode-sensitive according to the consumer contract. Do not normalize them merely because Velox field names are configured differently.
- Distinguish an absent property, explicit JSON `null`, empty String, zero, false and empty array/object. Mapping them to one Variant state loses information.
- JSON numbers do not carry an integer/decimal schema by themselves. Define precision, range and decimal expectations for business identifiers and amounts.
- `application/json` is a media label, not validation. The engine can still reject malformed structure or a mapping-incompatible valid document.
- File extension is independent of FileType. Validate payload and size before processing untrusted data.
- Read/Write event logging can occur before all parsing/serialization finishes; determine outcome from Flow/module status.

The example only selects configuration and was source-reviewed; no JSON parse/write, schema, file, runtime or image-function test was executed.

**External references**

- [RFC 8259: JSON Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259) - syntax, encoding and interoperability constraints.

<small>Created 2026-07-15</small>
