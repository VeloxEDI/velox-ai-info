---
title: Next
description: Attempts to move one record forward and updates EOF when no further record is available.
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, next, eof, navigation]
---

```Delphi
procedure Next;
```

### Example

```Delphi
procedure ProcessRows(const Data: TvxClientDataSet);
begin
  Data.First;
  while not Data.EOF do
  begin
    // Read the current row here.
    Data.Next;
  end;
end;
```

### Usage

`Next` attempts to move one record forward and updates EOF when no further record is available.

- Use the canonical `First; while not EOF do ...; Next` pattern.
- Ensure every loop path calls Next or exits to avoid an infinite loop.
- Avoid calling repeatedly after EOF because the before-scroll callback still runs.

#### Usage guidance

- Use the canonical `First; while not EOF do ...; Next` pattern.
- Ensure every loop path calls Next or exits to avoid an infinite loop.
- Avoid calling repeatedly after EOF because the before-scroll callback still runs.
- Do not read fields after Next has established EOF without checking the flag.
- Processing code must decide how implicit posting of a pending edit should be handled.

### Additional Technical Info
`Next` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It delegates to [`MoveBy(1)`](MoveBy.md) except during block-read mode.

#### Source-backed behaviour

The normal path calls `MoveBy(1)`, inheriting browse-mode auto-Post/Cancel, provider fetch, scroll events and boundary handling. When already EOF, MoveBy performs no forward work, but it still resolves browse mode and invokes `DoBeforeScroll` without the directional branch's matching `DoAfterScroll`. If no next record can be retrieved from a non-EOF position, EOF is set true.

A client dataset may fetch additional provider packets before determining EOF. `TvxClientDataSet` normally disables fetch-on-demand and loads the full result at open.

#### Related members

[`Prior`](Prior.md) moves backward. [`EOF`](../Properties/EOF.md) is the forward boundary flag.

#### Official RTL references

- [Embarcadero: TDataSet.Next](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Next)
- [Free Pascal: TDataSet.Next](https://www.freepascal.org/docs-html/fcl/db/tdataset.next.html)

<small>Created 2026-07-15</small>
