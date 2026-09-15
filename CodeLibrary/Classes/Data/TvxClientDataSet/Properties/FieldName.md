---
title: FieldName
description: Returns a required named field through the TvxField facade and annotates lookup failures with the host dataset name.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, fieldname, default-property, lookup, tvxfield]
---

```Delphi
property FieldName[aFieldName: string]: TvxField read; default
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  CustomerCode: TvxField;
begin
  CustomerCode := DATA1['CustomerCode'];
  if CustomerCode.IsNull then
    Value := Null
  else
    Value := CustomerCode.AsString;
end;
```

### Usage

`FieldName` returns a required named field through the TvxField facade and annotates lookup failures with the host dataset name.

**Usage notes**

Use this default property for required fields. Use `Fields.FindField` when absence is a supported schema branch and nil is desired.

**Errors and side effects**

A missing/space-mismatched name raises the annotated EDatabaseError; it never returns nil for ordinary absence. Lookup itself does not navigate or mutate. Reading/writing the result can trigger dataset conversion/edit/validation behavior.

### Additional Technical Info
`FieldName` is the dataset's read-only default indexed property. It performs a required field-name lookup and returns the result through the `TvxField` facade. Default-property registration permits `DATA1['Code']` as shorthand for `DATA1.FieldName['Code']`.

The example preserves null and retains the borrowed field only locally. It is source-reviewed and was not executed by the documentation workflow.

**Lookup and error replacement**

The getter calls `Fields.FieldByName(aFieldName)`. Lookup is case-insensitive through Delphi `AnsiLowerCase`, but input is not trimmed and is not display-label/alias lookup.

Velox catches **any** `Exception` from that lookup block and raises a new `EDatabaseError` containing the original message plus ` in dataset '<DataSetName>'`. Host DATA variables set DataSetName (for example `DATA1`); other instances may leave it empty. Replacing the exception loses the original class/context/stack identity, so diagnose from the combined message and call site.

**TvxField facade and lifetime**

The native field remains its concrete Delphi class (`TStringField`, `TDateTimeField`, and so on); the getter applies a static cast to `TvxField`, whose design deliberately adds no instance state. This exposes Velox convenience methods/properties, some of which make concrete-type assumptions documented on their pages.

The dataset owns the field. It follows the current cursor and is invalid after close/schema rebuild/destruction. Never free it.

**Performance and concurrency**

Lookup lowercases and hashes the name. The collection, result and cursor are unsynchronised.

**External references**

- [Embarcadero DocWiki: `TFields.FieldByName`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields.FieldByName) - core required named lookup and exception behavior.
- [Free Pascal: `TFields.FieldByName`](https://www.freepascal.org/docs-html/fcl/db/tfields.fieldbyname.html) - compatible case-insensitive required lookup context.

<small>Created 2026-07-15</small>
