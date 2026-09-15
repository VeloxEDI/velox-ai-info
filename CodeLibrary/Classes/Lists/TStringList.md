---
title: TStringList
description: Implements a caller-owned mutable string and object-pair list with searching, sorting, duplicate policy and change events.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, lists, strings, sorting, events]
---

```Delphi
TStringList = class(TStrings)
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
    Names.Add('Alpha');
    Value := Names.Text;
  finally
    Names.Free;
  end;
end;
```

### Usage

`TStringList` implements a caller-owned mutable string and object-pair list with searching, sorting, duplicate policy and change events.

### Additional Technical Info
`TStringList` is Delphi's concrete general-purpose string list. Each zero-based entry contains a managed String and an optional `TObject` reference. Velox exposes the class's own constructor, [`Find`](TStringList/Methods/Find.md), [`Sort`](TStringList/Methods/Sort.md), [`CaseSensitive`](TStringList/Properties/CaseSensitive.md), [`Duplicates`](TStringList/Properties/Duplicates.md), [`Sorted`](TStringList/Properties/Sorted.md), [`OnChanging`](TStringList/Properties/OnChanging.md) and [`OnChange`](TStringList/Properties/OnChange.md).

Its hidden `TStrings` ancestor supplies a broad script-callable surface: `Add`, `Append`, `AddStrings`, `Clear`, `Delete`, `Insert`, `Count`, `Capacity`, indexed `Strings` and `Objects`, `Text`, `CommaText`, `DelimitedText`, delimiter/quote/name-value properties, name/value lookup, `BeginUpdate`/`EndUpdate`, `Exchange`, `Move`, and file/stream load/save operations. Those inherited members are not duplicated under this class, but their virtual calls execute `TStringList` behavior.

#### Construction and ownership

[`Create`](TStringList/Methods/Create.md) is the parameterless native constructor. The returned list is caller-owned and must be freed in `finally`. Defaults are unsorted, case-insensitive, `dupIgnore`, nil event handlers and locale-aware comparisons. Delimiter is comma, quote is double quote, name/value separator is equals and strict delimiter mode is false.

The native `OwnsObjects` flag defaults to false and is not exposed by this importer. Objects stored through inherited `Objects`/`AddObject` are therefore borrowed: deleting an entry, clearing or freeing this script-created list does not free them. Do not use the list as an owning container, and ensure each associated object has an independent lifetime owner.

#### Sorting, duplicates and lookup

`Sort` is a one-time unstable quicksort that moves each object with its string but leaves `Sorted=False`. Subsequent `Add` calls therefore append again. Set `Sorted=True` to sort once and maintain comparator order for future additions. In that mode `Add` uses binary `Find`, and `Duplicates` selects accept, ignore or exception behavior.

`Find` does not verify the `Sorted` flag or physical ordering. Use it only when the list is genuinely in comparator order. The default comparator is case-insensitive and uses Delphi's locale-aware `AnsiCompareText` because hidden `UseLocale` defaults true and is not script-exposed. Results can therefore vary with process/operating-system locale and are unsuitable as a guaranteed invariant protocol collation.

Duplicate policy is insertion-time only. It is ignored while unsorted and does not remove existing values. Changing `CaseSensitive` can make existing spellings compare equal; re-sorting still does not enforce `Duplicates` retroactively.

#### Sorted-mode hazards

When `Sorted=True`, `Insert` and indexed string assignment raise `EStringListError`. `Exchange` is nevertheless overridden without a sorted guard, so it can swap entries and silently break physical order while the flag remains true. `Find` and later sorted insertion can then produce wrong results.

Inherited `Move` is more hazardous: it saves the source pair, clears the object slot, deletes the entry, then calls `InsertObject`. On a sorted list that final call raises before insertion. The list has already lost the string and no longer retains the object reference. Set `Sorted=False` before manual movement and restore it afterwards, or rebuild a separate list.

#### Events, failure and concurrency

Mutations call `OnChanging` before work and `OnChange` afterwards. `BeginUpdate`/`EndUpdate` coalesces callbacks at the outer boundary. Exceptions propagate: a pre-change exception normally aborts before mutation, while a post-change exception reports failure after the list has changed. Sorting and case-mode re-sorting are also non-transactional if callbacks raise.

Strings are managed automatically, but indexes and borrowed object references shift with edits and sorting. Array insertion/deletion is O(n); `Find` is O(log n) on a valid sorted list; quicksort is O(n log n) on average; text/file operations can allocate proportional to the complete content. The list, callbacks and locale settings are mutable and not thread-safe.

The source-reviewed example configures ordering before insertion, ignores the duplicate and frees the list. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList) - authoritative Delphi class reference.
- [Free Pascal: `TStringList`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.html) - compatible overview; Velox executes the traced Delphi implementation and importer surface above.

<small>Created 2026-07-15</small>
