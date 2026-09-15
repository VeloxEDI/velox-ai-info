---
title: FieldByIndex
description: Returns the zero-based field-list entry from the concrete client dataset; ordering is metadata-dependent and an invalid index raises.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, field, index]
---

```Delphi
function FieldByIndex(const FieldIndex: Integer): TvxField;
```

### Example

```Delphi
function FirstFieldText(const View: TdaCDSQueryDataView): string;
begin
  Result := View.FieldByIndex(0).AsString;
end;
```

### Usage

`FieldByIndex` returns the zero-based field-list entry from the client dataset; ordering is metadata-dependent and an invalid index raises.

- Prefer [`FieldByName`](FieldByName.md) for stable mapping logic.
- Use index access only when the exact DataView field order is part of the governed configuration.
- Do not retain the reference after the dataset closes/recreates its fields.

### Additional Technical Info
`FieldByIndex` returns one `TField` object from the concrete view's client dataset. PascalScript exposes the return as `TvxField`, an API overlay over the actual native field descendant.

#### Source-backed behaviour

The hidden base returns nil. Both shipped descendants override it with `FQuery.Fields[FieldIndex]`. The index is zero-based collection order. Delphi's field list checks the range and raises for negative or `>= FieldCount`; the method does not return nil for an invalid index.

Field order is configured/generated metadata and can be changed through `TField.Index`; it is not a stable database ordinal. For file/CDS views, generated `ID` and `MASTER_ID` fields occupy important early positions, and `Insert` relies on indexes 0/1. The returned object remains owned by the dataset and must not be freed.

#### Official terminal references

- [Embarcadero: TFields.Fields](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TFields.Fields)
- [Free Pascal: TFields.Fields](https://www.freepascal.org/docs-html/current/fcl/db/tfields.fields.html)

<small>Created 2026-07-15</small>
