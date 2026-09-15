---
title: Count
description: Returns the concrete list's current number of valid zero-based string entries.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, count, index]
---

```Delphi
property Count: Integer read;
```

### Example

```Delphi
procedure ReadLast(const Items: TStringList; var LastValue: string);
begin
  if Items.Count = 0 then
    LastValue := ''
  else
    LastValue := Items[Items.Count - 1];
end;
```

### Usage

`Count` returns the list's current number of valid zero-based string entries.

- Re-read Count when other code can mutate the list.
- Guard empty lists before calculating `Count - 1`.
- Do not iterate concurrently with mutation unless the workflow supplies external synchronisation.

### Additional Technical Info
`Count` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). The base accessor is abstract and every storage-bearing descendant must implement it.

#### Source-backed behaviour

Valid indexed positions are `0` through `Count - 1`; a zero count means no valid index. The property is live and can change after add, insert, delete, clear, text/delimited assignment, load or event-driven mutation.

`Count` is not `Capacity`, a byte size or a character count. Reading it does not snapshot the collection or lock it.

#### Related members

[`Strings`](Strings.md) and [`Objects`](Objects.md) use this index range. [`Capacity`](Capacity.md) is allocation headroom.

#### Official RTL references

- [Embarcadero: TStrings.Count](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Count)
- [Free Pascal: TStrings.Count](https://www.freepascal.org/docs-html/rtl/classes/tstrings.count.html)

<small>Created 2026-07-15</small>
