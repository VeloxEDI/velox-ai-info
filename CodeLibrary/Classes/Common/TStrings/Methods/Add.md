---
title: Add
description: Adds one string through the concrete list implementation and returns the zero-based index assigned to it.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, add, index]
---

```Delphi
function Add(S: string): Integer;
```

### Example

```Delphi
procedure AddLabel(const Items: TStringList; var AddedAt: Integer);
begin
  AddedAt := Items.Add('Ready');
end;
```

### Usage

Call `Add` to place one string in the list and receive its resulting zero-based index. Use the returned index rather than assuming the item remains at the previous end, particularly for a sorted list.

- Adding changes the list and can fire `OnChanging`/`OnChange` unless updates are batched.
- Allocation, duplicate-policy and event-handler exceptions propagate; the list may already have changed if string list code fails after insertion.

#### Usage guidance

- Use the returned index instead of assuming append position.
- Adding changes the list and can fire `OnChanging`/`OnChange` unless updates are batched.
- Allocation, duplicate-policy and event-handler exceptions propagate; the list may already have changed if string list code fails after insertion.
- The text is copied as a managed string. It is not parsed as a name/value pair unless accessed later through name/value properties.

### Additional Technical Info
`Add` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It returns the position actually chosen by the concrete list; that position is not guaranteed to equal the old count when a descendant sorts or rejects duplicates.

#### Source-backed behaviour

The base Studio 37.0 implementation takes the current `Count`, calls virtual [`Insert`](Insert.md) at that position, and returns the original count. Concrete descendants can override `Add`; `TStringList` does so to honour `Sorted`, `Duplicates`, `CaseSensitive` and comparison settings.

On an unsorted parameterless `TStringList`, the string is appended and the returned index is the previous count. On a sorted list, insertion position is comparison-driven. With `dupIgnore`, an equal existing entry can be returned without growing the list; with `dupError`, an exception is raised.

#### Related members

[`Append`](Append.md) calls `Add` and discards the index. [`AddObject`](AddObject.md) also associates an object. [`Count`](../Properties/Count.md) reports the live entry count.

#### Official RTL references

- [Embarcadero: TStrings.Add](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Add)
- [Free Pascal: TStrings.Add](https://www.freepascal.org/docs-html/rtl/classes/tstrings.add.html)

<small>Created 2026-07-15</small>
