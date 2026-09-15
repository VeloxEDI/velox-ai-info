---
title: FindField
description: Looks up an optional dataset field by case-insensitive exact name and returns nil when no field is present.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, fields, findfield, optional, nil]
---

```Delphi
function FindField(const FieldName: string): TField
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  OptionalReference: TField;
begin
  OptionalReference := Dataview.Query.Fields.FindField('CustomerReference');
  if OptionalReference = nil then
    Value := Null
  else
    Value := OptionalReference.AsVariant;
end;
```

### Usage

`FindField` looks up an optional dataset field by case-insensitive exact name and returns nil when no field is present.

**Usage notes**

Use this method only when absence is a valid, intentionally supported schema variant. Use `FieldByName` for required fields so configuration drift fails at the lookup point with the requested name in the error.

**Errors and side effects**

An ordinary missing name returns nil and does not raise. Lookup does not navigate, edit, post, apply or log. Invalid/dangling object state can still fail, and later access through a found field remains subject to dataset state, conversion and validation errors.

### Additional Technical Info
`FindField` looks for a field in this collection and returns its `TField` object. When the name is absent, it returns nil instead of raising the field-not-found exception used by `FieldByName`.

The example makes optional schema explicit and preserves the field's Variant null/value semantics. It is source-reviewed and was not executed by the documentation workflow.

**Signature**

The return value is either nil or a borrowed dataset-owned object representing the mutable current record.

**Implementation**

The Delphi implementation calls `AnsiLowerCase(FieldName)` and performs one dictionary lookup. Field keys are inserted with the same lowercasing operation. This makes ordinary field names case-insensitive, but input is otherwise exact: no whitespace trimming or alias/display-label translation occurs. Non-ASCII folding depends on Windows locale/code-page behavior and is not invariant Unicode normalisation.

The dictionary contains the fields represented by this collection. Structured/object fields can be hierarchical or flattened according to the dataset's ObjectView configuration, so a field visible in another collection or layout is not automatically found here.

**Result handling**

Always test the result before dereferencing it. A nil result means only that the named field is not in this collection at that moment; it does not mean the dataset contains a null value. For a found field, test `IsNull` or read `AsVariant` to determine record-level null.

The returned object follows cursor navigation and belongs to the schema. A close/schema rebuild/destruction can invalidate it. Re-run lookup after lifecycle changes rather than caching references across them.

**Performance and concurrency**

The name is lowercased and hashed; cost grows with name length and is normally constant-time after hashing. The collection and cursor are mutable and unsynchronised, so do not share the result between concurrent flows/threads.

**External references**

- [Embarcadero DocWiki: `TFields.FindField`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields.FindField) - authoritative Delphi optional-lookup and nil-result contract.
- [Free Pascal: `TFields.FindField`](https://www.freepascal.org/docs-html/fcl/db/tfields.findfield.html) - compatible API reference.

<small>Created 2026-07-15</small>
