---
title: "GetIssueLevel"
description: "Returns the Status integer for an Issue definition, defaulting to error level 6 when the issue number is absent."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - issue
  - status
  - vxdata
---

```Delphi
Function GetIssueLevel(aIssueNum: integer): integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var Level: integer;
begin
  // Fictional Issue.Num; this performs a VxData query.
  Level := GetIssueLevel(1002);
  Value := Level;
end;
```

### Usage

`GetIssueLevel` returns the Status integer for an Issue definition, defaulting to error level 6 when the issue number is absent.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aIssueNum` | `integer` | Numeric key searched as `Issue.Num` in the current VxData/system-data connection. |

**Returns**

The row's `Status` value as an `integer`. When the query returns no row, the result remains the initial value `6`.

Velox normally interprets values using `TvxLogStatusType`:

| Value | Velox name | Meaning |
|---:|---|---|
| 0 | `flsNotSet` | Not set |
| 1 | `flsOK` | Successful |
| 2 | `flsWarning` | Warning |
| 3 | `flsIssue` | Business issue |
| 4 | `flsDuplicate` | Duplicate |
| 5 | `flsCancelled` | Cancelled |
| 6 | `flsError` | Error; also the missing-row default |
| 7 | `flsTest` | Test |
| 8 | `flsHighlight` | Note/highlight |

The function does not range-check the database value. A stored value outside `0..8` is returned unchanged.

### Additional Technical Info
`GetIssueLevel` reads the numeric `Status` for one row in the VxData `Issue` table. If that issue number is not present, it returns `6`, which Velox uses for Error.

The function performs a database query on every call. It does not inspect the current flow log and does not itself add an issue or log entry. The example is fictional and source-reviewed; it was not executed.

**Implementation trace**

1. Initialize `Result := 6`.
2. Create a new query from `gSystemConnection.SQLD`.
3. Disable parameter checking and construct `select [Status] from Issue where Num = <aIssueNum>` using the decimal integer.
4. Open the query.
5. If a row exists, copy the first field through `AsInteger` into `Result`.
6. Close and free the query.

Although the statement is composed as text rather than a bound parameter, `aIssueNum` is already a strongly typed 32-bit integer and is formatted with `IntToStr`; arbitrary SQL text cannot be supplied through this argument.

**Missing and invalid definitions**

A missing number and a configured Error issue both return `6`; the caller cannot distinguish them through this API. Validate issue configuration separately when that distinction matters.

Duplicate `Issue.Num` rows are not expected. If they exist, the function reads the first row returned by SQL Server without an `ORDER BY`.

**Side effects and errors**

The function opens a VxData query and can acquire a database connection or transaction resources according to `SQLD`. It catches no exception. Connection, permission, SQL, conversion and database availability failures propagate to the script.

The query is freed in `finally`, including on failure. There is no log entry, retry, cache or fallback for database exceptions.

**Performance and concurrency**

Each invocation is a separate query. Avoid repeated calls for the same issue inside high-volume row loops when the result can be retained safely. The returned value is a database snapshot and can become stale if the Issue definition changes concurrently.

**Related entries**

- [`InvoiceIssue`](InvoiceIssue.md) calls this function while queuing a header issue.
- [`InvoiceLineIssue`](InvoiceLineIssue.md) is intended to call the same lookup for a line issue but currently has a runtime registration defect.
- [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md) defines the native status ordering represented by the common values.

<small>Created 2026-07-15</small>
