---
title: "GetLinkedData"
description: "Aliases LinkDataView by rebinding the scripter-owned query view, rather than returning current map-linked data."
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, linked-data, data-view, alias, ownership]
---

```Delphi
function GetLinkedData(aDataSet: TvxClientDataSet): TdaQueryDataView;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  View: TdaQueryDataView;
begin
  View := GetLinkedData(Data);
  Value := Assigned(View);
end;
```

### Usage

`GetLinkedData` aliases LinkDataView by rebinding the script execution-owned query view, rather than returning current map-linked data.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet` | Dataset to expose through the reusable view. Velox hard-casts it to `TdaChildSQLClientDataSet`. |

**Returns**

The script execution's one cached `TdaSQLQueryDataView`. No ownership transfers and no independent dataset is created.

### Additional Technical Info
Despite its name, `GetLinkedData(aDataSet)` does **not** return the active map's current linked view. It is an exact alias of [`LinkDataView`](LinkDataView.md): it rebinds a cached scripter-owned query view to the dataset supplied by the caller.

The example is source-reviewed and was not executed.

**Implementation and quirks**

The entire function is `Result := LinkDataView(aDataSet)`. Consequently:

- Every later call through any of the three aliases changes the `Query` behind all earlier references.
- The supplied dataset is live and referenced, not copied.
- The unchecked specialized cast requires a compatible runtime dataset.
- The scripter destroys its view; scripts must neither free nor retain it beyond the context.

Use [`LinkedData`](LinkedData.md), with no argument, when the requirement is the mapping context's current linked data.

**Side effects, errors and concurrency**

The shared view's binding changes. No internal exception handler exists, so allocation or invalid-object failures propagate. Rebinding is fast but mutable and unsuitable for concurrent/re-entrant consumers that need stable different bindings.

**Related entries**

- [`LinkDataView`](LinkDataView.md) is the implementation reference.
- [`GetDataViewforDataSet`](GetDataViewforDataSet.md) is the same alias under a clearer name.
- [`LinkedData`](LinkedData.md) has map-context semantics.

<small>Created 2026-07-15</small>
