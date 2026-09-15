---
title: "LogSQL"
description: "Appends raw text to the current flow's SQL trace when SQL logging is enabled; it does not execute the statement."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - sql
  - trace
  - security
---

```Delphi
procedure LogSQL(const aSQLStatement: String)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // This records text only; it does not run the statement.
  LogSQL('select Code from ExampleTable where Num = 12345');
end;
```

### Usage

`LogSQL` appends raw text to the current flow's SQL trace when SQL logging is enabled; it does not execute the statement.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQLStatement` | `String`, `const` | Raw text appended as one `TStringList` item when `Log.LogSQL` is true. Empty and multiline strings are accepted. |

**Security and privacy**

SQL text commonly contains literals, customer identifiers, email addresses, tokens or credentials. `LogSQL` performs no masking or redaction, and the trace can be viewed in Velox logs or support workflows. Prefer parameter placeholders or sanitized diagnostic forms. Never concatenate secrets merely for logging.

The function does not provide SQL-injection protection because it does not execute anything. If the same constructed string is also executed elsewhere, secure that execution separately with typed parameters and constrained inputs.

### Additional Technical Info
`LogSQL` appends the supplied string to the current action log's SQL trace when that log has SQL logging enabled. It performs no SQL parsing, preparation, parameter binding, validation or execution.

Use it to make SQL executed elsewhere visible in the Velox log. Do not call it expecting data or database effects. The example contains fictional identifiers and was source-reviewed rather than executed.

**Implementation trace**

1. PascalScript evaluates the argument and calls `TvxScripter.LogSQL`.
2. The wrapper calls `Log.LogSQLScript(aSQLStatement)`.
3. `TvxLog.LogSQLScript` checks `FLogSQL`.
4. When enabled, it calls `FSQLScript.Add(aSQLStatement)`; when disabled, it returns without adding anything.

There is no return value telling the script whether logging was enabled. The flow's action configuration supplies `FLogSQL` to the execution log. New action/log objects default it true in current source, but saved configuration remains authoritative.

**Text is not executed**

The SQL trace is a diagnostic `TStringList` serialized with the log. Adding text cannot commit, roll back or even connect to a database. To execute SQL, use an explicitly documented database execution API with the appropriate connection and transaction semantics.

Because no parser is involved, the string can contain SQL for any dialect, comments, invalid syntax, ordinary prose or multiple statements. Velox preserves the supplied text as trace content; downstream rendering of embedded line endings follows string-list/serialization behavior.

**Status, persistence and size**

Adding SQL trace text does not create a normal log item and does not change Warning/Issue/Error status. Persistence depends on the master log's final status and configured save set. If SQL logging is disabled, even an expensive argument expression has already been evaluated before the native no-op.

There is no per-entry or total trace-size limit in this wrapper. High-volume row-level SQL logging can increase memory, serialization time and log storage substantially. Avoid logging large scripts or payloads repeatedly.

**Errors and concurrency**

Normal string/list allocation errors can propagate. No exception is used for the disabled case. The trace belongs to the current action log; do not treat it as a durable, independently committed audit channel.

**Related entries**

- [`LogSQLComment`](LogSQLComment.md) prefixes the supplied text with `-- ` before appending it.
- [`LogInfo`](LogInfo.md) creates an ordinary information item rather than SQL trace content.
- [`InvoiceIssue`](InvoiceIssue.md) executes deferred generated SQL through the system-data transaction; `LogSQL` does not.

<small>Created 2026-07-15</small>
