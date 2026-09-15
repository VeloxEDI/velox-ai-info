---
title: MasterTableName
description: Returns and caches the raw first selected table name of the view's assumed SQL master data view.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, sql, master-detail, table-name, unsafe]
---

```Delphi
property MasterTableName: string read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Read only when the configured master is another SQL data view.
  Value := Dataview.MasterTableName;
  if Value = '' then
    LogWarning('The current SQL view has no SQL master table name.');
end;
```

### Usage

`MasterTableName` returns and caches the raw first selected table name of the view's assumed SQL master data view.

**Behaviour**

- No master returns empty and is retried on later reads.
- A non-empty raw name is cached and returned thereafter.
- Only select-table index zero is represented; joins and additional tables are ignored.
- The property does not validate, quote or normalise the returned identifier.

**Errors**

Wrong master class, missing SQL/table metadata, destroyed master references and concurrent lifecycle changes can raise. No exception handling exists in the getter.

**Usage notes**

Do not use this property as a general “has master” test. Confirm the data definition uses an SQL master. Treat the returned raw name as metadata, not safe SQL text.

### Additional Technical Info
`MasterTableName` returns the *raw, unencoded* name of the first selected table in this view's master data view. Use it only when configuration guarantees that `MasterDataView` is another `TdaSQLQueryDataView` with at least one selected table.

The example states that prerequisite explicitly. It is source-reviewed and was not executed by the documentation workflow.

Unlike `TableName`, this getter uses `RawTableName`; it is not guaranteed to contain the connection's quoting/encoding for direct SQL use.

**Implementation**

While its cache is empty, the getter tests only whether `MasterDataView` is assigned. It then performs an unchecked cast to `TdaSQLQueryDataView` and reads `MasterDataView.SQL.SelectTables[0].RawTableName`. With no master it returns an empty string.

The view's separate runtime link code can accept either an SQL master or a `TdaCDSQueryDataView` master, so assignment alone does not prove that this getter's cast is valid.

**Edge cases and quirks**

- **Unsafe type assumption:** a client-dataset or other non-SQL master passes the Assigned test but is cast as this class. Reading can access incompatible object layout and raise an access violation or return corrupt data.
- A SQL master with no selected table causes an index/range failure.
- RawTableName may require dialect-specific quoting before SQL use and can differ from the master view's `TableName`/DataName.
- The non-empty cache is never invalidated when the master or its SQL changes, so it can silently describe a former relationship.

**Side effects**

Reading populates the local cache on a non-empty result. It does not activate the master, navigate data or execute SQL.

**Performance and concurrency**

The first successful read is constant-time metadata access and later reads are cached. The references and cache are unsynchronised and must remain in the configured flow lifecycle.

<small>Created 2026-07-15</small>
