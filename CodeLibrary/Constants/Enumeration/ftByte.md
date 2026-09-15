---
title: ftByte
description: Identifies an unsigned 8-bit integer field with value range 0 through 255.
sidebar_position: 91
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, integer, unsigned, byte]
---

```Delphi
ftByte = 44
```

### Example

```Delphi
function IsUnsignedByte(Field: TField): Boolean;
begin
  Result := Field.DataType = ftByte;
end;
```

### Usage

`ftByte` identifies an unsigned 8-bit integer field with value range 0 through 255.

### Additional Technical Info
`ftByte` is declaration ordinal 44 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies an unsigned 8-bit integer domain, 0..255. It is a scalar numeric field, not [`ftBytes`](ftBytes.md), which represents byte sequences.

Negative or greater-than-255 assignments require provider conversion/range handling and must not be silently wrapped. Null, validation constraints and database type remain separate metadata. Avoid confusing the alphabetical sidebar position 91 with ordinal 44 or the value range.

The example only inspects metadata and was source-reviewed; no conversion/dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
