---
title: ftLongWord
description: Identifies an unsigned 32-bit integer field with range 0 through 4,294,967,295.
sidebar_position: 112
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, uint32, unsigned, longword]
---

```Delphi
ftLongWord = 42
```

### Example

```Delphi
function IsUnsignedInt32(Field: TField): Boolean;
begin
  Result := Field.DataType = ftLongWord;
end;
```

### Usage

`ftLongWord` identifies an unsigned 32-bit integer field with range 0 through 4,294,967,295.

### Additional Technical Info
`ftLongWord` is declaration ordinal 42 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies an unsigned 32-bit domain, 0..4,294,967,295.

Values above signed Integer maximum require a compatible Variant/provider/destination type; casting through signed 32-bit can appear negative. Validate negative inputs and narrowing rather than wrapping. Native Delphi also has a later `ftLargeUint` that the current script importer omits; `ftLongWord` is not unsigned 64-bit.

The example only inspects metadata and was source-reviewed; no conversion/dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
