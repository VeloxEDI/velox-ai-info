---
title: ftLargeint
description: Identifies a signed 64-bit integer field and requires care when crossing Variant, JSON and JavaScript numeric boundaries.
sidebar_position: 111
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, int64, largeint, serialization]
---

```Delphi
ftLargeint = 25
```

### Example

```Delphi
function IsSignedInt64(Field: TField): Boolean;
begin
  Result := Field.DataType = ftLargeint;
end;
```

### Usage

`ftLargeint` identifies a signed 64-bit integer field and requires care when crossing Variant, JSON and JavaScript numeric boundaries.

### Additional Technical Info
`ftLargeint` is declaration ordinal 25 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies signed 64-bit values from -9,223,372,036,854,775,808 through 9,223,372,036,854,775,807.

The full domain is not exactly representable by IEEE-754 Double/JavaScript Number (exact integers end at 2^53-1). When crossing Variant/JSON/Excel/JavaScript boundaries, preserve large identifiers as decimal strings or another agreed 64-bit representation. Validate narrowing and Null separately.

The example only inspects metadata and was source-reviewed; no serialization/conversion/dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
