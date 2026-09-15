---
title: HeaderStatusType
description: Gets or directly replaces the temporary header-status mirror without consuming it or changing the overall log status.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, header-status, status]
---

```Delphi
property HeaderStatusType: TvxLogStatusType read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Value := Action.Log.HeaderStatusType
    else
      Value := flsNotSet
  else
    Value := flsNotSet;
end;
```

### Usage

`HeaderStatusType` gets or directly replaces the temporary header-status mirror without consuming it or changing the overall log status.

**Lifecycle and quirks**

- Reset/Clear sets the value to `flsOK`.
- Direct assignment can raise or lower the header value independently.
- Reassigning an overall status equal to/lower than the current overall type does not remirror it, so a consumed/manually reset header can remain OK while overall StatusType is Error.
- The field is unsynchronised and one GetHeaderStatus consumer can reset it before another reads it.

### Additional Technical Info
`HeaderStatusType` is a temporary `TvxLogStatusType` intended for a header/group output status.

The property getter is non-destructive. [`GetHeaderStatus`](../Methods/GetHeaderStatus.md) returns its ordinal and resets this property to `flsOK`.

When [`StatusType`](StatusType.md) successfully escalates to a greater ordinal, Velox copies that value to both header and row mirrors. The direct HeaderStatusType setter simply replaces this one field; it does not change overall StatusType, RowStatusType, Boolean Status or create a message.

**Related entries**

- [`GetHeaderStatus`](../Methods/GetHeaderStatus.md) — destructive ordinal read.
- [`RowStatusType`](RowStatusType.md) — independent row mirror.
- [`StatusType`](StatusType.md) — overall monotonic status.
- [`TvxLogStatusType`](../../../../Types/Enumerations/TvxLogStatusType.md) — enum values.

<small>Created 2026-07-15</small>
