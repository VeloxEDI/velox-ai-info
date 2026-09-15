---
title: LogSQLComment
description: Appends a double-hyphen-prefixed comment to the diagnostic SQL trace when SQL logging is enabled.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, execution-log, sql-trace, comment]
---

```Delphi
procedure LogSQLComment(const aSQLComment: String);
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Action <> nil then
    if Action.Log <> nil then
      Action.Log.LogSQLComment('Customer lookup uses parameterised values');
  Value := True;
end;
```

### Usage

`LogSQLComment` appends a double-hyphen-prefixed comment to the diagnostic SQL trace when SQL logging is enabled.

**Security and performance**

Never include passwords, access tokens, personal/customer data or raw parameter values. Log access can outlive the action and be available to support/operations users. Appending is cheap but unsynchronised; large/repeated comments increase memory and persisted log size.

### Additional Technical Info
`LogSQLComment` adds explanatory text to the Log's diagnostic SQL script list.

When the host-controlled LogSQL flag is true, the implementation appends one string formed as:

```SQL
-- <aSQLComment>
```

When LogSQL is false, it does nothing. The method does not return whether text was retained.

**No SQL execution**

This method does not parse, parameterise, validate or execute SQL, change Log status or create a normal message item. The collected list is diagnostic/persistence content used when the execution log is saved or displayed.

The prefix is always added, even if the input already begins with comment syntax. Embedded line breaks or SQL text are not sanitised.

**Related entries**

- [`LogSQLScript`](LogSQLScript.md) — appends raw statement text.
- [`Clear`](Clear.md) — clears the SQL trace with the rest of the current log.
- [`TvxLog`](../../TvxLog.md) — ownership and diagnostic lifecycle.

<small>Created 2026-07-15</small>
