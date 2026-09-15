---
title: Sort
description: Performs a one-time unstable comparator sort while deliberately leaving the list in unsorted insertion mode.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, string-list, sort, quicksort, events]
---

```Delphi
procedure Sort;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Names: TStringList;
begin
  Names := TStringList.Create;
  try
    Names.Add('Gamma');
    Names.Add('Alpha');
    Names.Add('Beta');
    Names.Sort;
    Value := Names.Strings[0];  // Alpha
  finally
    Names.Free;
  end;
end;
```

### Usage

Performs a one-time unstable comparator sort while deliberately leaving the list in unsorted insertion mode.

### Additional Technical Info
`Sort` calls the native default `CustomSort` with the list's current String comparator. When [`Sorted`](../Properties/Sorted.md) is false and `Count > 1`, it invokes [`OnChanging`](../Properties/OnChanging.md) once, performs an in-place quicksort, then invokes [`OnChange`](../Properties/OnChange.md) once.

The method intentionally does **not** set `Sorted=True`. It changes current physical order only. Later `Add` calls append at the end and can make the list unordered again. Set the `Sorted` property to true when maintained ordering and [`Duplicates`](../Properties/Duplicates.md) enforcement are required.

When `Sorted=True`, or when the list contains zero or one entry, `Sort` is a no-op and fires no events. To re-sort a list whose sorted flag is true but whose order was corrupted, first set `Sorted=False`, then set it true again.

The quicksort is not stable. Strings that compare equal can change relative order, and their associated `Objects` move with them as intact pairs. Do not depend on original order among duplicates or retain indexes across the call.

An exception from `OnChanging` occurs before sorting. An exception from `OnChange` occurs after sorting. A failure during comparison could leave a partially rearranged list without the post-change callback; the method provides no rollback. Event handlers must not re-enter mutations on the same list.

Average runtime is O(n log n), worst case depends on partition behavior, and the implementation sorts the backing array in place. Locale-aware comparison cost grows with String length. The operation is mutable and not thread-safe.

The source-reviewed example uses one-time sorting intentionally and frees the caller-owned list. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.Sort`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.Sort) - Delphi sort reference.
- [Free Pascal: `TStringList.Sort`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.sort.html) - compatible one-time sort context; Velox-specific details follow current Delphi source.

<small>Created 2026-07-15</small>
