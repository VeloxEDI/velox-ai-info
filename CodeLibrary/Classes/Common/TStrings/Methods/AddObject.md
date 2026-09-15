---
title: AddObject
description: Adds a string with an associated TObject reference and returns the concrete entry index.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, addobject, object-reference, ownership]
---

```Delphi
function AddObject(S: string; AObject: TObject): Integer;
```

### Example

```Delphi
procedure AddContext(const Items: TStringList; const Context: TObject);
begin
  Items.AddObject('Inbound', Context);
end;
```

### Usage

Call `AddObject` to add a string and associate an existing `TObject` reference with that entry. The method returns the resulting zero-based index; it does not clone the object or establish a universal ownership rule.

- Keep `AObject` alive for every later read; storing it does not clone or validate it.
- Never infer ownership solely from this call. Check the class and construction path.
- With some list classes, a failure while assigning the object can leave the string present. Event and allocation errors can also occur after the list has begun changing.

### Additional Technical Info
`AddObject` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). The association is a raw object reference; ownership and destruction depend on the concrete descendant.

#### Source-backed behaviour

The base implementation calls virtual [`Add`](Add.md), then writes [`Objects[Result]`](../Properties/Objects.md). `TStringList` overrides the method and inserts the string/object pair together, including sorted-list and duplicate handling.

The current script-visible parameterless `TStringList.Create` produces a non-owning list, so it borrows associated objects. Other native descendants can own their objects. The `TStrings` contract itself does not promise either policy.

#### Operational guidance

- Keep `AObject` alive for every later read; storing it does not clone or validate it.
- Never infer ownership solely from this call. Check the concrete class and construction path.
- A base-class two-step implementation can leave the string present if the object setter fails. `TStringList`'s override is a single insert path, but event/allocation exceptions still propagate.
- The returned index can differ from the old count when sorting or duplicate policy is active.

#### Related members

[`Objects`](../Properties/Objects.md) reads or replaces associations. [`IndexOfObject`](IndexOfObject.md) searches by reference identity. [`AddStrings`](AddStrings.md) shallow-copies associations.

#### Official RTL references

- [Embarcadero: TStrings.AddObject](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.AddObject)
- [Free Pascal: TStrings.AddObject](https://www.freepascal.org/docs-html/rtl/classes/tstrings.addobject.html)

<small>Created 2026-07-15</small>
