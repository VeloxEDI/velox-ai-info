---
title: ftObject
description: Identifies a DataSnap TObject parameter reference rather than a persisted scalar or structured dataset field.
sidebar_position: 114
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, object, datasnap, parameter, ownership]
---

```Delphi
ftObject = 50
```

### Example

```Delphi
function IsObjectParameter(DataType: TFieldType): Boolean;
begin
  Result := DataType = ftObject;
end;
```

### Usage

`ftObject` identifies an object parameter reference rather than a persisted scalar or structured dataset field.

### Additional Technical Info
`ftObject` is ordinal 50 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Embarcadero defines it for a `TObject` parameter used by DataSnap. The installed RTL has no default ordinary field class for it.

It represents a live object reference or framework-marshalled object, not a serializable pointer value. The calling API determines the required class, instance ownership and whether the receiver may mutate, retain or free it. Never persist the address, assume ownership from the enum or cast without verifying the expected type.

Object graphs can expose methods, secrets and mutable process state. Limit use to trusted in-process/framework contracts and treat nil separately.

The example only compares metadata and was source-reviewed; no object creation, DataSnap, dataset, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TObject`](https://docwiki.embarcadero.com/Libraries/en/System.TObject).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; DataSnap behavior is Delphi-specific.

<small>Created 2026-07-15</small>
