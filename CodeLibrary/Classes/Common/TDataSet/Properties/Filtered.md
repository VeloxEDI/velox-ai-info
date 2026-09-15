---
title: Filtered
description: Enables or disables the concrete dataset's local filter and, for active client datasets, repositions to the first visible record.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, filtered, filter, reposition]
---

```Delphi
property Filtered: Boolean read write;
```

### Example

```Delphi
procedure EnableFilter(const Data: TvxClientDataSet);
begin
  Data.Filtered := True;
end;
```

### Usage

`Filtered` enables or disables the dataset's local filter and, for active client datasets, repositions to the first visible record.

- Treat every active assignment as a cursor-repositioning operation.
- Explicitly resolve pending edits before toggling if auto-Post/Cancel is unacceptable.
- A false setting exposes all already-fetched client rows; it does not refetch the server query.

### Additional Technical Info
`Filtered` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It changes the live client view, not the source query or database.

#### Source-backed behaviour

Base `TDataSet.SetFiltered(True)` rejects unidirectional datasets and stores the flag. `TCustomClientDataSet` overrides active changes: it resolves browse mode, destroys lookup cursor, moves the DS cursor to BOF, activates/deactivates filter machinery, clears status filter, stores the flag, and then calls First.

A notable current quirk is that active `TCustomClientDataSet.SetFiltered` calls First even when the assigned Boolean already equals the current value. Reassigning `Filtered := Filtered` therefore still repositions and can trigger scroll work/events.

#### Related members

[`Filter`](Filter.md) stores the expression. [`First`](../Methods/First.md) describes the positioning side effects.

#### Official RTL references

- [Embarcadero: TDataSet.Filtered](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Filtered)
- [Free Pascal: TDataSet.Filtered](https://www.freepascal.org/docs-html/fcl/db/tdataset.filtered.html)

<small>Created 2026-07-15</small>
