---
title: Duplicates
description: Selects accept, ignore or exception behavior for equal values added while maintained sorted mode is active.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, string-list, duplicates, sorted, insertion]
---

```Delphi
property Duplicates: TDuplicates read write;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Names: TStringList;
begin
  Names := TStringList.Create;
  try
    Names.Duplicates := dupIgnore;
    Names.Sorted := True;
    Names.Add('Alpha');
    Names.Add('Alpha');
    Value := Names.Count;  // 1
  finally
    Names.Free;
  end;
end;
```

### Usage

`Duplicates` selects accept, ignore or exception behaviour for equal values added while maintained sorted mode is active.

### Additional Technical Info
`Duplicates` controls what `Add`/`AddObject` does when [`Find`](../Methods/Find.md) reports an equal String while [`Sorted`](Sorted.md) is true:

- `dupIgnore` returns the existing matching index without inserting, changing the attached object or firing change events;
- `dupAccept` inserts another String/object pair at the comparator position; and
- `dupError` raises `EStringListError` before mutation or change events.

The default is `dupIgnore`, but the property has no effect while `Sorted=False`: additions append and all duplicates are accepted. Calling [`Sort`](../Methods/Sort.md) alone does not change that flag, so setting a duplicate policy plus calling `Sort` is insufficient for future enforcement.

The setter stores the enumeration directly. It does not scan, remove, merge or reorder existing values and fires no events. A list can therefore contain duplicates while the property says ignore or error—because they were added while unsorted, copied from another list, or became equal after [`CaseSensitive`](CaseSensitive.md) changed.

Equality uses the current case and hidden locale settings, not exact Unicode code-unit identity by default. Under case-insensitive comparison, `Alpha` and `alpha` can be duplicates. Locale changes can also alter equivalence/order between process runs.

When `dupIgnore` finds an existing String, the new `AObject` passed to `AddObject` is not stored or freed. Because parameterless script-created lists have unexposed `OwnsObjects=False`, the caller remains responsible for that object in every duplicate outcome. `dupError` likewise leaves it with the caller.

The source-reviewed example configures the policy before enabling sorted mode and confirms the ignored insertion. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.Duplicates`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.Duplicates) - Delphi duplicate-policy reference.
- [Free Pascal: `TStringList.Duplicates`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.duplicates.html) - compatible sorted-only policy overview.

<small>Created 2026-07-15</small>
