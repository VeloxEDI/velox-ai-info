---
title: "GetReportFID"
description: "Resolves a report module name to its live Velox system-configuration FID."
sidebar_position: 41
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - fid
  - configuration
  - database
  - report
---

```Delphi
Function GetReportFID( const aName : string) : TGuid
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  ModuleFID: TGuid;
begin
  ModuleFID := GetReportFID('Daily Exceptions');
  Value := GUIDToStringNoBraces(ModuleFID);
end;
```

### Usage

`GetReportFID` resolves a report module name to its live Velox system-configuration FID.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aName` | `string`, `const` | Report `MODULENAME` to find. The shared SQL literal helper removes embedded NUL characters and doubles apostrophes. |
| Result | `TGuid` | Matching `FID`, or all-zero `EmptyGuid` if the query returns no row. |

**Behaviour and edge cases**

- Case sensitivity, character comparison, trailing-space behavior and collation come from the configuration database.
- `SQLString` removes embedded `#0` before quoting, so a name containing NULs is normalized and the conversion is lossy.
- There is no `order by` or uniqueness check. Duplicate matching names produce a database-dependent first row.
- Missing data and a stored all-zero FID have the same result. Test [`IsEmptyGuid`](../Guid/IsEmptyGuid.md).
- The result reflects live connection/transaction state; rename, deletion or replacement can affect later calls.
- Resolving an FID does not prove that the module is enabled, authorized, valid for a later operation or suitable for the caller's purpose.

### Additional Technical Info
`GetReportFID` looks up the Report whose `MODULENAME` equals `aName` and returns its binary `TGuid` FID. It reads the current Velox system/configuration database; it is not a compile-time constant or cached name map.

The example name is fictional and source-reviewed only. The documentation workflow did not execute the lookup.

**Implementation**

The scripting import binds directly to the Velox FID helper. This wrapper calls [`GetFID`](GetFID.md) with fixed table `VX_REPORT`. The shared implementation allocates a query from the live system connection, executes `select FID from VX_REPORT where MODULENAME = <escaped aName>`, reads the first row or uses `EmptyGuid`, and frees the query in a `finally` block.

The fixed table removes the generic function's caller-controlled table-identifier boundary.

**Side effects and errors**

The query is read-only but allocates a database resource and uses the shared system connection. Connection, schema, permission, SQL execution and GUID-conversion failures propagate. Only a successful no-row query becomes `EmptyGuid`.

**Performance and concurrency**

Every call creates and executes a query; there is no per-name cache. Resolve stable names outside record-level loops and reuse the `TGuid`. Cleanup is deterministic, while pooling, isolation, locking and concurrent configuration changes follow the shared connection/database.

**Related entries**

- [`GetFID`](GetFID.md) documents the common query and generic dynamic-table security boundary.
- [`EmptyGuid`](../Guid/EmptyGuid.md) is the no-row sentinel.
- [`GUIDToStringNoBraces`](../Guid/GUIDToStringNoBraces.md) renders the binary result.
- [`SQLString`](../String/SQLString.md) documents the lossy name escaping.

<small>Created 2026-07-15</small>
