---
title: TFields
description: Provides dataset-owned ordered and named access to the field objects for the current dataset schema and record.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, data, fields, dataset, lookup]
---

```Delphi
TFields = class(TObject)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FieldList: TFields;
  Field: TField;
  I: Integer;
begin
  FieldList := Dataview.Query.Fields;
  Value := '';
  for I := 0 to FieldList.Count - 1 do
  begin
    Field := FieldList[I];
    if Value <> '' then
      Value := Value + ', ';
    Value := Value + Field.FieldName;
  end;
end;
```

### Usage

`TFields` provides dataset-owned ordered and named access to the field objects for the current dataset schema and record.

**Usage notes**

Prefer `FieldByName` for required schema and `FindField` for genuinely optional fields. Use indexes only when the schema order is an explicit contract, and treat every returned object as a borrowed cursor-bound reference.

**Errors and side effects**

Read-only lookup/index operations do not navigate, post or apply data. They can raise for invalid/destroyed collection state, an invalid index, or a missing `FieldByName` name. A write through `Fields[Index]` mutates the destination current-record buffer and can raise for null/type conversion, inactive/read-only/non-edit state, validation or provider constraints.

### Additional Technical Info
`TFields` is the ordered, named collection of `TField` objects belonging to a Delphi dataset or object field. In normal Velox use, obtain it from a view's query/dataset `Fields` property. The collection and its fields are host-owned: do not construct, free or transfer ownership of them.

The example snapshots the collection, uses its default indexed property and builds a comma-separated schema list. It is source-reviewed and was not executed by the documentation workflow.

**Exposed surface**

Velox compiler/runtime registration exposes exactly:

- `FieldByName(const FieldName: string): TField`
- `FindField(const FieldName: string): TField`
- read-only `Count: Integer`
- default indexed read/write `Fields[Index: Integer]: TField`

No constructor is exposed. Native methods for adding, removing, clearing or reordering fields are deliberately unavailable to scripts. Generic field operations are declared by the hidden `TField` ancestor and remain documented at that declaring-owner path rather than being duplicated here.

**Collection model and ownership**

The native collection maintains an ordered field list and a name dictionary. The owning dataset creates and destroys the collection; clearing or rebuilding its schema destroys automatic field objects. Persistent/configured field objects can exist while a dataset is inactive, while dynamically generated fields normally follow open/close lifecycle.

Every returned `TField` represents the dataset's mutable current record. Moving the cursor changes the value observed through the same object. Closing, destroying or rebuilding the owning dataset/schema can invalidate both retained collection and field references. Snapshot scalar values before any helper that may navigate or reset a view.

Object fields can own child `TFields` collections. Delphi's dataset `ObjectView` choice determines whether structured child fields appear hierarchically or flattened in the dataset's collection, so do not assume a position is stable across different dataset definitions.

**Name and index access**

Names are stored and queried using `AnsiLowerCase`, making normal field-name lookup case-insensitive. For non-ASCII text this folding depends on the process's Windows locale/code-page behavior; it is not an invariant Unicode identifier comparison. Input is not trimmed: spaces or other extra characters remain significant. `FindField` returns nil for a missing name; `FieldByName` raises a dataset-associated database exception.

Indexes are zero-based. Negative and `Index >= Count` values raise an indexed-list database error. The default-property registration permits `FieldList[I]` as shorthand for `FieldList.Fields[I]`.

**Writable-property quirk**

Writing `Fields[Index]` does **not** replace the object at that position. The runtime helper calls native `SetField`, which calls `Fields[Index].Assign(Source)`. In the installed Delphi implementation, a non-nil `TField` source copies only its current Variant value into the existing destination field; nil calls `Clear` on the destination. Ownership, identity, name, type and position do not move.

The destination dataset must therefore be in a writable edit state, and its normal type conversion, validation, change-event, post/apply and transaction rules apply. Prefer assigning the destination's explicit `AsVariant`/typed property because it communicates this intent more clearly.

**Sparse array edge case**

For a Delphi array field on a dataset using sparse arrays, a child collection can report a logical Count while physically retaining one proxy `TField`. Each indexed read returns that same object after changing its internal offset. Retaining two such indexed results does not retain two elements: both references alias the proxy and the most recently selected index wins. Selecting a destination can consequently retarget a retained source from the same sparse collection before the setter reads it; snapshot the source Variant first and assign the destination's value explicitly. Normal top-level tabular dataset fields do not use this mode, but generic code must not rely on object identity to distinguish sparse elements.

**Performance and concurrency**

Count and indexed access are constant-time. Name lookup lowercases and hashes the supplied name, so cost grows with name length and is normally constant-time after hashing. The list, dictionary, sparse proxy, fields and dataset cursor are mutable and unsynchronised; keep them within the owning Velox flow/thread.

**External references**

- [Embarcadero DocWiki: `Data.DB.TFields`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields) - authoritative Delphi collection, dataset/object-field and ObjectView context.
- [Free Pascal: `TFields`](https://www.freepascal.org/docs-html/fcl/db/tfields.html) - compatible collection overview; Velox executes the Delphi implementation described above.

<small>Created 2026-07-15</small>
