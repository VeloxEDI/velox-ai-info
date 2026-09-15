---
title: AddStrings
description: Adds every string and associated object reference from another TStrings object inside a balanced update batch.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, addstrings, batch, shallow-copy]
---

```Delphi
procedure AddStrings(Strings: TStrings);
```

### Example

```Delphi
procedure MergeNames(const Source, Target: TStringList);
begin
  Target.AddStrings(Source);
end;
```

### Usage

`AddStrings` adds every string and associated object reference from another TStrings object inside a balanced update batch.

- Use a distinct source and target and decide explicitly who owns associated objects.
- The call is not transactional. Update batching suppresses/coalesces notifications; it does not rollback.
- Nil source, invalid source references, allocation errors, duplicate-policy errors and event-handler errors propagate.

#### Usage guidance

- Use a distinct source and target and decide explicitly who owns associated objects.
- The call is not transactional. Update batching suppresses/coalesces notifications; it does not rollback.
- Nil source, invalid source references, allocation errors, duplicate-policy errors and event-handler errors propagate.
- Use `Assign` only when the API intentionally needs formatting/encoding settings copied as well; this method copies entry pairs only.

### Additional Technical Info
`AddStrings` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It copies entries rather than transferring them, and it does not copy formatting, encoding or comparison properties.

#### Source-backed behaviour

The base overload calls [`BeginUpdate`](BeginUpdate.md), loops from zero through the source count captured for the `for` bound, and calls [`AddObject`](AddObject.md) for each source `Strings[I]` and `Objects[I]`. [`EndUpdate`](EndUpdate.md) runs in `finally`.

`TStringList` overrides this path. An unsorted target inserts every pair directly at the end. It uses the same fast append path when the target is empty and both source and target are equally sorted `TStringList` instances with matching case, locale and duplicate settings; other sorted cases fall back to the base per-entry `AddObject` path. Object references remain shallow copies in every branch. Self-add duplicates the original bound's entries but sorting can change which source entry occupies a later index, so it is not a safe cloning operation. A failure partway through leaves already-added entries in place.

#### Related members

[`AddObject`](AddObject.md) defines each pair insertion. [`BeginUpdate`](BeginUpdate.md) and [`EndUpdate`](EndUpdate.md) define notification batching. [`Equals`](Equals.md) ignores object associations.

#### Official RTL references

- [Embarcadero: TStrings.AddStrings](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.AddStrings)
- [Free Pascal: TStrings.AddStrings](https://www.freepascal.org/docs-html/rtl/classes/tstrings.addstrings.html)

<small>Created 2026-07-15</small>
