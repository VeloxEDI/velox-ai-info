---
title: Capacity
description: Gets or requests the concrete list's allocated entry capacity without changing its logical Count.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, capacity, allocation]
---

```Delphi
property Capacity: Integer read write;
```

### Example

```Delphi
procedure ReserveEntries(const Items: TStringList; Minimum: Integer);
begin
  if Items.Capacity < Minimum then
    Items.Capacity := Minimum;
end;
```

### Usage

Gets or requests the list's allocated entry capacity without changing its logical Count.

- Iterate only `0..Count-1`; indexes up to Capacity are not valid entries.
- Reserve only bounded, evidence-based sizes. Very large values can exhaust process memory.
- Do not rely on a capacity request working for every `TStrings` string list.

### Additional Technical Info
`Capacity` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). Capacity is storage headroom, not the number of valid entries.

#### Source-backed behaviour

The base getter returns [`Count`](Count.md) and the base setter does nothing, allowing descendants to opt out. `TStringList` overrides both: it reports allocated slots and resizes its backing managed array. A requested value below `Count` raises `EStringListError`; a larger value reserves storage but does not create entries.

Capacity can exceed Count and can change automatically as entries grow or when [`Clear`](../Methods/Clear.md) releases storage. The exact growth strategy is an implementation detail.

#### Related members

[`Count`](Count.md) is the logical size. [`Add`](../Methods/Add.md) grows storage when required and [`Clear`](../Methods/Clear.md) can reset it.

#### Official RTL references

- [Embarcadero: TStrings.Capacity](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Capacity)
- [Free Pascal: TStrings.Capacity](https://www.freepascal.org/docs-html/rtl/classes/tstrings.capacity.html)

<small>Created 2026-07-15</small>
