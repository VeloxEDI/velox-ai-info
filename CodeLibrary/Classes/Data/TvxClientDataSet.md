---
title: TvxClientDataSet
description: Provides Velox's host-owned in-memory client dataset for DATA variables, view queries, navigation, lookup, mutation, and packet persistence.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, data, client-dataset, cursor, records]
---

```Delphi
TvxClientDataSet = class(TClientDataSet)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if DATA1.Find('CustomerCode', 'ABC') then
  begin
    if DATA1['CustomerName'].IsNull then
      Value := Null
    else
      Value := DATA1['CustomerName'].AsString;
  end
  else
    Value := Null;
end;
```

### Usage

Use the host-provided `TvxClientDataSet` instances—such as `DATA1`, other configured `DATA*` variables and query datasets—to navigate, find, read and modify records held by the current Velox flow. Velox creates and owns these objects; scripts must not construct or free them.

Prefer business-key searches and named fields. To change data, use `Append`, `Insert` or `Edit`, assign field values, then `Post` or `Cancel`. Navigation and searches change the shared current record, so copy values you still need before calling code that may reposition the dataset. These operations normally affect in-memory flow data; external persistence belongs to the owning module or flow.

### Additional Technical Info

`TvxClientDataSet` is Velox's in-memory `TClientDataSet` descendant. Scripts encounter host-created instances as `DATA1`, other configured `DATA*` variables, variable `Data` values and client/SQL view `Query` objects. The host owns these objects; no script constructor is registered, so do not create or free them.

The example performs a single-field case-insensitive search, then uses the dataset's default named-field property. It preserves record null and relies on a configured schema. It is source-reviewed and was not executed by the documentation workflow.

**Public surface**

Velox explicitly registers 13 methods: packet Load/Save for file/stream, `EmptyDataSet`, `Empty`, `NotEmpty`, `Find`, three delete variants and two check-string methods. It exposes read/write `IndexFieldNames` and `RecordPosition`, read-only `FieldByIndex`, and default read-only `FieldName`.

Generic dataset members such as Active, BOF/EOF, Fields, First/Next/Prior, Edit/Post and RecordCount come from dataset ancestors and remain documented at their declaring/Common paths. The packet I/O members are documented in the following batch; this page describes their place in the object lifecycle.

**Construction and data-source lifecycle**

Native construction configures an in-memory client dataset with `StoreDefs=False`, string trimming disabled, automatic calculated fields disabled, `FetchOnDemand=False` and all packet records requested. It creates an owned SQL dataset and local provider, retains server order and disables provider constraints.

On a normal non-edit activation, the class temporarily attaches its provider, loads the client dataset, turns `LogChanges` off, disables constraints, detaches the provider and closes the SQL source. The result is an independent in-memory snapshot. An internal host-only edit mode keeps the provider/source attached while active; scripts cannot set that mode through this class surface.

Closing or reloading rebuilds cursor buffers and can invalidate field/bookmark/record-position assumptions. Destruction closes the client dataset, detaches the provider and frees its private provider/SQL objects.

**Cursor and shared state**

One instance has one mutable current record. `Find`, index changes, RecordPosition, inherited navigation, delete and load operations can all reposition or rebuild it. A saved `TvxField` reference follows that cursor and is invalid after schema destruction. Snapshot scalar values before calling helpers that may navigate.

The object, buffers, indexes and reusable check-string builder are unsynchronised. Keep every instance in its owning Velox flow/thread; do not share it concurrently.

**Velox-specific traps**

- `Empty` means exactly `EOF`, and `NotEmpty` means exactly `not EOF`. Calling Last makes EOF true on a nonempty dataset, so these names do not reliably test whether records exist.
- `Delete(aIndex)` treats its argument as a relative MoveBy distance, not an absolute index. An incomplete boundary move is ignored before the reached record is deleted.
- `FieldByIndex` searches native `FieldNo`; it is not zero-based ordinal access and can return nil.
- `RecordPosition` is a Cardinal wrapper over signed client-dataset `RecNo`; it is a mutable sequence position, not a durable record identifier.
- `CheckAll`/`CheckFields` concatenate formatted text without delimiters, so different values can produce the same result.
- `Find` accepts only a string KeyValues argument even though multi-field Delphi Locate requires a Variant array; use it for one key field.

**Mutation and persistence**

Delete operations change the in-memory dataset and can post a pending edit, fire events and move the cursor. Normal non-edit instances have change logging disabled, so do not assume a delta exists for ApplyUpdates. `EmptyDataSet` resets all records/change state without row-by-row delete events. External database/file persistence occurs only through the surrounding Velox flow or an explicit packet save; none of these in-memory operations commits an external transaction by itself.

**Performance**

Indexed/named field access is constant-time or hash/scan bounded as documented on its member page. Find may scan/filter the dataset; sorting builds an index; delete-all is a dataset reset. Packet operations are proportional to complete packet size and can allocate the packet in memory.

**Remarks**

Prefer named fields and business keys. Treat cursor position as transient, use BOF and EOF together for an empty cursor test, and let the owning Velox process control activation, updates and transactions.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TClientDataSet) - authoritative client-dataset and provider/snapshot context.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) - compatible generic dataset concepts; Velox executes the Delphi client-dataset and custom implementations detailed above.

<small>Created 2026-07-15</small>
