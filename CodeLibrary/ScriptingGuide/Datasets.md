---
title: Datasets
description: How Velox scripts access, navigate and safely use registered source and destination datasets.
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - datasets
  - fields
  - records
---

Velox exposes datasets and query data views so scripts can read source records, populate destination records and work with temporary data. These are live objects owned by the current module, map or scripter—not detached value collections.

## Dataset models in scripts

Two related surfaces are common:

- `TDataSet` descendants expose standard cursor, field, edit and post operations such as `First`, `Next`, `EOF`, `FieldByName`, `Edit`, `Insert` and `Post`.
- Velox query data views expose fields, record position/count and mapping-specific operations and may wrap or own a client dataset/query.

The exact variable page tells you which object type a configured name provides. A LinkedData event requires a `TdaQueryDataView`; `GetLinkedData` adapts a supported client dataset to the view type expected by the map engine.

## Reading records

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  DATA_Order.First;
  while not DATA_Order.EOF do
  begin
    if not DATA_Order['OrderNumber'].IsNull then
      LogInfo(DATA_Order['OrderNumber'].AsString);
    DATA_Order.Next;
  end;
end;
```

This source-reviewed example assumes a configured `DATA_Order` variable and uses fictional field names. Use the exact variable and field names in the current configuration.

`First` positions at the first available record. `Next` posts pending changes according to normal dataset behaviour, advances the cursor and sets `EOF` after an attempt to move past the last record. For an empty dataset, both boundary flags can indicate no current data. Test field null state before converting.

## Field access

`FieldByName` returns the named field or raises a database error when it does not exist. `FindField` returns `nil` instead and is preferable for optional schemas. Some Velox data-view classes also provide a default string-indexed field property, allowing `DATA_Order['OrderNumber']`.

A field's `Value` is normally a Variant. Typed properties such as `AsString`, `AsInteger` or `AsDateTime` convert and can fail for null or incompatible content. `IsNull` identifies database null; it is not the same as an empty string.

## Editing and posting

Dataset state controls whether fields can be written:

- `Edit` changes the current record.
- `Insert` or `Append` creates a new record buffer.
- `Post` validates and saves the current buffer into the dataset/change log.
- `Cancel` abandons the current edit/insert buffer.

The ultimate database write can occur later when a client dataset applies updates or the owning Velox process commits. A successful `Post` is not automatically proof of an external transaction commit.

Map events already run inside an insert/edit/post sequence. Manual cursor movement, `Insert`, `Post` or `Cancel` can interfere with the map engine's current record and counters. Use those operations only when the event documentation explicitly describes the enclosing state.

## Lifetime, ownership and concurrency

Do not free datasets or data views supplied through Variables, Source, Dest, LinkedData or map context. Their owner controls connection state, query lifetime and cleanup. A dynamic object returned by a documented constructor may have different ownership; follow that entry.

Datasets have a mutable current cursor. Sharing one instance between threads or advancing it from nested code changes what every consumer sees. Velox map processing is synchronous in its action thread, but this does not make arbitrary shared dataset access thread-safe.

## Errors and performance

Opening, locating, converting, posting and applying updates can raise database exceptions. Velox boundaries often catch and log them, changing log status rather than allowing another event to catch the original exception. Check the operation's page and action log.

`RecordCount` is not a universal cheap emptiness test; descendants can fetch or calculate records differently. Prefer the documented `Empty`/`IsEmpty`, `EOF`/`BOF` or query-view property for the specific type. Repeated `FieldByName` and conversion in large loops also adds work; retain a field reference only while the dataset structure and lifetime remain stable.

## Common mistakes

- Freeing a context-owned dataset or data view.
- Using `FieldByName` for an optional field without handling its exception.
- Advancing the LinkedData cursor inside BeforeMap while Velox also calls `Next`.
- Assuming a posted client-dataset record is already committed to the remote database.
- Comparing a null field's Variant directly with text or zero.
- Assuming all dataset descendants support backward navigation or an accurate cheap `RecordCount`.

## Related reference

- **LinkedData** — selecting the view whose cursor drives map records.
- **Map processing flow** — the enclosing insert/edit/post sequence.
- **Testing values** — field and Variant null handling.

## External references

- [Free Pascal: TDataSet](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) — compatibility overview; Velox uses Delphi dataset implementations and its own descendants.
- [Embarcadero DocWiki: Data.DB.TDataSet](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) — Delphi base dataset contract.
