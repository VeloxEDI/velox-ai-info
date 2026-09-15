---
title: ftTypedBinary
description: Identifies provider-defined typed binary large-object data whose representation is not described by the enum itself.
sidebar_position: 134
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, typed-binary, blob, provider]
---

```Delphi
ftTypedBinary = 21
```

### Example

```Delphi
function IsProviderTypedBinary(Field: TField): Boolean;
begin
  Result := Field.DataType = ftTypedBinary;
end;
```

### Usage

`ftTypedBinary` identifies provider-defined typed binary large-object data whose representation is not described by the enum itself.

### Additional Technical Info
`ftTypedBinary` is declaration ordinal 21 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It marks binary large-object data with a type understood by the originating dataset/provider. It does not name that type or define a portable serialization.

The installed RTL maps the member to `TBlobField` and treats it as base `ftBlob` for compatibility. A subtle RTL behavior applies when assigning an `IStreamPersist` value: `TBlobField.LoadFromStreamPersist` prepends Delphi's `TGraphicHeader` for `ftTypedBinary` regardless of the `GraphicHeader` property because of the current condition's grouping. Raw `LoadFromStream` does not add that wrapper. Code using the two assignment paths can therefore store different byte sequences.

Do not infer an image, OLE object or other format from this enum. Establish the provider type and whether the stored value contains a Delphi header before decoding or exporting it. Generic `SaveToStream` copies stored bytes; the persistent-object path can recognise and skip a valid header. Whole-value byte access has memory proportional to payload size.

For portable integrations, prefer an explicit schema/content-type marker plus [`ftBlob`](ftBlob.md). Treat unknown typed binary as untrusted opaque content.

The example only inspects metadata and was source-reviewed; no typed-object load, blob, stream, dataset, database, runtime or image-function test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TBlobField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TBlobField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TBlobField`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.html) compatibility references; identical typed-binary framing is not implied.

<small>Created 2026-07-15</small>
