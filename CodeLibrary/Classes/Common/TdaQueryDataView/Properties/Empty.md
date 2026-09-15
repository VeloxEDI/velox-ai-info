---
title: Empty
description: Returns DataPipelines[0].EOF rather than testing record count, so it also reports true when a non-empty cursor is positioned after the last row.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, empty, eof, quirk]
---

```Delphi
property Empty: Boolean read;
```

### Example

```Delphi
function CursorHasCurrentRow(const View: TdaCDSQueryDataView): Boolean;
begin
  Result := not View.Empty;
end;
```

### Usage

Returns DataPipelines[0].EOF rather than testing record count, so it also reports true when a non-empty cursor is positioned after the last row.

- Treat it as “no current record because pipeline EOF”, not “record count is zero”.
- For existence, rewind and inspect boundary flags or use an active [`RecordCount`](RecordCount.md) when its cost/semantics are acceptable.
- Never use this property to decide whether destructive initialization is safe without considering cursor position.

### Additional Technical Info
`Empty` is a misleadingly named convenience property. It tests the pipeline's EOF flag, not whether zero records exist.

#### Source-backed behaviour

The implementation is exactly `Result := DataPipelines[0].EOF`; visible descendants do not override this getter. Therefore it is true for an actually empty view and for any non-empty view positioned after its last visible record. Calling [`Last`](../Methods/Last.md) leaves a valid last record and normally EOF false, while calling [`Next`](../Methods/Next.md) past it makes `Empty` true without deleting anything.

It dereferences pipeline index zero with no guard, so an uninitialized view can raise. It can also differ momentarily from the descendant [`EOF`](EOF.md) property if the ReportBuilder pipeline and dataset cursor are not synchronized.

#### Official terminal references

- [Embarcadero: TDataSet.EOF](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.EOF)
- [Free Pascal: TDataSet.EOF](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.eof.html)

<small>Created 2026-07-15</small>
