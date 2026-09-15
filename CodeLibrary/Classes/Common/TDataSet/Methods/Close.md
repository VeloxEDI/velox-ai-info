---
title: Close
description: Deactivates the dataset, cancelling any pending edit and releasing its cursor and buffers.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, close, inactive, cancel]
---

```Delphi
procedure Close;
```

### Example

```Delphi
procedure CloseData(const Data: TvxClientDataSet);
begin
  Data.Close;
end;
```

### Usage

`Close` deactivates the dataset, cancelling any pending edit and releasing its cursor and buffers.

- Post explicitly before closing only when the pending change should be retained.
- All current field values, cursor position and raw buffers become unusable after close.
- Close is not a database commit or connection-wide transaction action.

### Additional Technical Info
`Close` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It is equivalent to assigning [`Active := False`](../Properties/Active.md).

#### Source-backed behaviour

If already inactive, the property setter does nothing. Otherwise it runs before-close (except during destruction), calls [`Cancel`](Cancel.md) for edit/insert state, sets state inactive, closes the cursor, frees field buffers and record buffers, invokes descendant `InternalClose`, then runs after-close.

`TvxClientDataSet.SetActive(False)` additionally detaches its provider and closes the owned SQL dataset in edit mode (and its normal non-edit workflow already detaches after opening). Unposted record changes are cancelled, not posted.

#### Related members

[`Open`](Open.md) activates again. [`Active`](../Properties/Active.md) exposes the same lifecycle control.

#### Official RTL references

- [Embarcadero: TDataSet.Close](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Close)
- [Free Pascal: TDataSet.Close](https://www.freepascal.org/docs-html/fcl/db/tdataset.close.html)

<small>Created 2026-07-15</small>
