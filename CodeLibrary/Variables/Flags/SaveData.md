---
title: "SaveData"
description: "Controls whether the map performs its normal final destination save."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - persistence-gate
---

```Delphi
SaveData: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  SaveData := False;
  Value := SaveData;
end;
```

### Usage

`SaveData` controls whether the map performs its normal final destination save.

Set it to `False` when the current map must skip saving its destination data. Velox saves only when `SaveData` is `True`, the log status is still successful and `MapTest` is `False`. `Test=True` alone does not suppress this save.

It cannot undo explicit SQL, file, HTTP or other effects already performed, and it is not a transaction rollback. Access outside a map context is unsupported.

### Additional Technical Info
`SaveData` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | Current `TvxMap.FSaveData` |
| Reset/default | `TvxMap.Reset` assigns `True` before mapping. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

At the end of mapping, Velox calls `Dest.SaveData` only when `SaveData=True`, log status remains successful and `MapTest=False`. `Test=True` does not by itself suppress this final save; MapTest does.

**Context and lifecycle**

The pointer is assigned only for a `TvxCustomMapItem`. Setting false skips the normal final destination save for the map.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

It cannot undo explicit SQL, file, HTTP or other side effects already performed, and it is not a transaction rollback. Access outside map context is unsupported. A false value can silently discard in-memory mapped output, so log the deliberate reason.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
