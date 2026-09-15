---
title: Find
description: Performs the same case-insensitive, cursor-moving client lookup as Locate using one string key value; it is not a separate non-moving search.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, find, locate]
---

```Delphi
function Find(const KeyFields, KeyValues: string): Boolean;
```

### Example

```Delphi
function FindOrder(const View: TdaSQLQueryDataView; const Number: string): Boolean;
begin
  Result := View.Find('OrderNumber', Number);
end;
```

### Usage

`Find` performs the same case-insensitive, cursor-moving client lookup as Locate using one string key value; it is not a separate non-moving search.

- Use one physical key field per call and expect cursor movement.
- Save a stable key/bookmark-equivalent if the original position must be restored.
- Do not treat case-insensitive comparison as trimming or partial matching.

### Additional Technical Info
`Find` is a Velox-named convenience wrapper; in both shipped DataView descendants it is semantically identical to [`Locate`](Locate.md).

#### Source-backed behaviour

The hidden base returns false. Each descendant calls `FQuery.Find(KeyFields, KeyValues)`. `TvxClientDataSet.Find` immediately calls `Locate(KeyFields, KeyValues, [loCaseInsensitive])`. A match positions the dataset on the found record; failure returns false. The lookup is local to the materialized client dataset and does not issue SQL.

Delphi `Locate` supports semicolon-separated multiple key fields only when `KeyValues` is a matching Variant array. This script wrapper fixes `KeyValues` to one string, so it is naturally reliable for a single key field; a composite `KeyFields` string cannot express the normal array contract. Partial-key matching is not enabled. Navigation can resolve a pending edit through browse-mode behaviour.

#### Official terminal references

- [Embarcadero: TDataSet.Locate](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Locate)
- [Free Pascal: TDataSet.Locate](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.locate.html)

<small>Created 2026-07-15</small>
