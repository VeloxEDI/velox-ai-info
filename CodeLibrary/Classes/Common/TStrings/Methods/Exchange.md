---
title: Exchange
description: Swaps two entries, keeping each string paired with its associated object reference.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, exchange, reorder, objects]
---

```Delphi
procedure Exchange(Index1, Index2: Integer);
```

### Example

```Delphi
procedure SwapFirstTwo(const Items: TStringList);
begin
  if Items.Count >= 2 then
    Items.Exchange(0, 1);
end;
```

### Usage

`Exchange` swaps two entries, keeping each string paired with its associated object reference.

- Preserve sorted invariants: do not exchange entries in a sorted list unless the list is immediately re-sorted and the intermediate state is acceptable.
- Object ownership does not change; pair association moves with the string.
- Invalid indexes raise before mutation in `TStringList`.

### Additional Technical Info
`Exchange` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). The virtual method can be implemented directly by the concrete descendant.

#### Source-backed behaviour

The base implementation batches updates, reads both strings and object references, then writes them back in opposite positions. `TStringList` overrides this with explicit bounds checks and an in-place pair swap surrounded by changing/changed notifications.

Both indexes must be within `0..Count-1`. Exchanging an index with itself is permitted by `TStringList` and still enters its notification path. On sorted lists, a manual exchange can violate sorted ordering even though the method itself does not reject `Sorted=True`.

#### Related members

[`Move`](Move.md) relocates one pair by delete/insert. [`Strings`](../Properties/Strings.md) and [`Objects`](../Properties/Objects.md) expose the paired values.

#### Official RTL references

- [Embarcadero: TStrings.Exchange](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Exchange)
- [Free Pascal: TStrings.Exchange](https://www.freepascal.org/docs-html/rtl/classes/tstrings.exchange.html)

<small>Created 2026-07-15</small>
