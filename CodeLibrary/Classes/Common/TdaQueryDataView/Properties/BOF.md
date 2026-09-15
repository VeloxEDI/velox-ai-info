---
title: BOF
description: Reports whether the concrete view cursor is at or before its first visible record; an empty view has both BOF and EOF true.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, bof, cursor]
---

```Delphi
property BOF: Boolean read;
```

### Example

```Delphi
function AtBeginning(const View: TdaSQLQueryDataView): Boolean;
begin
  Result := View.BOF;
end;
```

### Usage

Reports whether the view cursor is at or before its first visible record; an empty view has both BOF and EOF true.

- Use with [`EOF`](EOF.md) when distinguishing empty/boundary states.
- Do not use BOF alone to infer that the current record is invalid.
- Master/detail ranges and filters define the visible beginning.

### Additional Technical Info
`BOF` is a cursor boundary flag, not a record-existence count.

#### Source-backed behaviour

The base getter returns `DataPipelines[0].BOF`; both shipped descendants override it with `FQuery.BOF`. These normally track the same underlying client dataset but the override bypasses pipeline aliasing/state. BOF becomes true before the first visible record and is also true on an empty dataset. On the first valid record it can remain true until an attempted backward move depending on standard dataset semantics.

Reading requires a valid created view/pipeline/dataset lifecycle. It does not move the cursor or query the database.

#### Official terminal references

- [Embarcadero: TDataSet.BOF](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.BOF)
- [Free Pascal: TDataSet.BOF](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.bof.html)

<small>Created 2026-07-15</small>
