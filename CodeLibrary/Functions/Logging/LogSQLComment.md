---
title: "LogSQLComment"
description: "Appends text prefixed with two hyphens to the current SQL trace when SQL logging is enabled; it does not execute SQL."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - sql
  - comment
  - trace
---

```Delphi
procedure LogSQLComment(const aSQLComment: String)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  LogSQLComment('Beginning the optional customer-reference lookup');
end;
```

### Usage

`LogSQLComment` appends text prefixed with two hyphens to the current SQL trace when SQL logging is enabled; it does not execute SQL.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSQLComment` | `String`, `const` | Comment text. It is evaluated before the enabled check and receives one prefix at the start of the whole string. |

**Security, persistence and limits**

No trim, escaping, masking or redaction is performed. Comments can disclose the same secrets or customer data as raw SQL. They are serialized with the master log only if that log is saved under its final-status policy.

There is no function-level length or count limit. Excessive comments increase in-memory trace size, log serialization cost and storage. Normal allocation errors can propagate.

### Additional Technical Info
`LogSQLComment` appends one string to the current flow's SQL trace when SQL logging is enabled. Velox prepends the exact characters `-- ` to the supplied text. It neither validates nor executes SQL.

Use it to annotate nearby SQL trace entries. The example is fictional and source-reviewed only.

**Implementation trace**

1. `TvxScripter.LogSQLComment` calls `Log.LogSQLComment(aSQLComment)`.
2. The native method tests `FLogSQL`.
3. If true, it adds `'-- ' + aSQLComment` to `FSQLScript`.
4. If false, it adds nothing and returns without a status result.

The call does not create a `TvxLogItem` and does not affect the flow's overall status.

**Multiline quirk**

Only the beginning of the supplied string is prefixed. For example, a value containing a line break:

```text
first line
second line
```

is stored conceptually as:

```sql
-- first line
second line
```

The second line is not independently commented and could appear executable if somebody later copies the trace into a SQL tool. `LogSQLComment` itself still never executes it. For unambiguous multiline trace comments, split and sanitize lines and call the function once per line.

**Logging switch and eager evaluation**

The flow action's `LogSQL` setting is copied into the execution log. When disabled, the native method is a silent no-op. Any concatenation, conversion or function call used to construct `aSQLComment` has already run on the script side.

**Related entries**

- [`LogSQL`](LogSQL.md) appends raw trace text without a comment prefix.
- [`LogInfo`](LogInfo.md) creates an ordinary searchable/captioned log item.
- [`LogTest`](LogTest.md) is controlled by test mode rather than the SQL-logging switch.

<small>Created 2026-07-15</small>
