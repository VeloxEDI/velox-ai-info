---
title: ftGraphic
description: Identifies graphic-oriented blob metadata whose payload, optional Delphi graphic header and decoder remain separate concerns.
sidebar_position: 106
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, graphic, bitmap, blob, header]
---

```Delphi
ftGraphic = 17
```

### Example

```Delphi
function IsGraphicBlob(Field: TField): Boolean;
begin
  Result := Field.DataType = ftGraphic;
end;
```

### Usage

`ftGraphic` identifies graphic-oriented blob metadata whose payload, optional Velox graphic header and decoder remain separate concerns.

### Additional Technical Info
`ftGraphic` is declaration ordinal 17 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It labels a graphic-oriented BLOB. Embarcadero describes it as a bitmap field, but the enum alone does not prove that any particular row contains a valid BMP or identify dimensions, colour model or compression.

The installed RTL maps it to `TGraphicField`, a `TBlobField` descendant. `TBlobField.GraphicHeader` defaults to `True`. Assigning an `IStreamPersist` graphic can prepend Delphi's `TGraphicHeader`; loading through the matching persistent-object path recognises and skips a valid header. Raw `LoadFromStream`/`SaveToStream` operations copy stored bytes and do not provide a general image decoder. Consequently, consumers must know whether a header is present before treating the bytes as a standard image file.

Large images should be streamed; byte-array/string access materialises the payload. Validate type, size, dimensions and decoder resource limits before rendering untrusted content. Do not rely on a filename extension or this enum as validation, and do not assume that converting the field to text is meaningful.

Use [`ftBlob`](ftBlob.md) for opaque binary content. The image manipulation functions are a separate future test-bed stream and were deliberately not exercised here.

The example only inspects metadata and was source-reviewed; no graphic decode, blob, file, stream, dataset, database, runtime or image-function test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType), [`TGraphicField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TGraphicField) and [`TBlobField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TBlobField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TBlobField`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.html) compatibility references.

<small>Created 2026-07-15</small>
