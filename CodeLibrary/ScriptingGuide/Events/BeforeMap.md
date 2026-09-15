---
title: BeforeMap
description: The record event that can allow or skip subsequent processing through its mutable Value.
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - events
  - beforemap
  - records
---

`BeforeMapEvent` runs after Velox has inserted a provisional destination record but before normal field mapping. Its `Value` parameter starts as Boolean `True`; setting it to `False` suppresses the field passes and marks the provisional record for cancellation unless the record-level AfterMap later changes it back to `True`.

## Syntax

```Delphi
procedure BeforeMapEvent(var Value: Variant);
begin
  Value := True;
end;
```

## How it works

For each record, the view map:

1. Inserts a destination record and increments its record, line and map counters. Auto primary-key mapping can occur during that insert.
2. Assigns Boolean `True` to `Value`.
3. Compiles and invokes `BeforeMapEvent` unless the view has been cancelled.
4. Converts `Value` to Boolean. `False` skips both field passes; `True` continues.
5. Invokes record-level AfterMap even when BeforeMap returned `False`, provided the view was not cancelled.
6. Cancels the provisional record if the skip flag remains in force, or posts it when processing remains successful.

The inserted record lets a BeforeMap script set destination fields or create related records. If user code posts or otherwise leaves the destination view in browse state, Velox inserts again before normal field mapping so the map still has an editable record.

## Example

```Delphi
procedure BeforeMapEvent(var Value: Variant);
begin
  { Replace DATA_Order with the configured data variable in this map. }
  Value := not IsNullorEmpty(DATA_Order['OrderNumber'].Value);
end;
```

This source-reviewed pattern skips a destination record whose configured source order number is null or empty. The exact data variable is configuration-specific.

## Side effects

Changing `Value` changes record control. Assigning destination fields changes the provisional record. Calling `Insert`, `Post` or other dataset methods can create additional records and changes the dataset state Velox must recover before its own field pass.

## Errors

The procedure must have one `var Variant` parameter. Compilation failure is logged with the map path. Runtime exceptions are caught and logged around BeforeMap. The provisional record is later posted or cancelled according to `Value`, log status and cancellation state; an exception is not equivalent to explicitly setting `Value := False`.

## Edge cases and quirks

- LinkedData is resolved before BeforeMap, despite the sidebar placing BeforeMap first for learning order.
- `Value` is a Variant but Velox converts it directly to Boolean. Assign a real Boolean; an incompatible Variant can raise a conversion exception.
- Returning `False` does not prevent record-level AfterMap. AfterMap can set `Value` back to `True`, which clears the pending cancellation and keeps the record.
- AfterDetailMap is still reached when the view is not cancelled, even if no child maps ran because `Value` was false.
- Counters increment at insertion and are decremented by Velox's cancellation path; bypassing normal dataset state can make custom record manipulation difficult to reason about.

## Related reference

- **AfterMap (Record)** — last opportunity to change the record-control value before detail processing.
- **AfterDetailMap** — runs after any child processing for the record.
- **Datasets** — editing and posting rules.
