---
title: ftDBaseOle
description: Identifies legacy dBASE OLE large-object metadata that Delphi handles through the generic blob field family.
sidebar_position: 99
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, dbase, ole, blob, legacy]
---

```Delphi
ftDBaseOle = 20
```

### Example

```Delphi
function IsLegacyDBaseOLE(Field: TField): Boolean;
begin
  Result := Field.DataType = ftDBaseOle;
end;
```

### Usage

`ftDBaseOle` identifies legacy dBASE OLE large-object metadata that Velox handles through the generic blob field family.

### Additional Technical Info
`ftDBaseOle` is declaration ordinal 20 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It labels an OLE value originating from legacy dBASE-compatible storage. It is a database/provider classification, not a Delphi COM object or an instruction to activate embedded content.

The installed RTL maps the member to `TBlobField` and collapses it to base `ftBlob` for field-compatibility checks. Data is therefore normally read and written as opaque bytes through a provider-created blob stream. The enum does not define the OLE container version, embedded application, byte order or safe parser.

Preserve the original bytes when migrating data unless a trusted format-specific converter is available. Never execute, instantiate or render an untrusted embedded object merely because the column has this type. Providers that no longer support the historic dBASE OLE representation can expose the value differently or reject it; verify the live field definition and provider documentation.

For new integrations, prefer an explicit modern schema with a documented content type and length. Use [`ftBlob`](ftBlob.md) for generic binary LOB semantics; keep `ftDBaseOle` only when interoperating with an existing source that genuinely reports it.

The example only inspects metadata and was source-reviewed; no OLE activation, blob, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; provider support is not implied.

<small>Created 2026-07-15</small>
