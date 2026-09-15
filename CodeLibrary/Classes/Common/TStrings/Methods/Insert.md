---
title: Insert
description: Invokes the concrete descendant's abstract operation to insert a string before a zero-based position.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, insert, index, sorted]
---

```Delphi
procedure Insert(Index: Integer; S: string);
```

### Example

```Delphi
procedure AddHeading(const Items: TStringList);
begin
  if not Items.Sorted then
    Items.Insert(0, 'Heading');
end;
```

### Usage

Invokes the string list's abstract operation to insert a string before a zero-based position.

- `Index = Count` is the append position; `Index > Count` and negative indexes are invalid.
- Do not call on a sorted `TStringList`.
- Saved numeric indexes after the insertion may now refer to different entries.

### Additional Technical Info
`Insert` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). The base `TStrings` class has no storage implementation.

#### Source-backed behaviour

`TStrings.Insert` is abstract. `TStringList.Insert` delegates to its pair insertion with a nil object, requires `0 <= Index <= Count`, and raises `EStringListError` when `Sorted=True`; sorted lists must use [`Add`](Add.md) so the comparison logic chooses the position.

A successful insertion shifts the previous entry at `Index` and all later entries upward. It can allocate capacity and emits change notifications.

#### Related members

[`InsertObject`](InsertObject.md) inserts a paired object. [`Add`](Add.md) is appropriate when order is descendant-controlled. [`Delete`](Delete.md) shifts later indexes down.

#### Official RTL references

- [Embarcadero: TStrings.Insert](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Insert)
- [Free Pascal: TStrings.Insert](https://www.freepascal.org/docs-html/rtl/classes/tstrings.insert.html)

<small>Created 2026-07-15</small>
