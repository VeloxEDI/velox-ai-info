---
title: Locate
description: Searches the materialized client dataset case-insensitively for one string key and moves the cursor to the first matching record.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, locate, case-insensitive]
---

```Delphi
function Locate(const KeyFields, KeyValues: string): Boolean;
```

### Example

```Delphi
function LocateCustomer(const View: TdaSQLQueryDataView; const Code: string): Boolean;
begin
  Result := View.Locate('CustomerCode', Code);
end;
```

### Usage

`Locate` searches the materialized client dataset case-insensitively for one string key and moves the cursor to the first matching record.

- Use one physical field name and expect cursor movement.
- Preserve a stable key if the caller needs to restore its original record.
- Case-insensitive does not mean trimmed, normalised or partial.

### Additional Technical Info
`Locate` searches the current client result, not the source database.

#### Source-backed behaviour

The hidden base returns false. Both descendants call `FQuery.Locate(KeyFields, KeyValues, [loCaseInsensitive])`. A match returns true and positions the cursor on the matching record; failure returns false. Partial-key matching is not requested. The client dataset may use an index or scan depending on its current indexes and fields.

The script declaration fixes `KeyValues` to `string`. Delphi composite Locate normally needs a Variant array paired with semicolon-separated fields, which this surface cannot express naturally. Treat it as a single-key lookup. It can resolve pending edit state through cursor movement, and it respects the current client data/filter/range rather than fetching absent rows.

#### Official terminal references

- [Embarcadero: TDataSet.Locate](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Locate)
- [Free Pascal: TDataSet.Locate](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.locate.html)

<small>Created 2026-07-15</small>
