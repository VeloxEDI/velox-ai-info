---
title: "LogTest"
description: "Adds a user Test item only while the current scripter is in test mode, without changing overall flow status."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - test-mode
  - diagnostics
---

```Delphi
procedure LogTest(const aMesg: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  LogTest('Calculated test value: ' + VarToStr(Value));
end;
```

### Usage

`LogTest` adds a user Test item only while the current Velox execution is in test mode, without changing overall flow status.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMesg` | `string`, `const` | Text to add as a level-7 user Test item when test mode is active. Velox evaluates the expression used to produce the message even when test mode is off. |

### Additional Technical Info
`LogTest` adds a user Test item only when the current scripter's `Test` property is true. In production/non-test execution the procedure does nothing and gives no indication that its message was discarded.

It does not change overall status in either mode. Use it for diagnostic detail that should be present in Velox Test runs but absent from normal production logs. The example is fictional and was reviewed from source rather than executed.

**Implementation trace**

1. PascalScript evaluates `aMesg` and calls `TvxScripter.LogTest`.
2. The wrapper checks `if Test then`.
3. In test mode it calls `Log.LogTest(aMesg)`, which creates a level-7 item.
4. Level 7 maps the item to `flsTest` and `User=True`, with caption `User Test`.
5. `MessageLog` deliberately does not change the enclosing log's overall status for level 7.

In non-test mode steps 3-5 do not occur. There is no Boolean return, counter or fallback log entry.

**Performance implication of eager arguments**

String concatenation, conversions and function calls used to build `aMesg` happen even in production, because ordinary PascalScript arguments are evaluated before the native wrapper checks `Test`. Avoid expensive or side-effecting expressions inside a `LogTest` argument. If needed, guard the call with a script-visible test condition available in the relevant context.

**Persistence and Test rollback**

Test items live in the current flow log. The overall final status controls whether the master log is saved; the item does not make the final status Test. Velox Test mode rolls back configured database transactions and handles generated files according to Test flow behavior, but logging the text itself does not create a rollback boundary.

The message can still contain sensitive data and can be persisted in a test log. The normalized database description is prefix-limited to 448 or 840 characters depending on compatibility; the serialized log may retain more.

**Related entries**

- [`LogInfo`](LogInfo.md) records information in both test and production execution.
- [`LogHighlight`](LogHighlight.md) adds a prominent Note without changing status.
- [`LogSQL`](LogSQL.md) is independently controlled by the flow's SQL-logging setting, not by test mode.

<small>Created 2026-07-15</small>
