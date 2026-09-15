---
title: Delete
description: Invokes the concrete descendant's abstract operation to remove the entry at a zero-based index.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, delete, index, ownership]
---

```Delphi
procedure Delete(Index: Integer);
```

### Example

```Delphi
procedure RemoveFirst(const Items: TStringList);
begin
  if Items.Count > 0 then
    Items.Delete(0);
end;
```

### Usage

`Delete` invokes the string list's abstract operation to remove the entry at a zero-based index.

- Validate indexes against the live [`Count`](../Properties/Count.md); deletion shifts every later index down by one.
- Any saved reference to the deleted string entry becomes stale. An associated borrowed object remains independently owned elsewhere.
- In an owning string list, object destruction can raise after the entry was removed.

### Additional Technical Info
`Delete` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). Index validation, object lifetime and notification behaviour come from the concrete list.

#### Source-backed behaviour

`TStrings.Delete` is abstract. `TStringList.Delete` requires `0 <= Index < Count`, emits a changing notification, removes the managed string/object pair, compacts later entries, optionally frees the associated object when the native list owns objects, then emits changed.

The parameterless script-created `TStringList` is non-owning, so its associated object is merely detached. Other descendants can implement different storage or ownership rules.

#### Related members

[`Clear`](Clear.md) removes all entries. [`Move`](Move.md) internally detaches an object before deleting its old entry. [`Objects`](../Properties/Objects.md) exposes associations.

#### Official RTL references

- [Embarcadero: TStrings.Delete](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Delete)
- [Free Pascal: TStrings.Delete](https://www.freepascal.org/docs-html/rtl/classes/tstrings.delete.html)

<small>Created 2026-07-15</small>
