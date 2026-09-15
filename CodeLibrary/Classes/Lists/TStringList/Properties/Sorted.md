---
title: Sorted
description: Enables maintained comparator order for future additions while exposing important inherited-operation invariant hazards.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, string-list, sorted, ordering, invariant]
---

```Delphi
property Sorted: Boolean read write;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Names: TStringList;
begin
  Names := TStringList.Create;
  try
    Names.CaseSensitive := True;
    Names.Duplicates := dupIgnore;
    Names.Sorted := True;
    Names.Add('Gamma');
    Names.Add('Alpha');
    Value := Names.Strings[0];  // Alpha
  finally
    Names.Free;
  end;
end;
```

### Usage

Set `Sorted` to `True` to keep future additions in comparison order. Avoid operations documented as bypassing or breaking that order.

### Additional Technical Info
`Sorted` selects maintained comparator ordering. It defaults false. Setting it true while false calls [`Sort`](../Methods/Sort.md) first and then records the flag; future `Add`/`AddObject` operations use binary [`Find`](../Methods/Find.md) to choose their insertion position and apply [`Duplicates`](Duplicates.md).

On zero or one entry, enabling the flag performs no sorting event. On two or more entries, the transition invokes [`OnChanging`](OnChanging.md), quicksorts in place and invokes [`OnChange`](OnChange.md). The sort is unstable, so equal String/object pairs can change relative order.

Setting false simply changes the flag. It neither reorders content nor fires events. Existing order remains available, but future adds append and duplicate policy is ignored. Calling `Sort` while false performs only a one-time order and leaves this property false.

#### Guarded and unguarded inherited operations

While true, inherited `Insert`, `InsertObject` and indexed `Strings[Index] := ...` call guarded overrides and raise `EStringListError`. This protects order for those paths. Indexed `Objects` writes are permitted because they do not change String ordering.

Other inherited paths are unsafe:

- `Exchange` validates indexes and swaps complete String/object pairs without checking `Sorted`, leaving the flag true even if order is now wrong.
- `Move` saves the source pair, clears its object slot and deletes the source before calling guarded `InsertObject`; that call then raises because the list is sorted. The source String is already gone and the list no longer holds its object reference.

After either misuse, `Find` and sorted `Add` can give incorrect results because they trust the flag. Set `Sorted=False` before intentional manual reordering, perform the edits, then set it true to re-sort. For critical data, build a separate replacement list rather than recovering in place after `Move` failure.

#### Failure and comparison behavior

Enabling is not transactional. An `OnChanging` exception occurs before sorting but while the stored flag is still false. A comparison failure can leave partial order. An `OnChange` exception occurs after sorting and before the setter records true, leaving newly ordered content with `Sorted=False`.

Order uses [`CaseSensitive`](CaseSensitive.md) and hidden locale-aware comparison. Changing case mode while sorted toggles this property off/on to re-sort. Existing duplicates are retained regardless of `Duplicates`.

Maintained insertion is O(log n) search plus O(n) array movement. Enabling sorting is O(n log n) on average. All state and callbacks are unsynchronised.

The source-reviewed example configures comparison and duplicate policy before enabling maintained ordering. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.Sorted`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.Sorted) - Delphi maintained-order reference.
- [Free Pascal: `TStringList.Sorted`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.sorted.html) - compatible high-level context; the inherited `Exchange`/`Move` behavior above is from current Delphi source used by Velox.

<small>Created 2026-07-15</small>
