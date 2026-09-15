---
title: FieldByName
description: Returns the dataset field with a required case-insensitive name and raises a database error when it is absent.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, fields, fieldbyname, lookup, error]
---

```Delphi
function FieldByName(const FieldName: string): TField
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  CustomerCode: TField;
begin
  CustomerCode := Dataview.Query.Fields.FieldByName('CustomerCode');
  if CustomerCode.IsNull then
    Value := Null
  else
    Value := CustomerCode.AsString;
end;
```

### Usage

`FieldByName` returns the dataset field with a required case-insensitive name and raises a database error when it is absent.

**Errors**

- A missing name, empty string, whitespace mismatch or name not present in this collection raises `EDatabaseError` through the dataset error path.
- A destroyed/dangling collection or dataset reference can fail unpredictably and must not be used.
- Reading or writing the returned field can raise separately for dataset state, conversion, validation or provider errors.

**Usage notes**

Use `FindField` instead when the field is optional and nil is an expected branch. Do not catch a `FieldByName` error merely to implement optional lookup.

### Additional Technical Info
`FieldByName` returns the `TField` in this collection whose `FieldName` matches the required name. Use it when absence is a schema/configuration error that should stop the current operation.

The example preserves database null rather than silently converting it to empty text. It is source-reviewed and was not executed by the documentation workflow.

**Signature**

`FieldName` is the complete name stored in this particular collection. The result is a borrowed, dataset-owned field object for the current record; the caller must not free it.

**Implementation**

The method calls `FindField(FieldName)`. That implementation lowercases the supplied string using Delphi `AnsiLowerCase` and queries the collection's dictionary, whose keys were created the same way. If no object is returned, `FieldByName` raises Delphi's field-not-found database error using the original supplied text and associates the error with the owning dataset.

The comparison is case-insensitive for normal field names but is not a fuzzy lookup. `AnsiLowerCase` makes non-ASCII folding dependent on Windows locale/code-page behavior rather than invariant Unicode rules. It does not trim leading/trailing whitespace or expand aliases. Pass the configured field name rather than human-facing display text. For structured fields, membership and qualified-name form depend on the dataset/object-field collection and its ObjectView layout.

**Result and lifetime**

The object is stable only for the lifetime of its owning field collection/schema. It continues to follow the mutable dataset cursor: navigation changes the record whose value it exposes. Closing or rebuilding a dynamically generated schema can destroy it, making a retained reference invalid.

**Side effects**

Lookup itself does not navigate, edit, post or apply data. Subsequent access operates on the current record. The failure path creates and raises an exception; it does not return nil.

**Performance and concurrency**

Lookup lowercases and hashes the name, so work grows with name length and is normally constant-time after hashing. The dictionary, returned field and cursor are unsynchronised; use them only in the owning Velox flow/thread.

**External references**

- [Embarcadero DocWiki: `TFields.FieldByName`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields.FieldByName) - authoritative Delphi required-lookup and exception contract.
- [Free Pascal: `TFields.FieldByName`](https://www.freepascal.org/docs-html/fcl/db/tfields.fieldbyname.html) - compatible case-insensitive lookup semantics.

<small>Created 2026-07-15</small>
