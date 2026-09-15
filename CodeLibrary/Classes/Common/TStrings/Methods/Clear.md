---
title: Clear
description: Invokes the concrete TStrings descendant's abstract clear operation to remove every entry.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, clear, delete, ownership]
---

```Delphi
procedure Clear;
```

### Example

```Delphi
procedure ResetList(const Items: TStringList);
begin
  Items.Clear;
end;
```

### Usage

Invokes the TStrings string list's abstract clear operation to remove every entry.

- Treat all current indexes and entry aliases as invalid after a successful clear.
- Do not assume associated objects are freed or retained from the `TStrings` type alone.
- Clear is not rollback-safe. Event and destructor exceptions can occur after state changes.

### Additional Technical Info
`Clear` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). The base class supplies no storage implementation, so object destruction, capacity changes and notifications are descendant-defined.

#### Source-backed behaviour

`TStrings.Clear` is abstract. In the visible parameterless `TStringList`, `Clear` emits changing/changed notifications when nonempty, sets count to zero, releases capacity, and does not free associated objects because that construction path is non-owning. A native `TStringList` created with `OwnsObjects=True` gathers and frees its object references after detaching the array.

If an owned object's destructor raises, the list is already empty and storage released; remaining gathered objects after the failing one are not guaranteed to be freed.

#### Related members

[`Delete`](Delete.md) removes one entry. [`Objects`](../Properties/Objects.md) explains reference ownership. [`Count`](../Properties/Count.md) becomes zero after a successful clear.

#### Official RTL references

- [Embarcadero: TStrings.Clear](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Clear)
- [Free Pascal: TStrings.Clear](https://www.freepascal.org/docs-html/rtl/classes/tstrings.clear.html)

<small>Created 2026-07-15</small>
