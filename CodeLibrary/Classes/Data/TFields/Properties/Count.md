---
title: Count
description: Returns the current number of addressable fields or logical sparse-array elements in this field collection.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, fields, count, schema, sparse]
---

```Delphi
property Count: Integer read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FieldList: TFields;
begin
  FieldList := Dataview.Query.Fields;
  if FieldList.Count = 0 then
    Value := 'No fields are available'
  else
    Value := FieldList.Count;
end;
```

### Usage

`Count` returns the current number of addressable fields or logical sparse-array elements in this field collection.

**Lifecycle**

Persistent/configured field objects can exist while a dataset is inactive. Dynamically created fields generally appear when the dataset builds its schema and can be destroyed on close or rebuild. Count can therefore change across activation/schema lifecycle even though simple record navigation does not change it.

If Count is zero, a loop written as `for I := 0 to Count - 1` must rely on the script runtime's ordinary Pascal loop semantics; an explicit zero check is clearer where the loop body has side effects.

**Usage notes**

Use Count with the default `Fields` property for schema iteration. Use named lookup for business logic so harmless column-order changes do not select the wrong field.

### Additional Technical Info
`Count` returns the number of valid zero-based indexes in the collection. Normal iteration uses indexes `0` through `Count - 1`.

The example handles an empty collection before reporting its size. It is source-reviewed and was not executed by the documentation workflow.

Velox registers no setter. Attempting to assign Count is a script compile error.

**Implementation**

For an ordinary collection, the getter returns the native ordered list count. When Delphi sparse-array mode is active and the collection has its physical proxy field, it instead returns the configured logical sparse element count. This allows every index below Count to be addressed even though those accesses reuse one proxy `TField` object with a changing internal offset.

The normal dataset `Fields.Count` describes field objects, not records, populated values, selected columns in a row or non-null values. It is independent of cursor position. Dataset schema/object-view configuration determines which field objects belong to this collection.

**Errors and side effects**

Reading Count has no data mutation, navigation, post or apply side effect. A retained/dangling collection reference is invalid and can fail. Count does not prove that a later field access is safe if another operation rebuilds the schema in between.

**Performance and concurrency**

The getter is constant-time. The collection and owning dataset are mutable and unsynchronised; read and iterate within one owning flow/thread without schema-changing calls between the count and access.

**External references**

- [Embarcadero DocWiki: `TFields.Count`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields.Count) - authoritative Delphi field-count declaration.
- [Free Pascal: `TFields.Count`](https://www.freepascal.org/docs-html/fcl/db/tfields.count.html) - compatible count-property reference; Delphi sparse-array behavior is implementation-specific here.

<small>Created 2026-07-15</small>
