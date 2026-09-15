---
title: EOF
description: Reports whether the concrete client cursor is at or beyond its last visible record and is the normal forward-loop boundary.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, eof, cursor]
---

```Delphi
property EOF: Boolean read;
```

### Example

```Delphi
procedure ProcessRows(const View: TdaSQLQueryDataView);
begin
  View.First;
  while not View.EOF do
  begin
    { process current row }
    View.Next;
  end;
end;
```

### Usage

`EOF` reports whether the client cursor is at or beyond its last visible record and is the normal forward-loop boundary.

- Use `First; while not EOF do ... Next` for forward traversal.
- Do not confuse EOF with [`Empty`](Empty.md), which is implemented as pipeline EOF and is a cursor-state misnomer.
- Avoid retaining field references/values without copying them before the next movement.

### Additional Technical Info
`EOF` is the forward cursor-boundary flag for a concrete DataView.

#### Source-backed behaviour

The hidden base getter reads `DataPipelines[0].EOF`. `TdaSQLQueryDataView` and `TdaCDSQueryDataView` override it with `FQuery.EOF`, reading the underlying client dataset directly. EOF is true on an empty dataset and after movement beyond the last visible row. It is false while positioned on a valid last row.

Filters and master/detail ranges define the visible result. The read does not fetch or move by itself. SQL-view `Next` performs primary-key capture before movement, so a conventional loop has that additional side effect.

#### Official terminal references

- [Embarcadero: TDataSet.EOF](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.EOF)
- [Free Pascal: TDataSet.EOF](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.eof.html)

<small>Created 2026-07-15</small>
