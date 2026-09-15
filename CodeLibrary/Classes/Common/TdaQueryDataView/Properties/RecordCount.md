---
title: RecordCount
description: Returns the concrete active client dataset's materialized record count as an unsigned Cardinal, with lifecycle and sentinel-conversion caveats.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, recordcount, cardinal]
---

```Delphi
property RecordCount: Cardinal read;
```

### Example

```Delphi
function RowCount(const View: TdaSQLQueryDataView): Cardinal;
begin
  Result := View.RecordCount;
end;
```

### Usage

`RecordCount` returns the active client dataset's materialized record count as an unsigned Cardinal, with lifecycle and sentinel-conversion caveats.

- Ensure the DataView is active and opened successfully.
- Do not use count as a stable record identifier or database `COUNT(*)` result independent of the client view.
- For simple traversal prefer EOF loops and avoid repeated count reads in hot paths.

### Additional Technical Info
`RecordCount` exposes the record count of the `TvxClientDataSet` owned by the concrete DataView.

#### Source-backed behaviour

The hidden getter is abstract. SQL/CDS descendants return `FQuery.RecordCount`/`Query.RecordCount`. `TCustomClientDataSet.GetRecordCount` requires an active dataset and asks DSBase for the count. Velox SQL datasets normally fetch the complete result on open; file/CDS views are locally materialized, so the count ordinarily represents the complete current client view.

The script property is unsigned while Delphi's underlying count is signed. It cannot represent negative sentinel values faithfully; under different range-check contexts such a value can raise or appear as a very large Cardinal. The concrete active client getter normally returns a non-negative count, but inactive access raises before a useful value is produced. Filters/ranges and deletions affect what is counted.

#### Official terminal references

- [Embarcadero: TDataSet.RecordCount](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.RecordCount)
- [Free Pascal: TDataSet.RecordCount](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.recordcount.html)

<small>Created 2026-07-15</small>
