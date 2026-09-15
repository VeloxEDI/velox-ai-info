---
title: Prior
description: Attempts to move one record backward and updates BOF when no prior record is available.
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, prior, bof, navigation]
---

```Delphi
procedure Prior;
```

### Example

```Delphi
procedure MoveBack(const Data: TvxClientDataSet);
begin
  if not Data.BOF then
    Data.Prior;
end;
```

### Usage

Attempts to move one record backward and updates BOF when no prior record is available.

- Use only with a bidirectional dataset.
- Check BOF before reading after backward navigation.
- Avoid calling repeatedly after BOF because the before-scroll callback still runs.

#### Usage guidance

- Use only with a bidirectional dataset.
- Check BOF before reading after backward navigation.
- Avoid calling repeatedly after BOF because the before-scroll callback still runs.
- Explicitly Post/Cancel first if automatic edit resolution is unwanted.
- Reverse loops must still make progress or terminate.

### Additional Technical Info
`Prior` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It delegates to [`MoveBy(-1)`](MoveBy.md) and requires a bidirectional dataset when reading prior records.

#### Source-backed behaviour

The inherited movement resolves pending edits through browse mode, invokes scroll events, walks buffered/descendant records and sets BOF when the beginning is reached. `GetPriorRecord` calls `CheckBiDirectional`, so unidirectional datasets raise when backward retrieval is needed.

If already at BOF, the relative move performs no backward work, but it still resolves browse mode and invokes `DoBeforeScroll` without the directional branch's matching `DoAfterScroll`. The method has no return value; inspect BOF or call MoveBy directly when actual movement matters.

#### Related members

[`Next`](Next.md) moves forward. [`BOF`](../Properties/BOF.md) is the backward boundary flag.

#### Official RTL references

- [Embarcadero: TDataSet.Prior](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Prior)
- [Free Pascal: TDataSet.Prior](https://www.freepascal.org/docs-html/fcl/db/tdataset.prior.html)

<small>Created 2026-07-15</small>
