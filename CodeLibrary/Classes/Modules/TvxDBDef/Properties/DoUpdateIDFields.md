---
title: DoUpdateIDFields
description: Gets or sets the transient one-shot latch that permits this definition's processed-record update during flow finalisation.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - database-definition
  - runtime-state
  - record-flagging
---

```Delphi
property DoUpdateIDFields: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Source <> nil then
    Value := Source.DoUpdateIDFields
  else
    Value := False;
end;
```

### Usage

`DoUpdateIDFields` gets or sets the transient one-shot latch that permits this definition's processed-record update during flow finalisation.

**Lifecycle**

For database source processing, map/report execution clears the latch before reading and sets it to `True` after successful processing when source data was found. During non-test flow finalisation, the action manager calls the Velox update for database source definitions while log status remains successful.

The update method requires both `UpdateIDFields` and `DoUpdateIDFields`. When both are true, it clears `DoUpdateIDFields` before iterating flagged SQL dataviews. Consequently the latch is one-shot even if SQL generation/execution later fails.

### Additional Technical Info
`DoUpdateIDFields` is the runtime permission latch used in addition to persisted [`UpdateIDFields`](UpdateIDFields.md) configuration before Velox updates processed-record flag fields.

The native reset path sets it to `False`. It is not a published/persisted database-definition option.

**Writes and side effects**

The scripting setter directly replaces the Boolean without validation or logging:

- setting `False` before finalisation can suppress an otherwise eligible update;
- setting `True` on a definition that is actually finalised as a source can permit an update even if the normal map/report source-data gate did not set it;
- setting it does not itself read data, execute SQL, change `UpdateIDFields` or guarantee the finalisation path will be reached.

Because forcing/suppressing processed-state updates changes replay and duplicate-processing behaviour, scripts should normally observe this property rather than manage it. Change it only as part of a reviewed flow design with an explicit retry/idempotency policy.

**Edge cases and quirks**

- The latch has meaning only when persisted flagging is enabled and eligible dataview/primary-key state exists.
- A true value on a destination-only object is not proof that the action manager will consume it; finalisation iterates source definitions.
- Test mode bypasses processed-record updates and rolls back database work.
- A failed update leaves the latch false; retry normally requires a fresh processing cycle or explicitly governed reset.
- The main definition transactions are committed before the flagging loop. A failure can leave processed business changes committed but source rows unflagged, and the false log status prevents later source definitions from being flagged in that finalisation pass.
- This is live mutable execution state, not success evidence. It says nothing about whether SQL ran, committed or affected rows.

**Performance and concurrency**

Access is constant-time. The later consumer can perform database I/O. Do not race scripts, mapping logic and finalisation over the same definition instance.

**Related entries**

- [`UpdateIDFields`](UpdateIDFields.md) — persisted master enablement.
- [`CustomIDField`](CustomIDField.md) and [`CustomIDValue`](CustomIDValue.md) — generated assignment.
- [`TvxDBDef`](../../TvxDBDef.md) — source-processing and transaction context.

<small>Created 2026-07-15</small>
