---
title: Map processing flow
description: Source-verified sequence of linked data, record, detail and field processing in a Velox map.
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - maps
  - processing-flow
  - events
---

Velox processes a map as a hierarchy of view maps. Each view map can select linked source data, create destination records, map fields and recursively process child views. Event scripts run inside this flow and can change record control, field values, cursors, log status, cancellation and reprocessing.

## Sequence overview

For one call to a view map's data processor, the current implementation performs:

1. Clear the view's cancellation flag. A child call can also reset its master's reprocess flag.
2. If this is not a reprocess pass, call **OnStartMap** and reset the view's line counter.
3. Resolve **LinkedData**.
   - A non-nil data view drives a record loop.
   - An empty non-nil view creates no destination records.
   - A nil view causes one unlinked destination record to be processed.
4. For each record, insert a provisional destination record and initialise the record `Value` to Boolean `True`.
5. Call **BeforeMap**.
6. If `Value` is true, run all field OnMap paths, then all field **AfterMap** paths.
7. Call record-level **AfterMap**, including when BeforeMap set `Value` false.
8. Post or cancel the provisional record. Record AfterMap can change a false `Value` back to true and keep the record.
9. If `Value` is true, process each child/detail view map. A child can request that its parent be reprocessed.
10. Call **AfterDetailMap**, even when details were skipped because `Value` was false, provided the view was not cancelled.
11. Advance and re-evaluate the linked view, then repeat the record path while logging remains successful and the view is not cancelled.
12. If the view is neither cancelled nor still reprocessing, call **OnEndMap**.

Child view maps execute the same sequence recursively. Their OnStartMap and OnEndMap boundaries apply to the sequence initiated for the current master record.

## Record insertion and field phases

Velox inserts before BeforeMap so a script can work with an actual destination record and child datasets can obtain required parent/key state. Insertion increments view, map and line counters and performs the auto-primary-key path. If the script consumes that insert by posting or returning the view to browse state, Velox inserts again before field mapping.

Fields are deliberately processed in two passes. All OnMap calculations run first. All eligible field AfterMap scripts then run with their field's OnMap result. This permits final field logic to see other fields after initial mapping. Record AfterMap runs only after both field passes.

Before record AfterMap, Velox posts and re-enters edit state when the record is still valid. It posts again after record AfterMap so detail maps can use final parent fields. These posts can be relatively expensive for detail datasets and can trigger normal dataset validation/events.

## Linked data and cardinality

The LinkedData property invokes user code, rather than returning only a cached reference. The loop calls it in its condition, so the event may be re-evaluated between records. The selected view's cursor is advanced with `Next` after each processed record.

This creates three distinct cardinalities:

| LinkedData result | Destination record attempts |
|---|---:|
| `nil` | One |
| Assigned and empty/at EOF after positioning | Zero |
| Assigned with records | One per iterated record, subject to BeforeMap, errors and cancellation |

Do not change the returned view unpredictably between evaluations. A changing view or cursor can skip records, repeat work or prevent termination.

## Cancellation, logging and reprocessing

Most loops continue only while `Log.Status` is successful and cancellation is false. Most event exceptions are caught at their owning map/field boundary, logged with context and can change log status. LinkedData evaluation has no local exception handler in `ProcessDataView`; an exception there unwinds to the higher map/action caller. Cancellation stops later fields/records and suppresses OnEndMap.

Child code can request parent or grandparent reprocessing. The child marks itself cancelled and sets an ancestor's `Reprocess` flag. The parent detail loop reruns the affected view while the flag remains true. Guards reset flags in specific paths to avoid endless loops, including when a linked view reaches EOF or when a false record `Value` means no child will clear the state.

## Example

```Delphi
procedure BeforeMapEvent(var Value: Variant);
begin
  { Keep record control explicit; the map uses Boolean(Value). }
  Value := not IsNullorEmpty(DATA_Order['OrderNumber'].Value);
end;
```

This source-reviewed example illustrates one safe decision point. Replace the data variable with the configured name in the map.

## Common mistakes

- Treating the sidebar order as a chronological trace. LinkedData precedes BeforeMap, and field AfterMap precedes record AfterMap.
- Advancing the LinkedData cursor inside a record event while Velox also advances it.
- Assuming `Value := False` prevents record AfterMap or AfterDetailMap. Both can still run.
- Posting or inserting records without accounting for Velox's enclosing insert/edit/post sequence.
- Performing expensive work in LinkedData without realising the event can be called for every loop condition.
- Assuming OnStartMap/OnEndMap are once per action rather than once per view-map sequence.

## Edge cases and quirks

- When BeforeMap returns false, Velox delays cancellation until after record AfterMap so that event can restore `True`.
- A failed final post is logged, but the original exception is handled inside the map boundary; inspect log status rather than expecting it to propagate to another event.
- AfterDetailMap edits and posts the parent record after children have run. OnEndMap can also edit/post the current record at sequence completion.
- A nil LinkedData view and an empty LinkedData view intentionally have different record counts.
- Reprocess logic is stateful across parent/child views and should be used only through documented Velox functions that establish the expected flags.

## Related reference

- **Events** — required procedure signatures.
- **Datasets** — cursor, edit and post semantics.
- **Testing values** — Boolean and Variant decisions.
