---
title: ftUnknown
description: Identifies the zero sentinel for an unknown or unresolved field type and has no default Delphi field class.
sidebar_position: 135
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, unknown, sentinel, validation]
---

```Delphi
ftUnknown = 0
```

### Example

```Delphi
function HasKnownFieldType(Field: TField): Boolean;
begin
  Result := Field.DataType <> ftUnknown;
end;
```

### Usage

`ftUnknown` identifies the zero sentinel for an unknown or unresolved field type and has no default Velox field class.

### Additional Technical Info
`ftUnknown` is ordinal 0 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It means the type is unknown or undetermined. The installed RTL has no default field class for it.

Treat it as unresolved metadata, not a string, Variant or safe generic value. It can indicate an uninitialised parameter, unsupported provider type or incomplete schema discovery. Stop type-dependent conversion and obtain the real metadata or handle the value through an explicitly supported provider path.

Do not persist ordinal zero as a substitute for a real external type or silently coerce unknown values; that can hide schema drift and data loss.

The example only inspects metadata and was source-reviewed; no provider discovery, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference.

<small>Created 2026-07-15</small>
