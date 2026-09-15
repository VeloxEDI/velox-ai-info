---
title: LogSQLScript
description: Appends raw text to the diagnostic SQL trace when SQL logging is enabled, without executing or validating it.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, sql-trace, diagnostics]
---

```Delphi
procedure LogSQLScript(const aSQLStatement: String);
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Action.Log.LogSQLScript('select CODE from REFERENCE where ID = :ID');
  Value := True;
end;
```

### Usage

`LogSQLScript` appends raw text to the diagnostic SQL trace when SQL logging is enabled, without executing or validating it.

**Security, size and concurrency**

The text is not redacted. Do not log credentials, tokens, customer/personal data or SQL with embedded sensitive literal values. Empty and multi-line strings are accepted. Repeated/large statements grow memory and persisted log size, and the list is not synchronised for concurrent writers.

### Additional Technical Info
`LogSQLScript` appends a string to the current Log's diagnostic SQL script list.

If the host-controlled LogSQL flag is true, the exact supplied string is added to the list. If logging is disabled, the call is a silent no-op.

**No database effect**

Despite its name, this method never executes SQL. It does not:

- choose a connection or transaction;
- parse/validate syntax;
- substitute parameters/tags;
- append a terminator;
- change Log StatusType/Boolean Status; or
- create a normal log-message item.

Its output is retained diagnostic text for later log persistence/display. Use normal parameterised database APIs for actual database work.

**Related entries**

- [`LogSQLComment`](LogSQLComment.md) — adds `-- ` before diagnostic text.
- [`Clear`](Clear.md) — clears the collected SQL list.
- [`TvxLog`](../../TvxLog.md) — log ownership and persistence context.

<small>Created 2026-07-15</small>
