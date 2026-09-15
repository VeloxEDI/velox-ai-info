---
title: Lookup
description: Searches descendant data without intentionally moving the live cursor and returns one or more result-field values.
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, lookup, key-search, variant]
---

```Delphi
function Lookup(const KeyFields: string; const KeyValues: Variant; const ResultFields: string): Variant;
```

### Example

```Delphi
procedure ReadOrderStatus(const Data: TvxClientDataSet;
  const OrderNo: string; var Status: Variant);
begin
  Status := Data.Lookup('OrderNo', OrderNo, 'Status');
end;
```

### Usage

`Lookup` searches dataset data without intentionally moving the live cursor and returns one or more result-field values.

- For `TvxClientDataSet`, use `VarIsNull(Result)` to detect no match; do not rely on generic base False.
- Treat multiple-result ordering as the order in `ResultFields`.
- Lookup can resolve pending edits via browse mode and can fetch provider data.

### Additional Technical Info
`Lookup` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). The returned Variant can be a scalar, array or no-match sentinel depending on result fields and descendant.

#### Source-backed behaviour

Compiled modified base `TDataSet.Lookup` returns Boolean `False` in a Variant. `TCustomClientDataSet` overrides it and initializes `Result := Null`; it uses its client-side locate engine with a temporary record buffer, calculates fields in temporary state, and reads `FieldValues[ResultFields]` without resynchronizing the live record.

Semicolon-separated multiple result fields return the dataset default property's Variant-array form. Multiple key fields require a corresponding Variant array. Missing fields, type conversion and unsupported search field types raise.

#### Related members

[`Locate`](Locate.md) moves the cursor and returns Boolean. [`Fields`](../Properties/Fields.md) reads the current live record.

#### Official RTL references

- [Embarcadero: TDataSet.Lookup](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Lookup)
- [Free Pascal: TDataSet.Lookup](https://www.freepascal.org/docs-html/fcl/db/tdataset.lookup.html)

<small>Created 2026-07-15</small>
