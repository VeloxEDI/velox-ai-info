---
title: ftInteger
description: Identifies a signed 32-bit integer field with range -2,147,483,648 through 2,147,483,647.
sidebar_position: 109
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, integer, signed, int32]
---

```Delphi
ftInteger = 3
```

### Example

```Delphi
function IsSignedInt32(Field: TField): Boolean;
begin
  Result := Field.DataType = ftInteger;
end;
```

### Usage

`ftInteger` identifies a signed 32-bit integer field with range -2,147,483,648 through 2,147,483,647.

### Additional Technical Info
`ftInteger` is declaration ordinal 3 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies a signed 32-bit field with range -2,147,483,648..2,147,483,647.

The member does not define database nullability, identity behavior, validation or display formatting. Check range before narrowing from Int64/unsigned/text/decimal inputs; never rely on overflow wrapping. For generated identities use [`ftAutoInc`](ftAutoInc.md) metadata instead.

The example only inspects metadata and was source-reviewed; no conversion/dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
