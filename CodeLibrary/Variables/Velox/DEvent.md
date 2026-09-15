---
title: "DEvent"
description: "Exposes the current action event TdaSQLQueryDataView pointer used by the standard Velox scriptlet."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - event
  - dataview
---

```Delphi
DEvent: TdaSQLQueryDataView
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DEvent <> nil then
    Value := True
  else
    Value := False;
end;
```

### Usage

`DEvent` provides the current event data view used by standard Velox event scripts.

**Live-view behaviour**

Use it to access the configured event view's parameters, fields, records and query state. Its cursor, filters and edits are shared with later processing, so navigating or changing it affects what subsequent code sees. Assigning the variable does not open the view, select a row, create an event or save changes.

Check for `nil`, confirm the view is active and use the configured schema before accessing fields or records. Do not free it or retain it after the current action.

**Business and safety boundaries**

A current event row does not by itself prove database persistence, notification delivery, transaction status or complete audit history. Use the explicit helper/action that performs the intended effect, validate keys/current-row context and handle query/database errors according to that contract.

### Additional Technical Info
`DEvent` is a direct scripting pointer to the current action's event SQL query dataview. It can be `nil` and is not owned by the script.

**Lifecycle, ownership and compatibility**

Deprecated `InitialiseInterchange` can assign the interchange event view to this pointer.

The owning configuration/action supplies the view. Do not construct/free it through this variable, retain it beyond the action/map context or pass it to asynchronous work. Later initialisation/legacy calls can replace the pointer.

**Runtime binding and assignment**

The script engine binds this pointer to `TvxActionMan.DEvent`. Action data reset assigns `nil`. The standard scriptlet `Initialise(aDIssue, aDEvent)` assigns its `aDEvent` argument to the field; assigning the public variable directly likewise changes the action field.

**Related entries**

- [`TdaSQLQueryDataView`](../../Classes/Data/TdaSQLQueryDataView.md) documents the returned class.
- [`DIssue`](DIssue.md) is the paired current issue view.
- [`Velox`](../Velox.md) explains initialisation and legacy behaviour.

**External references**

- This variable is a Velox pointer binding rather than a Delphi/FPC core function; the source-backed class link is the behavioural reference.

<small>Created 2026-07-15</small>
