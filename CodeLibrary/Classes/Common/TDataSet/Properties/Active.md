---
title: Active
description: Reports or controls whether the concrete dataset cursor is open and available for field and record operations.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, active, open, close]
---

```Delphi
property Active: Boolean read write;
```

### Example

```Delphi
procedure EnsureActive(const Data: TvxClientDataSet);
begin
  if not Data.Active then
    Data.Active := True;
end;
```

### Usage

`Active` reports or controls whether the dataset cursor is open and available for field and record operations.

- Opening can execute external SQL/provider work and allocate the full result; constrain source data first.
- Do not hold fields/record buffers across deactivation.
- Setting the current value is normally a no-op because the Velox override checks equality.

### Additional Technical Info
`Active` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). Writing it is the same lifecycle operation as [`Open`](../Methods/Open.md) or [`Close`](../Methods/Close.md).

#### Source-backed behaviour

The modified base getter is false in `dsInactive` and `dsOpening`, true in other states. Setting true runs open events and descendant cursor/field/buffer initialization; incomplete open is cleaned back to inactive. Setting false runs close events, cancels edit/insert state, frees buffers and invokes descendant close.

`TvxClientDataSet` can attach/fetch through its provider when activating. In normal non-edit mode it then disables change logging and constraints, detaches the provider and closes the SQL dataset while retaining client rows. Deactivation cancels unposted edits.

#### Related members

[`Open`](../Methods/Open.md) and [`Close`](../Methods/Close.md) are procedural aliases. [`IsEmpty`](../Methods/IsEmpty.md) distinguishes active datasets with no current row.

#### Official RTL references

- [Embarcadero: TDataSet.Active](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Active)
- [Free Pascal: TDataSet.Active](https://www.freepascal.org/docs-html/fcl/db/tdataset.active.html)

<small>Created 2026-07-15</small>
