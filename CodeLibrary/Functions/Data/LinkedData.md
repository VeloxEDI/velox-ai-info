---
title: "LinkedData"
description: "Returns the current linked query data view for the active field or view map context."
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, linked-data, map-context, data-view, lifetime]
---

```Delphi
function LinkedData: TdaQueryDataView;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  View: TdaQueryDataView;
begin
  View := LinkedData;
  Value := Assigned(View);
end;
```

### Usage

`LinkedData` returns the current linked query data view for the active field or view map context.

**Parameters**

None.

**Returns**

- For a `TvxFieldMap` context: `MapItem.ViewMap.GetCurrentLinkedView`.
- For a `TvxViewMap` context: `MapItem.GetCurrentLinkedView`.
- For no map item or another map-item type: `nil`.

The returned view is a live context-owned object. Ownership never transfers to the script.

### Additional Technical Info
`LinkedData` returns the current linked query data view associated with the scripter's active field-map or view-map context. It can legitimately return `nil` outside those contexts.

The example checks availability before use. It is source-reviewed and was not executed.

**Implementation and availability quirk**

The method initializes `Result := nil`, tests `MapItem`, then performs the two runtime type branches above. It does not create, copy or rebind a view.

Velox deliberately does not register this no-argument function in the special LinkedData-event scripter. That event already has a parameter named `LinkedData`; omitting the helper avoids a compiler-name collision. Within that event, use the supplied parameter instead.

**State, lifetime and side effects**

Calling the helper itself does not move a cursor, but the returned object represents mutable current linked state. Other mapping work can advance, re-evaluate or replace that state. Do not free it, retain it after the event, or assume it is a snapshot.

**Errors and concurrency**

Unsupported context returns `nil` rather than raising. Errors inside the context's `GetCurrentLinkedView` are not caught here. The object follows active map execution and is not safe for cross-thread or cross-execution retention.

**Remarks**

This function is semantically different from [`GetLinkedData`](GetLinkedData.md), which accepts a dataset and aliases `LinkDataView`. Always test the returned object with `Assigned` unless the event contract guarantees linked data.

**Related entries**

- [LinkedData event](../../ScriptingGuide/Events/LinkedData.md) explains the event parameter and processing loop.
- [`GetLinkedData`](GetLinkedData.md) links a caller-supplied dataset instead.
- [`LinkDataView`](LinkDataView.md) owns the reusable-link implementation.

<small>Created 2026-07-15</small>
