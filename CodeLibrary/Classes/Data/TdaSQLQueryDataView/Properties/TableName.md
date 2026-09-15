---
title: TableName
description: Returns and caches the database-formatted DataName of the first table selected by this SQL view.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, sql, table-name, metadata, cache]
---

```Delphi
property TableName: string read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Read after the SQL view has at least one configured select table.
  Value := Dataview.TableName;
end;
```

### Usage

`TableName` returns and caches the database-formatted DataName of the first table selected by this SQL view.

**Behaviour**

- The first selected table supplies the value, regardless of additional joined tables.
- A non-empty value is cached and returned for all later calls.
- If DataName itself is empty, each read retries index zero.
- The formatting reflects the SQL object's current connection/dialect metadata at the time of the first non-empty read.

**Errors**

Missing/destroyed SQL metadata or an empty select-table list can raise. Dialect/configuration changes can instead produce a stale but syntactically valid value, which is harder to detect.

**Usage notes**

Read after SQL design is complete and avoid changing the view's selected tables afterward. Use this convenience metadata only for its documented first-table meaning.

### Additional Technical Info
`TableName` returns `DataName` for the first table in the view's configured SQL select-table list. DataName is the database-formatted form used by Velox (for example, a reserved identifier may already be delimited). It is not the complete SELECT source and does not describe joins.

The example relies on the view's governed SQL configuration. It is source-reviewed and was not executed by the documentation workflow.

The result is lazily cached in the view. It is also the fallback UPDATE target used by processed-record flagging when `FlagTableName` is empty or whitespace.

**Implementation**

If its private cache is empty, the getter reads `SQL.SelectTables[0].DataName` and stores it. It performs no count check, activation, re-encoding or later invalidation.

**Edge cases and quirks**

- No selected table causes an index/range failure; the getter does not return empty safely in that case.
- The cache is never cleared when SQL, database connection/dialect or select tables change. A live reconfiguration can therefore return an obsolete target indefinitely.
- “First table” may not be the table a script expects in a joined query and may not be appropriate for an UPDATE. Use governed `FlagTableName` configuration when flagging must target another table.
- Database-formatted does not mean safe to combine with arbitrary strings. Never use untrusted content to extend an SQL statement.

**Side effects**

The first non-empty read populates a cache. It does not open Query, navigate records or execute SQL. Later processed-flag operations can use the cached text as their target.

**Performance and concurrency**

Access is constant-time. The cache and underlying SQL definition are unsynchronised; read only within the configured view lifecycle.

<small>Created 2026-07-15</small>
