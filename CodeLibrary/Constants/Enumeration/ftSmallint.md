---
title: ftSmallint
description: Identifies a signed 16-bit integer field with range -32,768 through 32,767.
sidebar_position: 124
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, int16, signed, smallint]
---

```Delphi
ftSmallint = 2
```

### Example

```Delphi
function IsSignedInt16(Field: TField): Boolean;
begin
  Result := Field.DataType = ftSmallint;
end;
```

### Usage

`ftSmallint` identifies a signed 16-bit integer field with range -32,768 through 32,767.

### Additional Technical Info
`ftSmallint` is declaration ordinal 2 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies signed 16-bit values -32,768..32,767.

Validate range before narrowing from Integer/Int64/decimal/text input and preserve Null separately. The enum does not define database column constraints or overflow handling; never depend on truncation/wraparound.

The example only inspects metadata and was source-reviewed; no conversion/dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
