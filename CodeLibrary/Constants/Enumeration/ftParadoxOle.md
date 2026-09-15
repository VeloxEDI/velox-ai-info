---
title: ftParadoxOle
description: Identifies legacy Paradox OLE large-object metadata that Delphi handles as opaque blob content.
sidebar_position: 119
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, paradox, ole, blob, legacy]
---

```Delphi
ftParadoxOle = 19
```

### Example

```Delphi
function IsLegacyParadoxOLE(Field: TField): Boolean;
begin
  Result := Field.DataType = ftParadoxOle;
end;
```

### Usage

`ftParadoxOle` identifies legacy Paradox OLE large-object metadata that Velox handles as opaque blob content.

### Additional Technical Info
`ftParadoxOle` is declaration ordinal 19 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It labels an embedded OLE value from legacy Paradox storage. It does not create a COM/OLE object or make the stored content trustworthy.

The installed RTL maps this member to `TBlobField` and treats it as base `ftBlob` for compatibility checks. Read and write it as opaque bytes through the dataset's blob stream unless the originating Paradox schema and object format are known. The enum supplies no embedded-application identity, container version or portable conversion contract.

Legacy embedded objects can depend on unavailable applications, proprietary serialization and platform-specific behavior. Preserve source bytes during archival or migration, record their origin/content type separately, and use a deliberately isolated converter if interpretation is required. Do not activate untrusted OLE content as part of ordinary mapping.

New designs should use an explicit content type and a documented portable payload. Use [`ftBlob`](ftBlob.md) for generic binary LOB semantics; retain this member only for genuine provider compatibility.

The example only inspects metadata and was source-reviewed; no OLE activation, Paradox, blob, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; legacy provider support is not implied.

<small>Created 2026-07-15</small>
