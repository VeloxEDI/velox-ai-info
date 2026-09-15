---
title: Append
description: Adds one string by calling virtual Add and discarding the returned index.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, append, add]
---

```Delphi
procedure Append(S: string);
```

### Example

```Delphi
procedure AppendStatus(const Items: TStringList);
begin
  Items.Append('Complete');
end;
```

### Usage

`Append` adds one string by calling Add and discarding the returned index.

- Prefer [`Add`](Add.md) when subsequent logic needs the actual index.
- Do not use `Append` to bypass sorting or duplicate policy.
- The call mutates the list and may invoke change events.

### Additional Technical Info
`Append` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). Despite its name, a sorted concrete list can place the value somewhere other than the physical end.

#### Source-backed behaviour

The installed RTL implementation consists solely of `Add(S)`. Virtual dispatch therefore preserves the concrete descendant's sorting, duplicate, comparison, allocation and event behaviour.

No index is returned. On an unsorted `TStringList` it behaves like an append; on a sorted one it behaves like sorted insertion, and duplicate policy may ignore or reject the value.

#### Related members

[`Add`](Add.md) is the exact terminal call. [`AddObject`](AddObject.md) adds an association, and [`Strings`](../Properties/Strings.md) provides indexed access.

#### Official RTL references

- [Embarcadero: TStrings.Append](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Append)
- [Free Pascal: TStrings.Append](https://www.freepascal.org/docs-html/rtl/classes/tstrings.append.html)

<small>Created 2026-07-15</small>
