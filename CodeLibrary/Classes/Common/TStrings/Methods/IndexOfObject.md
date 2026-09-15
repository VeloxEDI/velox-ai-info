---
title: IndexOfObject
description: Returns the first entry associated with the exact TObject reference, or minus one.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, indexofobject, object-reference, identity]
---

```Delphi
function IndexOfObject(AObject: TObject): Integer;
```

### Example

```Delphi
procedure FindContext(const Items: TStringList; const Context: TObject;
  var FoundAt: Integer);
begin
  FoundAt := Items.IndexOfObject(Context);
end;
```

### Usage

`IndexOfObject` returns the first entry associated with the exact TObject reference, or minus one.

- Keep associated objects alive independently when the list is non-owning.
- Use `>= 0` to test success.
- Do not dereference an object obtained from the list unless its external lifetime is still guaranteed.

### Additional Technical Info
`IndexOfObject` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It compares references, not class names, object state or values.

#### Source-backed behaviour

The base method scans from zero and tests `GetObject(Index) = AObject`. `TStringList` provides an equivalent optimized direct scan. The first identical pointer wins; duplicate associations are permitted.

Searching for nil returns the first entry with no associated object. A dangling reference previously stored in the list is still only a pointer value; this search does not validate that the target object remains alive.

#### Related members

[`Objects`](../Properties/Objects.md) reads and writes associations. [`AddObject`](AddObject.md) creates a pair. [`IndexOf`](IndexOf.md) searches text.

#### Official RTL references

- [Embarcadero: TStrings.IndexOfObject](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.IndexOfObject)
- [Free Pascal: TStrings.IndexOfObject](https://www.freepascal.org/docs-html/rtl/classes/tstrings.indexofobject.html)

<small>Created 2026-07-15</small>
