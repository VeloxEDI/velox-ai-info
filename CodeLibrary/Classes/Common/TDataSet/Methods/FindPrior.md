---
title: FindPrior
description: Continues a descendant filter search backward and moves to the preceding matching record.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, findprior, filter, cursor]
---

```Delphi
function FindPrior: Boolean;
```

### Example

```Delphi
procedure FindPreviousMatch(const Data: TvxClientDataSet; var Found: Boolean);
begin
  Found := Data.FindPrior;
end;
```

### Usage

`FindPrior` continues a dataset filter search backward and moves to the preceding matching record.

- Use only with a bidirectional dataset and a deliberate filter.
- Normally establish the reverse search with [`FindLast`](FindLast.md).
- Handle false and explicitly restore cursor position if required.

### Additional Technical Info
`FindPrior` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It is the reverse continuation partner to [`FindNext`](FindNext.md).

#### Source-backed behaviour

Base modified `TDataSet.FindRecord` is a false-return stub. `TCustomClientDataSet` synchronizes/reuses its find cursor, moves one record backward with the current filter, and resynchronizes the dataset on success.

A unidirectional dataset cannot support backward cursor work; the concrete implementation can raise or remain unsupported. Pending edits are resolved first.

#### Related members

[`FindLast`](FindLast.md) restarts backward. [`Prior`](Prior.md) moves one physical visible record without a separate find criterion.

#### Official RTL references

- [Embarcadero: TDataSet.FindPrior](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.FindPrior)
- [Free Pascal: TDataSet.FindPrior](https://www.freepascal.org/docs-html/fcl/db/tdataset.findprior.html)

<small>Created 2026-07-15</small>
