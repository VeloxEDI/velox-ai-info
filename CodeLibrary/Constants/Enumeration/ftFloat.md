---
title: ftFloat
description: Identifies the Double-precision binary floating field family and its approximation, comparison and decimal-round-trip limits.
sidebar_position: 103
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, float, double, precision]
---

```Delphi
ftFloat = 6
```

### Example

```Delphi
function IsDoublePrecisionField(Field: TField): Boolean;
begin
  Result := Field.DataType = ftFloat;
end;
```

### Usage

`ftFloat` identifies the Double-precision binary floating field family and its approximation, comparison and decimal-round-trip limits.

### Additional Technical Info
`ftFloat` is declaration ordinal 6 of [`TFieldType`](../../Types/Enumerations/TFieldType.md) and denotes the common Double-precision binary floating field family. It typically provides about 15-16 significant decimal digits, not exact decimal storage.

Use tolerance/domain-aware comparison and an explicit invariant serialization format. Do not use Float for currency, exact decimal identifiers or values requiring preserved database DECIMAL scale. Null and provider conversion/overflow behavior remain independent.

The example only inspects metadata and was source-reviewed; no floating calculation/dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
