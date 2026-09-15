---
title: Name
description: Reads or assigns a validated component identifier that must be unique within its immediate owner.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, name]
---

```Delphi
property Name: string read write;
```

### Example

```Delphi
function FindNamedChild(const Container: TComponent;
  const ChildName: string): TComponent;
begin
  Result := Container.FindComponent(ChildName);
end;
```

### Usage

`Name` reads or assigns a validated component identifier that must be unique within its immediate owner.

**Parameters and result**

Read/write `string`. Empty is allowed. Non-empty values must be valid Velox identifiers and unique, ignoring case, among immediate owned components.

**Behaviour**

- No whitespace trimming or automatic sanitisation occurs.
- A rename changes `FindComponent` lookup immediately.
- Uniqueness scope is the owner list, not the whole process or Velox repository.
- Renaming can affect Velox streaming/references; treat existing names as external contracts when configurations depend on them.

**Errors and edge cases**

Invalid identifiers and duplicate sibling names raise `EComponentError`. A nil receiver fails. Owner/designer validation can raise additional errors.

### Additional Technical Info
`Name` is a script-visible property declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Name` is the component's Delphi identifier-style name used by owner lookup and native streaming/reference mechanisms. It is not a display label, file name or globally unique Velox module name.

**Implementation trace**

Studio 37.0 accepts empty text or validates non-empty text with `IsValidIdent`. It asks the owner to enforce case-insensitive sibling uniqueness, updates native references, changes the stored name and maintains any owner's sorted lookup cache.

**Side effects and ownership**

Writing can mutate owner lookup caches and native references. It does not rename a Velox file/module unless the concrete descendant explicitly maps those concepts.

**Performance and concurrency**

Read is O(1); rename can update/search owner structures. Not safe for concurrent lookup/mutation.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`FindComponent`](../Methods/FindComponent.md) performs the immediate case-insensitive lookup.
- [`Owner`](Owner.md) defines uniqueness scope.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.Name`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.Name)
- [Free Pascal: `TComponent.Name`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.name.html)

<small>Created 2026-07-15</small>
