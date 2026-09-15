---
title: ftSingle
description: Identifies a Single-precision binary floating field with substantially less precision than ftFloat.
sidebar_position: 123
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, single, float32, precision]
---

```Delphi
ftSingle = 51
```

### Example

```Delphi
function IsSinglePrecision(Field: TField): Boolean;
begin
  Result := Field.DataType = ftSingle;
end;
```

### Usage

`ftSingle` identifies a Single-precision binary floating field with substantially less precision than ftFloat.

### Additional Technical Info
`ftSingle` is declaration ordinal 51 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies IEEE-style Single/binary32 values, typically about 7 significant decimal digits—far less than [`ftFloat`](ftFloat.md).

Expect rounding when values arrive through Double/decimal/text providers. Use tolerance-aware comparisons and never use Single for money or exact identifiers. Provider support, NaN/Infinity and Null remain separate concerns.

The example only inspects metadata and was source-reviewed; no floating calculation/dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
