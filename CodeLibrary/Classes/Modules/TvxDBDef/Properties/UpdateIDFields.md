---
title: UpdateIDFields
description: Gets or sets persisted enablement for flagging successfully processed database source records.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - database-definition
  - configuration
  - record-flagging
---

```Delphi
property UpdateIDFields: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Source <> nil then
    Value := Source.UpdateIDFields
  else
    Value := False;
end;
```

### Usage

`UpdateIDFields` gets or sets persisted enablement for flagging successfully processed database source records.

**Execution behaviour**

True is only the master enablement. Velox record flagging also requires:

- a true transient [`DoUpdateIDFields`](DoUpdateIDFields.md) latch;
- a successful, non-test source-processing/finalisation path;
- flagged SQL dataviews with captured primary keys; and
- valid trusted [`CustomIDField`](CustomIDField.md)/[`CustomIDValue`](CustomIDValue.md) SQL configuration.

False makes the record-update operation return successfully without executing flag SQL. True is not evidence that rows were read, an update ran, affected rows or committed.

**Risks and quirks**

- Enabling at script time can unexpectedly open/validate database definition state and produce database, UI/log or configuration side effects.
- Script-controlled changes can alter duplicate/replay behaviour for the current run. Do not toggle this as a substitute for designed idempotency.
- Flagging runs after the main definition commit/rollback phase. A failure can turn the final flow status false but cannot undo already committed database work or completed non-database effects, leaving replay/duplicate-processing exposure.
- Velox SQL is concatenated rather than parameterised; enabling untrusted field/value configuration is unsafe.
- Existing old-format definitions can ignore the setter because of the migration guard.

### Additional Technical Info
`UpdateIDFields` is the persisted database-definition setting that enables Velox to mark successfully processed source records by executing configured update SQL after flow processing.

New definitions default to `False`. Legacy ID-management configuration can migrate this value to true and initialise FloID-style field/value settings.

**Setter implementation**

The setter first checks a legacy-load guard. If old ID-management data was read for this object, it returns without changing the value; a scripting assignment can therefore appear to succeed but read back unchanged.

Otherwise it stores the Boolean. During ordinary runtime writes (outside component loading), setting true also attempts to open/inspect the database definition. Velox checks for configured primary keys and logs guidance when the custom field/value is empty; inability to open the database logs an error. Setting false performs no corresponding close or rollback operation.

The setter does not save the module. A script changes the currently loaded object unless a separate authorised host workflow persists it.

**Performance and concurrency**

Reading is constant-time. A true write can open/inspect configured data and later enables potentially multi-statement updates. Do not reconfigure a definition while another thread/action is using it.

**Related entries**

- [`DoUpdateIDFields`](DoUpdateIDFields.md) — transient per-processing latch.
- [`CustomIDValueProcessed`](../Methods/CustomIDValueProcessed.md) — tag-expanded SQL expression.
- [`TvxDBDef`](../../TvxDBDef.md) — complete record-flagging lifecycle.

<small>Created 2026-07-15</small>
