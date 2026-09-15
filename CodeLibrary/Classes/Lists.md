---
title: Lists
description: Source-backed guidance for indexed bits, collection-owned items and mutable string lists exposed to Velox scripts.
sidebar_position: 8
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, lists, strings, bits, collections]
---

The Lists branch exposes three Delphi `System.Classes` types with very different ownership and mutation contracts. Use [`TBits`](Lists/TBits.md) for a compact indexed set of Boolean flags, [`TCollectionItem`](Lists/TCollectionItem.md) when working with an item owned by a typed component collection, and [`TStringList`](Lists/TStringList.md) for caller-owned mutable strings with optional associated objects, sorting and change callbacks.

All three types are bound directly through Velox's PascalScript importer to the current Delphi runtime library. They are mutable, synchronous and not thread-safe. Do not retain host-owned items beyond the lifetime of their owning Velox object, and do not share a script-created list or bit set between concurrent flows.

## Choosing a class

| Requirement | Class | Important boundary |
|---|---|---|
| Store Boolean state by zero-based integer index | `TBits` | Reads are bounds-checked; writes can grow the logical size. |
| Inspect or reorder an item inside a Delphi collection | `TCollectionItem` | The collection normally owns and frees the item; `ID` and `Index` have different stability. |
| Store, search, sort, load or save strings | `TStringList` | The script-created list is caller-owned; sorted mode changes insertion and duplicate behavior. |

`TBits` packs flags into machine-word storage. A write beyond the current end grows the array, including a write of `False`; a read beyond the end raises `EBitsError`. [`OpenBit`](Lists/TBits/Methods/OpenBit.md) only finds the first false position. It does not reserve it. In the shipped Delphi implementation it returns `Size` when every logical bit is true, including `0` for an empty set.

`TCollectionItem` is principally an ancestor for domain-specific items such as mail addresses and message parts. Those objects are normally created, held and destroyed by a compatible hidden `TCollection` descendant. Treat an item returned by a collection as borrowed. Assigning `Collection := nil` detaches it without freeing it and shifts lifetime responsibility to the caller; assigning an incompatible collection can detach first and then raise.

`TStringList` is the concrete implementation of a hidden `TStrings` ancestor. The inherited surface remains script-callable and includes `Add`, `Append`, `AddStrings`, `Clear`, `Delete`, `Insert`, `Count`, indexed `Strings`/`Objects`, `Text`, delimited text, name/value access, update batching and file/stream loading or saving. The generated pages in this branch document the `TStringList`-specific constructor, binary search, sort mode, duplicate policy, comparator mode and events without exposing the hidden ancestor path.

## Ordering, identity and ownership

Indexes in all three classes are zero-based, but they mean different things. A `TBits` index identifies one logical flag. A `TCollectionItem.Index` is its current position and can change when the collection is edited; its `ID` is assigned by the collection and remains stable only while the item remains in that collection. A `TStringList` index identifies a current string/object pair and shifts on insertion, deletion or sorting.

Objects stored in a parameterless script-created `TStringList` are not owned because the native `OwnsObjects` flag defaults to false and is not exposed by this importer. Freeing or deleting the list does not free those attached objects. Conversely, a collection does own its attached collection items. These opposite defaults are easy to confuse and can cause either leaks or double frees.

## Sorting and searching safely

`TStringList.Sort` performs a one-time, unstable quicksort but deliberately leaves `Sorted=False`. Set [`Sorted`](Lists/TStringList/Properties/Sorted.md) to true when future `Add` calls must preserve ordering and enforce [`Duplicates`](Lists/TStringList/Properties/Duplicates.md). [`Find`](Lists/TStringList/Methods/Find.md) always runs a binary search and does not check the flag, so calling it on an unsorted or corrupted list can return a plausible but wrong answer.

The default comparison is case-insensitive and uses the process/operating-system locale. Set [`CaseSensitive`](Lists/TStringList/Properties/CaseSensitive.md) before sorting or adding values if case must distinguish keys. For protocol identifiers or other invariant keys, remember that the hidden `UseLocale=True` default cannot be changed through the generated Velox surface.

Avoid inherited `Exchange`, `Move`, direct indexed string writes and `Insert` while maintaining sorted mode. The current Delphi override permits `Exchange` and can leave the list out of order while `Sorted` remains true. `Move` is more dangerous: its inherited implementation removes the source before the sorted-list insert guard raises, so it can lose the entry and its associated object reference. Set `Sorted=False` before deliberate manual reordering, then restore it to re-sort.

## Change notifications

`OnChanging` runs synchronously before a mutation and `OnChange` runs after it. An exception in `OnChanging` normally prevents the mutation; an exception in `OnChange` propagates after state has changed. `BeginUpdate`/`EndUpdate` suppress intermediate callbacks and emit boundary notifications at the outermost update. Event handlers should be short, non-reentrant and should not retain the mutable list.

## Recommended pattern

1. Choose the class by ownership and data shape, not merely by its indexed syntax.
2. Construct caller-owned `TBits`/`TStringList` instances inside `try..finally`; borrow collection items from their owner.
3. Establish `CaseSensitive`, `Duplicates` and `Sorted` before bulk `TStringList` insertion.
4. Treat returned indexes and object references as invalid after mutation or sorting.
5. Check bounds or sentinel values explicitly; do not assume Free Pascal and Delphi return the same sentinel.
6. Snapshot primitive results before navigation, owner destruction or concurrent work.

## External references

- [Embarcadero DocWiki: `System.Classes`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes) - authoritative unit reference for the Delphi implementation used by Velox.
- [Free Pascal: Classes unit](https://www.freepascal.org/docs-html/rtl/classes/index.html) - useful compatibility reference; documented differences on the member pages do not override Velox's Delphi behavior.
