---
title: Calculated
description: Reports whether a field has calculated kind and can switch between calculated and ordinary data kind only while the owning dataset is inactive.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, calculated, fieldkind, dataset-schema]
---

```Delphi
property Calculated: Boolean read write;
```

### Example

```Delphi
function IsCalculatedField(const Data: TvxClientDataSet; const Name: string): Boolean;
begin
  Result := Data.FieldByName(Name).Calculated;
end;
```

### Usage

Reports whether a field has calculated kind and can switch between calculated and ordinary data kind only while the owning dataset is inactive.

- Treat this primarily as schema inspection in Velox scripts; configure persistent field kinds before opening a dataset.
- Do not set it to `False` as a generic way to make calculated or lookup fields writable.
- A true value does not prove a calculation handler exists or that the current calculated value is fresh.

### Additional Technical Info
`Calculated` is a Boolean view over `TField.FieldKind`; it is true only for `fkCalculated`.

#### Source-backed behaviour

The getter performs `FieldKind = fkCalculated`. Assigning `True` sets `FieldKind` to `fkCalculated`. Assigning `False` changes the kind to `fkData` only when it is currently calculated; it does not convert lookup, aggregate or internal-calculated fields. `SetFieldKind` validates the kind against the owning field collection and normally calls `CheckInactive`, so changing this property on an open dataset raises an active-dataset error.

The property changes field metadata, not the current value. Calculation timing and assignment are controlled by the dataset's calculated-field processing. A calculated field is commonly outside stored field kinds, so base [`Clear`](../Methods/Clear.md) can be a no-op and state-value members can return `Null` rather than a stored record value.

#### Official RTL references

- [Embarcadero: TField.Calculated](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.Calculated)
- [Free Pascal: TField.Calculated](https://www.freepascal.org/docs-html/current/fcl/db/tfield.calculated.html)

<small>Created 2026-07-15</small>
