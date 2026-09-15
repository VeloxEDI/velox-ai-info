---
title: NotEmpty
description: Returns the exact inverse of DataPipelines[0].EOF, meaning “pipeline not at EOF” rather than proving the view contains any records.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, notempty, eof, quirk]
---

```Delphi
property NotEmpty: Boolean read;
```

### Example

```Delphi
function HasCurrentPipelineRow(const View: TdaCDSQueryDataView): Boolean;
begin
  Result := View.NotEmpty;
end;
```

### Usage

`NotEmpty` returns the exact inverse of DataPipelines[0].EOF, meaning “pipeline not at EOF” rather than proving the view contains any records.

- Read it as “a forward-loop current row may be available”, not “records exist somewhere in the view”.
- Rewind with `First` before using it as a current-row guard after arbitrary navigation.
- Use explicit existence logic for decisions that must distinguish an exhausted cursor from a zero-row result.

### Additional Technical Info
`NotEmpty` is exactly `not DataPipelines[0].EOF`; it is the inverse of [`Empty`](Empty.md), including that property's cursor-state limitation.

#### Source-backed behaviour

The implementation does not inspect `RecordCount`, BOF or an actual row buffer. It returns false for an empty view and also for a non-empty view whose pipeline has advanced after the last row. It returns true only while the pipeline is not at EOF. Visible descendants inherit this getter.

The property assumes pipeline index zero exists and can raise during incomplete initialization. It normally reflects the same dataset as `EOF`, but pipeline synchronization is an extra layer.

#### Official terminal references

- [Embarcadero: TDataSet.EOF](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.EOF)
- [Free Pascal: TDataSet.EOF](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.eof.html)

<small>Created 2026-07-15</small>
