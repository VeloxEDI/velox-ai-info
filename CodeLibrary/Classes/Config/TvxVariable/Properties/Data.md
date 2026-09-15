---
title: Data
description: Lazily creates and returns a borrowed TvxClientDataSet named from the variable's current Code.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, dataset, lazy]
---

```Delphi
property Data: TvxClientDataSet read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var D: TvxClientDataSet;
begin
  D := Locals['LookupData'].Data;
  Value := D.DataSetName;
end;
```

### Usage

creates on first access and returns a borrowed TvxClientDataSet named from the variable's current Code.

### Additional Technical Info
On first read, Data locks the variable, creates `TvxClientDataSet.Create(nil)`, sets DataSetName to the current Code, stores it and returns it. Later reads return the same object until [`FreeData`](../Methods/FreeData.md) or variable destruction.

The dataset has nil component owner but is owned manually by `TvxVariable`. Scripts must not free it. Code changes after creation do not rename DataSetName.

The monitor is released before caller use. Dataset operations are not automatically protected by the variable lock, and another thread can FreeData or destroy/invalidate the variable while a borrowed dataset reference remains in use. Coordinate ownership and do not retain it across action/cache cleanup.

Merely reading Data allocates mutable state. Opening, SQL connection assignment, fields, rows and close/reset behaviour belong to `TvxClientDataSet` and its connection consumers, not to this getter.

<small>Created 2026-07-15</small>
