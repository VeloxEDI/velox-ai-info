---
title: Query
description: Returns the SQL view's live client dataset. Direct replacement can permanently change the view and should not be used in normal scripts.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, sql, client-dataset, ownership, lifecycle]
---

```Delphi
property Query: TvxClientDataSet read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Rows: TvxClientDataSet;
begin
  Rows := Dataview.Query;
  if Rows.Active then
    Value := Rows.RecordCount
  else
    Value := 0;

  // Do not free Rows and do not assign Dataview.Query directly.
end;
```

### Usage

`Query` returns the SQL view's live client dataset. Direct replacement can permanently change the view and should not be used in normal scripts.

**Behaviour**

- Reading returns the live SQL result dataset. `Query`, the view and the report pipeline share one cursor, so navigation through any of them changes the current record seen by the others.
- Do not assign a different dataset in normal scripts. The first different assignment disposes of the existing query and permanently changes how the view handles later replacements and opening errors.
- Reset and deactivation can close the dataset and invalidate saved fields or bookmarks even though the `Query` reference remains non-`nil`.

**Errors**

Dataset operations can raise for inactive state, missing fields, invalid cursor/edit state, SQL/connection failures and constraints. Unsafe replacement can cause nil dereferences, invalid object access, stale metadata, dangling references or delayed failures in activation/saving.

**Usage notes**

Treat direct assignment as an advanced operation, not a routine data-loading API. Use `LinkDataView` when a Velox helper requires a view for an existing dataset. Never retain `Query` beyond the dataset or view that provides it.

### Additional Technical Info
`Query` returns the live client dataset used by this SQL view, its DataSource and report pipeline. Normal scripts should treat the returned object as borrowed: use it within the current event/flow, do not free it and do not assign the property directly.

The example performs a read-only observation without retaining the reference. It is source-reviewed and was not executed by the documentation workflow.

The compiler-visible type is `TvxClientDataSet`. Native storage and runtime helpers use the more specialised `TdaChildSQLClientDataSet`, creating a wider script contract than the implementation actually expects.

**Implementation**

The constructor creates `TdaChildSQLClientDataSet(Self)`, applies the owner definition's string-trimming setting and connects the owned DataSource. In the normal state, the view explicitly frees that dataset at destruction. View navigation, field access, link indexes, activation/reset and record/key operations use the FQuery pointer.

The setter supports Velox's internal `LinkDataView(aDataSet)` adapter. On the first *different* value it frees the normal owned Query and permanently sets `FQueryAssigned`. It then stores the supplied pointer and reconnects `FDataSource.DataSet`. Subsequent different values replace only that borrowed pointer. When `FQueryAssigned` is True, the view destructor does not free the current Query.

`LinkDataView` creates/reuses a temporary SQL-view wrapper, casts the supplied `TvxClientDataSet` to the child SQL class and assigns this property. Scripts should call that helper rather than reproduce the setter protocol.

**Edge cases and quirks**

- Passing nil destroys the original dataset, sets DataSource.DataSet to nil and leaves the irreversible assigned state. Later view operations dereference nil.
- The compiler accepts any `TvxClientDataSet`, while the runtime helper performs no explicit specialisation check. SQL-child-only operations may touch incompatible object state.
- Replacement does not apply DisableStringTrim, SQL connection, SQL text, packet/link/index settings or other normal child initialisation to the supplied dataset.
- The view no longer owns an assigned dataset. If its real owner frees it first, Query and DataSource become dangling; if nobody owns/frees it, it leaks.
- Reassigning cannot restore the constructor-owned lifecycle because `FQueryAssigned` never becomes False and the original object has already been freed.
- The DataSource is reconnected, unlike `TdaCDSQueryDataView.Query`, but dependent view SQL/key metadata can still describe a different dataset.

**Side effects**

Reading has no immediate side effect. First different assignment frees an object and changes ownership mode; every different assignment changes the shared dataset behind the DataSource/pipeline.

**Performance and concurrency**

The getter and pointer switch are constant-time, but first replacement destroys the existing dataset and its buffers. Dataset operations scale with records, fields, indexes and BLOBs. There is no synchronisation across Query, view, DataSource and pipeline.

**External references**

- [Embarcadero DocWiki: `Datasnap.DBClient.TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TClientDataSet) - inherited client-dataset behaviour; the replacement/ownership protocol is specific to Velox.

<small>Created 2026-07-15</small>
