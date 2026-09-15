---
title: ftWord
description: Identifies an unsigned 16-bit integer field with range 0 through 65,535.
sidebar_position: 140
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, uint16, unsigned, word]
---

```Delphi
ftWord = 4
```

### Example

```Delphi
function IsUnsignedInt16(Field: TField): Boolean;
begin
  Result := Field.DataType = ftWord;
end;
```

### Usage

`ftWord` identifies an unsigned 16-bit integer field with range 0 through 65,535.

### Additional Technical Info
`ftWord` is declaration ordinal 4 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies unsigned 16-bit values 0..65,535.

Do not confuse declaration ordinal 4 or sidebar position 136 with the value domain. Negative assignments and narrowing require explicit validation; signed Smallint cannot represent 32,768..65,535. Null/provider/database constraints remain separate.

The example only inspects metadata and was source-reviewed; no conversion/dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
