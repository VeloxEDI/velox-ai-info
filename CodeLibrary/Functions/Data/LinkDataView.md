---
title: "LinkDataView"
description: "Rebinds and returns the scripter's reusable query data view for a supplied client dataset."
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data-view, dataset, ownership, lifetime]
---

```Delphi
function LinkDataView(aDataSet: TvxClientDataSet): TdaQueryDataView;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  View: TdaQueryDataView;
begin
  View := LinkDataView(Data);
  Value := Assigned(View);
end;
```

### Usage

`LinkDataView` rebinds and returns the script execution's reusable query data view for a supplied client dataset.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet` | Live dataset to assign as the view query. Velox assumes the runtime object is `TdaChildSQLClientDataSet`. |

**Returns**

The same cached view object on every call made by that script execution. The first call creates on first access it with the script execution as owner.

### Additional Technical Info
`LinkDataView` exposes a `TvxClientDataSet` through one reusable `TdaSQLQueryDataView` owned by the current scripter. It links objects; it does not copy data, run SQL or create a stable view per call.

The example is source-reviewed and was not executed.

**Implementation**

If `FLinkDataView` is unassigned, Velox constructs `TdaSQLQueryDataView.Create(Self)`. It then executes an unchecked hard cast and assignment:

```Delphi
TdaSQLQueryDataView(FLinkDataView).Query :=
  TdaChildSQLClientDataSet(aDataSet);
```

The object reference returned in `Result` is `FLinkDataView`.

**Aliasing, ownership and lifetime**

- A later call rebinds the one cached view. All variables holding the earlier result still point to that object and now see the later dataset.
- The dataset remains owned by its original context. The view holds a reference; it does not clone records or schema.
- The view belongs to the scripter (`Self`) and is destroyed with it. Scripts must not free it or keep it beyond that context.
- Closing, moving or rebuilding the linked dataset changes the behaviour observed through the view.
- The hard cast performs no `is` check. Passing a different `TvxClientDataSet` implementation can lead to invalid member access rather than a friendly type error.

**Errors and side effects**

The method mutates shared binding state and has no exception handler. Allocation and object-access exceptions propagate into the script. It does not log or return `nil` on failure.

**Performance and concurrency**

Linking is constant-time after lazy creation, but processing through the view follows the dataset's cursor/query costs. Shared rebinding is not thread-safe and is unsafe for nested consumers requiring different stable datasets.

**Related entries**

- [`GetDataViewforDataSet`](GetDataViewforDataSet.md) is an exact wrapper.
- [`GetLinkedData`](GetLinkedData.md) is another exact wrapper.
- [`LinkedData`](LinkedData.md) obtains a view from current map context instead.

<small>Created 2026-07-15</small>
