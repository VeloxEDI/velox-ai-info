---
title: Next
description: Advances one client record; SQL data views first capture configured primary-key values unless a save pass is active.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, next, primary-key-capture]
---

```Delphi
procedure Next;
```

### Example

```Delphi
procedure AdvanceView(const View: TdaSQLQueryDataView);
begin
  if not View.EOF then
    View.Next;
end;
```

### Usage

`Next` advances one client record; SQL data views first capture configured primary-key values unless a save pass is active.

- Use [`EOF`](../Properties/EOF.md) to control loops and be aware that SQL views collect key state during ordinary navigation.
- Explicitly post/cancel edits before moving when implicit resolution is undesirable.
- Do not insert extra `Next` calls merely to inspect EOF; they can affect primary-key accumulation.

### Additional Technical Info
`Next` moves the concrete view's client dataset forward by one visible record, with an extra SQL-view side effect.

#### Source-backed behaviour

The hidden base is an empty stub. `TdaCDSQueryDataView.Next` calls only `FQuery.Next`. `TdaSQLQueryDataView.Next` first calls `RecordPrimaryKeyValuesEvent(Self)` unless `FSaving=True`, then calls `FQuery.Next`. That helper records every configured primary-key field through `GetFieldValueAsString`, producing SQL-oriented text for later flag/update processing. An internal/native `RecordPKValue` flag can suppress one capture and is then reset true; that flag is not exposed by this script surface.

The terminal dataset resolves pending edits before movement, sends scroll events and sets EOF after moving beyond the last record. Calling at EOF still performs browse-mode/event logic; SQL primary-key capture occurs before the attempted move. Capture/conversion/logging errors can prevent movement.

#### Official terminal references

- [Embarcadero: TDataSet.Next](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Next)
- [Free Pascal: TDataSet.Next](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.next.html)

<small>Created 2026-07-15</small>
