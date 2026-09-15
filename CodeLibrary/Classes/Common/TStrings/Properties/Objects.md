---
title: Objects
description: Gets or replaces the TObject reference associated with a zero-based string entry under descendant-defined ownership.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, objects, references, ownership]
---

```Delphi
property Objects[Index: Integer]: TObject read write;
```

### Example

```Delphi
procedure AttachContext(const Items: TStringList; Index: Integer;
  const Context: TObject);
begin
  if (Index >= 0) and (Index < Items.Count) then
    Items.Objects[Index] := Context;
end;
```

### Usage

`Objects` gets or replaces the TObject reference associated with a zero-based string entry under type-specific ownership.

- Keep borrowed objects alive independently and never dereference a stale association.
- Do not use this property as durable data or serialisation; it stores process-local references.
- Confirm ownership before delete/clear/free and before replacing a reference.

### Additional Technical Info
`Objects` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). The reference is untyped and is not cloned, validated or converted.

#### Source-backed behaviour

The base `TStrings` getter returns nil and base setter does nothing; concrete descendants opt into object storage. `TStringList` stores one reference alongside each string and checks the index.

Ownership is a construction detail of the concrete list. The parameterless `TStringList.Create` exposed to scripts creates a non-owning list, so replacement/deletion/clear/free do not free associated objects. Native lists constructed with `OwnsObjects=True` can free objects on removal or destruction. Replacing an object reference in current `TStringList.PutObject` does not free the previous object even for an owning list, which can orphan it.

#### Related members

[`AddObject`](../Methods/AddObject.md), [`InsertObject`](../Methods/InsertObject.md) and [`IndexOfObject`](../Methods/IndexOfObject.md) operate on associations. [`Strings`](Strings.md) is the paired text.

#### Official RTL references

- [Embarcadero: TStrings.Objects](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Objects)
- [Free Pascal: TStrings.Objects](https://www.freepascal.org/docs-html/rtl/classes/tstrings.objects.html)

<small>Created 2026-07-15</small>
