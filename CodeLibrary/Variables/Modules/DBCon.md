---
title: "DBCon"
description: "Returns the first database connection currently attached to the script's Source definition."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variable
  - database-connection
  - source
---

```Delphi
function DBCon: TvxDBCon;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Connection: TvxDBCon;
begin
  Connection := DBCon;
  if Connection <> nil then
    Value := Connection.ModuleName
  else
    Value := Null;
end;
```

### Usage

`DBCon` returns the first database connection currently attached to the script's Source definition.

**Value and availability**

The result is `FSource.DBCons[0].DBCon` when `FSource` is assigned and `DBConCount > 0`; otherwise it is nil. The function does not search later links, choose by name or create a connection.

**Ownership, errors and performance**

Velox owns the returned `TvxDBCon`; never free it or retain it beyond the current execution. The getter is constant-time and performs no database I/O. Its explicit absent-context path returns nil. Errors from later connection operations follow the called member and propagate as documented there.

### Additional Technical Info
`DBCon` is a function-backed context value that returns the current Source data definition's first database connection object. It re-evaluates the Source on each call rather than returning a connection cached when the script compiled.

**Implementation**

`EngineCompile` registers `TvxScripter.DBCon` as a method in the Modules variable category. Its body checks the current `FSource` and its connection count every time. The source comment explains that this avoids retaining stale database objects when the database changes for each action execution.

**Behaviour and edge cases**

- The result can be nil. Check once and retain the local reference for the immediate operation, as in the example.
- Only index zero is returned when Source has multiple database connections. Use APIs on the data definition when another link is required.
- A non-nil result does not prove that the connection is open, reachable, authorized or correctly configured.
- Repeated `DBCon` calls can observe a different current object if host context changes; do not assume identity across executions.
- Calling the accessor does not connect to the database by itself, but methods/properties used on the returned object can perform database work.

**Related entries**

- [`Source`](Source.md) is the data definition inspected by this accessor.
- [`FileCon`](FileCon.md) returns a separately injected file connection and does not inspect `Source`.

<small>Created 2026-07-15</small>
