---
title: Events
description: Velox script entry points and the order in which map-processing event scripts run.
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - events
  - map-processing
---

Events are named procedures that Velox compiles and calls at specific processing boundaries. Their signatures are contracts: the compiler verifies the procedure name, number and type of parameters, and whether a parameter is passed by reference.

## Event contracts

| Event | Required procedure shape | Scope |
|---|---|---|
| ScriptEvent | `procedure ScriptEvent(var Value: Variant);` | General formula or host-specific script |
| OnStartMap | `procedure OnStartMapEvent;` | Once before a view map's current record sequence |
| LinkedData | `procedure LinkedDataEvent(var LinkedData: TdaQueryDataView);` | Selects the data view that drives record iteration |
| BeforeMap | `procedure BeforeMapEvent(var Value: Variant);` | Before field mapping for one destination record |
| AfterMap (Field) | `procedure AfterMapEvent(var Value: Variant);` | Final per-field transformation |
| AfterMap (Record) | `procedure AfterMapEvent(var Value: Variant);` | After the record's field passes and before detail maps |
| AfterDetailMap | `procedure AfterDetailMapEvent(var Value: Variant);` | After detail maps for the record |
| OnEndMap | `procedure OnEndMapEvent;` | Once after the view map's current record sequence |

Field and record AfterMap editors use the same procedure signature, but Velox invokes them from different owners and with different meanings for `Value`.

## Source-defined runtime order

The navigation order is a stable learning order, not a literal call trace. The current map implementation runs:

1. `OnStartMapEvent` when the view is not being reprocessed.
2. `LinkedDataEvent` while resolving the linked view; it can be evaluated again for loop conditions.
3. For each output record: `BeforeMapEvent`, all field OnMap scripts, all field `AfterMapEvent` scripts, then the record `AfterMapEvent`.
4. Child/detail view maps, each with their own nested event sequence.
5. `AfterDetailMapEvent` for the current record.
6. The next linked record, if any.
7. `OnEndMapEvent` after the sequence, unless the view was cancelled or left in reprocess state.

This exposes two important quirks: LinkedData runs before the first record's BeforeMap, and field-level AfterMap runs before record-level AfterMap. Do not infer runtime chronology from the sidebar placement.

## Compilation and errors

Each event has its own scripter and owner-level compiled flag. The first use after a formula change compiles the script with the map's source, destination and Global Script context. A compilation failure is logged with the event and map path, and no delegate is returned. Most event calls have a local map/field exception boundary that logs failures; LinkedData resolution is the exception and can unwind from `ProcessDataView` to its higher caller. Posting or subsequent events depend on the resulting log, cancellation and `Value` states.

## Common mistakes

- Using `ScriptEvent` in a map event editor instead of the generated event-specific name.
- Omitting `var`, which prevents the script from returning a changed `Value` or `LinkedData` reference.
- Assuming `AfterMapEvent` always means the record event; field and record owners provide different input state.
- Expecting OnStartMap and OnEndMap once per entire action. A child view runs them once for each sequence initiated for its master record.
- Setting `Value` to a non-Boolean value in record-control events and relying on an implicit conversion.

## Related reference

- **Map processing flow** — the complete record, field and detail call sequence.
- **Testing values** — safe handling of mutable Variant parameters.
- **Datasets** — linked views and current-record state.
