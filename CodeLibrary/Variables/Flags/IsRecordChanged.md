---
title: "IsRecordChanged"
description: "Record-level reference flag associated with the current view mapping."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - record-change
---

```Delphi
IsRecordChanged: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  IsRecordChanged := True;
  Value := IsRecordChanged;
end;
```

### Usage

`IsRecordChanged` is a record-level reference flag associated with the current view mapping.

Set it only in the correct map context and define which later script/configuration reads it. It is not an automatic field comparison, database dirty flag or save gate; use `SaveData` for the separate final map-save decision.

### Additional Technical Info
`IsRecordChanged` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | Current `TvxViewMap.FIsRecordChanged` |
| Reset/default | View-map reset and insertion of each new destination view record assign `False`. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

For a field map it points to the containing `ViewMap.IsRecordChanged`; for a view-map event it points to that view map's flag. Core source exposes/resets it but does not establish a universal automatic consumer.

**Context and lifecycle**

The name is registered for compilation everywhere, but a pointer is assigned only when the map item is `TvxFieldMap` or `TvxViewMap`. Access outside those contexts is unsupported/unbound.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Set it only in the correct map context and define which later script/configuration reads it. It is not an automatic field comparison, database dirty flag or save gate; use `SaveData` for the separate final map-save decision.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
