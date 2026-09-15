---
title: "AfterMap (Record)"
description: The record-level AfterMap event and its control over processing after mapped record fields.
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - events
  - aftermap
  - records
---

The record-level `AfterMapEvent` runs after the destination record's OnMap and field-level AfterMap passes, but before detail view maps. It receives the same `Value` Variant initialised for BeforeMap, so it can inspect or change whether the record is kept and whether detail processing proceeds.

## Syntax

```Delphi
procedure AfterMapEvent(var Value: Variant);
begin
  if not Boolean(Value) then
    Exit;

  { Apply record-wide logic after all mapped fields are available. }
end;
```

The source-reviewed example protects record-wide work when BeforeMap or earlier processing has already marked the record to be skipped.

## How it works

If BeforeMap allowed normal processing, Velox runs the OnMap pass for all fields, then the field-level AfterMap pass for all fields. It posts the record and re-enters edit state before invoking the record AfterMap event. This lets the script see completed field values and, if needed, use `Insert`/`Post` to create an additional record without automatically overwriting the mapped one.

Record AfterMap is also called when BeforeMap returned `False`, as long as the view was not cancelled. After it returns, Velox checks `Value` again. If BeforeMap requested cancellation but AfterMap changed `Value` back to `True`, Velox clears the pending revert and keeps the record. The final record is posted before detail maps so child foreign keys and cross-references can use it.

## Value and side effects

`Value` normally contains a Boolean. `False` suppresses detail processing and cancels the provisional record unless changed back to `True` here. `True` keeps the record and permits details. Field assignments update the record currently in edit state; dataset calls can create or post additional records.

## Errors

Compilation and signature failures are logged against AfterMap. Runtime exceptions are caught at the record AfterMap boundary and logged. After the handler, Velox still attempts its final post/cancel decision using the current log, cancellation and revert states. A caught error can therefore leave later processing stopped without propagating the original exception to script code.

## Edge cases and quirks

- Field-level AfterMap has already run. The same procedure name does not imply the same timing or `Value` meaning.
- The record may have been posted and reopened in edit mode before this event. Code that assumes a newly inserted, never-posted record can be wrong.
- AfterMap can rescue a record skipped by BeforeMap by assigning Boolean `True`; this is deliberate current behaviour.
- Returning `False` prevents detail processing, but AfterDetailMap is still called when the view has not been cancelled.
- Calling `Insert` and `Post` here can create additional records; it also changes which buffer is current, so such logic must be designed with the dataset page and exact map structure.

## Related reference

- **BeforeMap** — initialises the shared record-control value.
- **AfterMap (Field)** — completes each field before this record event.
- **AfterDetailMap** — runs after any allowed child maps.
