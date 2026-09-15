---
title: ftExtended
description: Identifies an Extended floating field whose effective precision and storage depend on platform, field class and provider.
sidebar_position: 100
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, floating-point, extended, precision]
---

```Delphi
ftExtended = 45
```

### Example

```Delphi
function IsExtendedFloat(Field: TField): Boolean;
begin
  Result := Field.DataType = ftExtended;
end;
```

### Usage

`ftExtended` identifies an Extended floating field whose effective precision and storage depend on platform, field class and provider.

### Additional Technical Info
`ftExtended` is declaration ordinal 45 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies the Extended floating family, but Delphi's effective Extended precision differs by target platform and a database/provider may map it through another representation.

It is binary floating point: many decimal fractions are approximate, NaN/Infinity/provider support varies, and exact equality/money/decimal identifiers are unsafe uses. Preserve the source schema and actual field class rather than assuming the enum guarantees wider-than-Double storage.

The example only inspects metadata and was source-reviewed; no floating calculation/dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
