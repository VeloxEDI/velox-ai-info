---
title: Fields
description: Gets a borrowed field by zero-based index or writes the destination field's current value through Delphi Assign semantics.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, fields, index, default-property, assign]
---

```Delphi
property Fields[Index: Integer]: TField read write; default
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FieldList: TFields;
  FirstField: TField;
begin
  FieldList := Dataview.Query.Fields;
  if FieldList.Count = 0 then
    Value := Null
  else
  begin
    FirstField := FieldList[0];
    Value := FirstField.AsVariant;
  end;
end;
```

### Usage

`Fields` gets a borrowed field by zero-based index or writes the destination field's current value through Velox Assign semantics.

**Usage notes**

Treat Fields primarily as a read/index surface. When writing data, obtain the destination field and assign its clearly named typed or Variant property within the surrounding edit/post/apply lifecycle.

**Errors and side effects**

- Any negative index, empty-list access or `Index >= Count` raises a dataset-associated index error.
- Getter access itself does not navigate, edit, post or apply, although sparse access mutates proxy offset.
- Setter access mutates or clears the destination current-record value and can invoke edit/validation/change paths.
- Setter failures include inactive/read-only/non-edit state, incompatible Variant conversion, required/null restrictions, validation and provider/database errors.
- Dangling collection or field references after schema destruction are invalid.

### Additional Technical Info
`Fields` is the collection's zero-based default indexed property. Reading it returns the dataset-owned `TField` at an index. Writing it copies a current value into the existing destination field; it does not replace a collection item.

The example uses the default-property shorthand after guarding the index and preserves record null through `AsVariant`. It is source-reviewed and was not executed by the documentation workflow.

Because Velox registers it as the default property, `FieldList[I]` and `FieldList.Fields[I]` refer to the same indexed access.

**Getter**

For an ordinary collection, the getter rejects a negative index or an index greater than/equal to the physical list count, then returns the object at that position. The result is borrowed: the collection/dataset owns it. It exposes the mutable current record, so navigation changes the value read through an already obtained reference.

Schema membership and ordering can change across open/close/rebuild and ObjectView choices. Retained references become invalid when their field objects are destroyed. Use named lookup for business fields unless ordinal position is itself part of the integration contract.

**Setter: value copy, not object replacement**

The PascalScript property helper passes the index and source `TField` to native `TFields.SetField`, which evaluates the indexed destination then calls `Destination.Assign(Source)`.

In the installed Delphi `TField.Assign` implementation:

- a non-nil `TField` source evaluates `Source.Value` as Variant and assigns it to `Destination.Value`;
- a nil source calls `Destination.Clear`;
- the destination object, name, type, metadata, index and ownership remain unchanged;
- no field object is inserted, removed, replaced or freed.

This differs from what “assign a field” can imply and is narrower than the upstream page's general wording about assigning properties. It copies the current record value only. The destination dataset must be editing/writable, and Variant conversion, field validation, change events, posting, applying updates, transactions and database constraints remain the owning flow's responsibility. For ordinary fields, prefer an explicit `Destination.AsVariant := Source.AsVariant` or `Destination.Clear` so the intent is visible.

**Sparse-array quirk**

In Delphi sparse-array mode, Count can be a logical array size while the collection holds one proxy field. A valid getter returns that same proxy and changes its internal offset to Index. Therefore:

```Delphi
First := FieldList[0];
Second := FieldList[1];
```

can make `First` and `Second` reference the same object positioned at element 1. The most recent indexed access controls both references. A setter first selects the destination offset through this same proxy. If its Source came from the same sparse collection, that selection also retargets Source before `Source.Value` is evaluated, so the apparent cross-element assignment can become a destination-to-itself copy. Read the source into a Variant scalar, select the destination, then assign that destination field's `AsVariant`; do not use field-object identity or the collection setter to copy between sparse elements.

**Performance and concurrency**

Index access is constant-time, excluding value conversion and dataset work performed by a setter. The collection, proxy offset, field buffers and cursor are unsynchronised; keep them in one owning Velox flow/thread.

**External references**

- [Embarcadero DocWiki: `TFields.Fields`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields.Fields) - authoritative Delphi indexed/default-property declaration and assignment intent.
- [Free Pascal: `TFields.Fields`](https://www.freepascal.org/docs-html/fcl/db/tfields.fields.html) - compatible indexed-property reference; Velox uses the Delphi Assign and sparse-proxy implementation detailed above.

<small>Created 2026-07-15</small>
