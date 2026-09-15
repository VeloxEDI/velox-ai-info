---
title: Locate
description: Searches descendant data for key values and moves the current cursor to a matching record.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, locate, key-search, cursor]
---

```Delphi
function Locate(const KeyFields: string; const KeyValues: Variant; Options: TLocateOptions): Boolean;
```

### Example

```Delphi
procedure FindOrder(const Data: TvxClientDataSet; const OrderNo: string;
  var Found: Boolean);
begin
  Found := Data.Locate('OrderNo', OrderNo, [loCaseInsensitive]);
end;
```

### Usage

`Locate` searches dataset data for key values and moves the current cursor to a matching record.

- Use a Variant array with values in exactly the same order as multiple semicolon-separated fields.
- Treat success as cursor mutation; save a business key/bookmark through a supported higher-level API if restoration is required.
- A false result is not an error and should be handled explicitly.

### Additional Technical Info
`Locate` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). The modified base is a stub; useful behaviour comes from the concrete descendant.

#### Source-backed behaviour

Compiled modified `TDataSet.Locate` always returns false. `TCustomClientDataSet` overrides it, resolves browse mode, fetches provider EOF, parses semicolon-separated `KeyFields`, pairs one scalar value or a Variant array, builds a local expression and searches from BOF. On success it resynchronizes the live cursor and runs scroll events.

`loCaseInsensitive` enables case-insensitive string comparison. `loPartialKey` appends a wildcard only for the final string key. Null keys use `IS NULL`; unsupported field types, missing fields or mismatched Variant arrays raise. The search is client-side expression evaluation, not SQL.

#### Related members

[`Lookup`](Lookup.md) returns values without intentionally moving the current record. [`FindField`](FindField.md) validates optional keys.

#### Official RTL references

- [Embarcadero: TDataSet.Locate](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Locate)
- [Free Pascal: TDataSet.Locate](https://www.freepascal.org/docs-html/fcl/db/tdataset.locate.html)

<small>Created 2026-07-15</small>
