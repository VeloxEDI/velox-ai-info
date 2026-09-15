---
title: FieldByName
description: Returns a field by case-insensitive name or raises a contextual database error when it is absent.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, fieldbyname, lookup, error]
---

```Delphi
function FieldByName(const FieldName: string): TField;
```

### Example

```Delphi
procedure ReadCode(const Data: TvxClientDataSet; var Code: string);
begin
  Code := Data.FieldByName('Code').AsString;
end;
```

### Usage

Use `FieldByName` when the dataset is expected to contain a particular configured field and a missing field should stop the script. It returns the `TField` for the dataset's current record, allowing typed access such as `AsString`, `AsInteger` or `AsDateTime`.

Reading requires an active dataset and current record. Writing also requires the dataset to be in `Edit`, `Append` or `Insert` state, followed by `Post` or `Cancel`. Use [`FindField`](FindField.md) for optional fields because `FieldByName` raises when the name is absent, and do not retain the returned field after the dataset is closed or its fields are rebuilt.

### Additional Technical Info

`FieldByName` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). The returned field is a live component tied to the dataset and its current record.

#### Source-backed behaviour

The method calls [`FindField`](FindField.md) and raises `EDatabaseError` with the requested name and dataset context when no match exists. The modified `TFields` lookup stores keys using `AnsiLowerCase`, so normal field-name matching is case-insensitive. Object-view fields and aggregate fields are searched after the primary fields.

`TvxClientDataSet` also exposes its own `FieldName[...]` convenience property with enhanced dataset-name error text, but this inherited method returns the underlying `TField` reference.

#### Operational guidance

- Use when absence is a configuration/schema error that should stop the flow.
- Do not retain the field reference after Close, field recreation or dataset destruction.
- Reading/writing Value still depends on Active/current record and edit state.
- Field names are identifiers, not safe SQL fragments.

#### Related members

[`FindField`](FindField.md) returns nil for optional fields. [`Fields`](../Properties/Fields.md) provides indexed access and [`GetFieldNames`](GetFieldNames.md) enumerates names.

#### Official RTL references

- [Embarcadero: TDataSet.FieldByName](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.FieldByName)
- [Free Pascal: TDataSet.FieldByName](https://www.freepascal.org/docs-html/fcl/db/tdataset.fieldbyname.html)

<small>Created 2026-07-15</small>
