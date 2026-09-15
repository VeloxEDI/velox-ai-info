---
title: EOF
description: Indicates that forward navigation is at the end boundary of the current dataset view.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, eof, boundary, iteration]
---

```Delphi
property EOF: Boolean read;
```

### Example

```Delphi
procedure ProcessRows(const Data: TvxClientDataSet);
begin
  Data.First;
  while not Data.EOF do
  begin
    // Process current Fields here.
    Data.Next;
  end;
end;
```

### Usage

`EOF` indicates that forward navigation is at the end boundary of the current dataset view.

- Use the canonical First/while-not-EOF/Next pattern and never read a row after EOF without repositioning.
- Combine with Active/IsEmpty when distinguishing inactive, empty and boundary states.
- Do not treat EOF as proof a source query returned zero rows.

### Additional Technical Info
`EOF` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It is the standard forward-loop boundary and can also be true for an empty/inactive buffer.

#### Source-backed behaviour

The base sets EOF when no next record is available; [`Last`](../Methods/Last.md) explicitly establishes the end boundary. Clearing/inactivating buffers makes BOF and EOF both true. Filtering changes which row is considered final.

A nonempty dataset can have EOF true at its last/beyond-last boundary depending on the navigation path. `TvxClientDataSet.Empty` and `NotEmpty` are implemented only as EOF/not EOF, so their result is cursor-state dependent; inherited [`IsEmpty`](../Methods/IsEmpty.md) is the explicit buffer test.

#### Related members

[`BOF`](BOF.md) is the reverse boundary. [`Next`](../Methods/Next.md) and [`Last`](../Methods/Last.md) update EOF.

#### Official RTL references

- [Embarcadero: TDataSet.EOF](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.EOF)
- [Free Pascal: TDataSet.EOF](https://www.freepascal.org/docs-html/fcl/db/tdataset.eof.html)

<small>Created 2026-07-15</small>
