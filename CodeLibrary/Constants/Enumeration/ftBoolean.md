---
title: ftBoolean
description: Identifies a Boolean dataset field while leaving Null as an independent third state and provider encodings outside the enum.
sidebar_position: 90
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, field, boolean, 'null']
---

```Delphi
ftBoolean = 5
```

### Example

```Delphi
function IsBooleanField(Field: TField): Boolean;
begin
  Result := Field.DataType = ftBoolean;
end;
```

### Usage

`ftBoolean` identifies a Boolean dataset field while leaving Null as an independent third state and provider encodings outside the enum.

### Additional Technical Info
`ftBoolean` is declaration ordinal 5 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies a logical True/False field. `Field.IsNull` remains independent, so nullable data has three observable states: Null, False and True.

The enum does not define database encodings such as 0/1, Y/N or BIT, nor text serialization. Use the field/provider conversion and define outbound representation explicitly. Never coerce Null to False unless the business contract requires that loss of distinction.

The example only inspects metadata and was source-reviewed; no dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
