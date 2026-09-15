---
title: "GetDataViewforDataSet"
description: "Returns the scripter-owned query data view rebound to a supplied client dataset."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data-view, dataset, ownership, alias]
---

```Delphi
function GetDataViewforDataSet(aDataSet: TvxClientDataSet): TdaQueryDataView;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  View: TdaQueryDataView;
begin
  View := GetDataViewforDataSet(Data);
  Value := Assigned(View);
end;
```

### Usage

`GetDataViewforDataSet` returns the script execution-owned query data view rebound to a supplied client dataset.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet` | Dataset that the shared query view will reference. The runtime assumes it is actually a `TdaChildSQLClientDataSet`. |

**Returns**

the current script execution's reusable query data view. It is not newly allocated per call and ownership does not transfer to the script.

### Additional Technical Info
`GetDataViewforDataSet` is an exact wrapper around [`LinkDataView`](LinkDataView.md). It rebinds one cached, scripter-owned `TdaSQLQueryDataView` to a supplied dataset and returns that view.

`Data` represents a dataset provided by the current context. The example is source-reviewed and was not executed.

**Implementation**

The method contains only `Result := LinkDataView(aDataSet)`. The terminal method lazily creates `TdaSQLQueryDataView.Create(Self)`, hard-casts the argument to `TdaChildSQLClientDataSet`, assigns it to the view's `Query`, and returns the cached object.

**Aliasing and lifetime quirks**

- Later calls through this function, `GetLinkedData` or `LinkDataView` rebind the same view. A previously stored reference immediately observes the new dataset.
- The dataset is referenced, not copied. Closing, moving or destroying it changes or invalidates the view.
- The scripter owns the view. Do not call `Free`, retain it after the script context ends, or treat it as a transferable dataset snapshot.
- The unchecked specialized cast can fail later or produce invalid access if the argument is not the expected runtime subclass.

**Errors, performance and concurrency**

There is no exception handler. Allocation, cast-dependent access or assignment errors propagate. Creation is small and lazy; iteration cost belongs to the linked dataset. The shared mutable binding is not thread-safe or re-entrant across consumers that expect different datasets.

**Related entries**

- [`LinkDataView`](LinkDataView.md) is the terminal implementation.
- [`GetLinkedData`](GetLinkedData.md) is another exact alias despite its potentially confusing name.
- [`LinkedData`](LinkedData.md) returns the current map-linked view and is not an alias.

<small>Created 2026-07-15</small>
