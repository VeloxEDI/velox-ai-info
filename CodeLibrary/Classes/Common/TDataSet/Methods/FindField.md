---
title: FindField
description: Returns the matching field reference or nil when the named field is not present.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, findfield, optional-field, nil]
---

```Delphi
function FindField(const FieldName: string): TField;
```

### Example

```Delphi
procedure ReadOptional(const Data: TvxClientDataSet; var Value: string);
var
  Field: TField;
begin
  Field := Data.FindField('OptionalCode');
  if Field = nil then
    Value := ''
  else
    Value := Field.AsString;
end;
```

### Usage

`FindField` returns the matching field reference or nil when the named field is not present.

- Test against nil before dereferencing.
- Use [`FieldByName`](FieldByName.md) when a missing field must raise.
- Do not cache across dataset close/reopen paths that recreate dynamic fields.

### Additional Technical Info
`FindField` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It is the non-raising field lookup.

#### Source-backed behaviour

The method searches primary `FFields`, then object-view fields when enabled, then aggregate fields. The primary collection uses lowercased dictionary keys, giving case-insensitive matching. No field definition is created and no data is fetched solely because the name is missing.

A non-nil result is a live `TField` component whose Value represents the dataset's current record and state.

#### Related members

[`GetFieldNames`](GetFieldNames.md) can populate a list of available names. [`FieldCount`](../Properties/FieldCount.md) counts current field components.

#### Official RTL references

- [Embarcadero: TDataSet.FindField](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.FindField)
- [Free Pascal: TDataSet.FindField](https://www.freepascal.org/docs-html/fcl/db/tdataset.findfield.html)

<small>Created 2026-07-15</small>
