---
title: ftShortint
description: Identifies a signed 8-bit integer field with range -128 through 127.
sidebar_position: 122
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, int8, signed, shortint]
---

```Delphi
ftShortint = 43
```

### Example

```Delphi
function IsSignedInt8(Field: TField): Boolean;
begin
  Result := Field.DataType = ftShortint;
end;
```

### Usage

`ftShortint` identifies a signed 8-bit integer field with range -128 through 127.

### Additional Technical Info
`ftShortint` is declaration ordinal 43 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies signed 8-bit values -128..127. It differs from unsigned [`ftByte`](ftByte.md).

Check range before assignment and preserve Null separately. Database/provider support may expose a wider physical type while the Delphi field enforces this logical domain; do not depend on wraparound.

The example only inspects metadata and was source-reviewed; no conversion/dataset/database/runtime/image test ran.

<small>Created 2026-07-15</small>
