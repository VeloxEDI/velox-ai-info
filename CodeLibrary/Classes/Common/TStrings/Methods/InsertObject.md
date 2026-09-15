---
title: InsertObject
description: Inserts a string and TObject association at a requested index through the concrete list implementation.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, insertobject, object-reference, sorted]
---

```Delphi
procedure InsertObject(Index: Integer; S: string; AObject: TObject);
```

### Example

```Delphi
procedure InsertContext(const Items: TStringList; const Context: TObject);
begin
  if not Items.Sorted then
    Items.InsertObject(0, 'Context', Context);
end;
```

### Usage

Call `InsertObject` to insert a string and associated `TObject` reference at a requested zero-based index. The object is not cloned, and later items shift position.

- Do not use this method on sorted `TStringList`; use [`AddObject`](AddObject.md).
- Decide and document who owns the object before associating it.
- Insertion shifts later indexes.

#### Usage guidance

- Do not use this method on sorted `TStringList`; use [`AddObject`](AddObject.md).
- Decide and document who owns the object before associating it.
- Insertion shifts later indexes.
- Other `TStrings` string lists can use the base two-step path and may be partially changed on setter failure.

### Additional Technical Info
`InsertObject` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). The association remains subject to the descendant's ownership policy.

#### Source-backed behaviour

The base implementation calls virtual [`Insert`](Insert.md) and then sets [`Objects[Index]`](../Properties/Objects.md), so a failure in the second step can leave text inserted without the object. `TStringList` overrides the method and inserts the pair together.

For `TStringList`, the index range is `0..Count`, and `Sorted=True` raises instead of accepting an explicit position. The parameterless script-created list borrows `AObject`; no clone or lifetime check is performed.

#### Related members

[`AddObject`](AddObject.md) lets the descendant choose the index. [`IndexOfObject`](IndexOfObject.md) searches associations by identity.

#### Official RTL references

- [Embarcadero: TStrings.InsertObject](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.InsertObject)
- [Free Pascal: TStrings.InsertObject](https://www.freepascal.org/docs-html/rtl/classes/tstrings.insertobject.html)

<small>Created 2026-07-15</small>
