---
title: FindComponent
description: Finds an immediately owned component by non-empty case-insensitive Delphi component name.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, findcomponent]
---

```Delphi
function FindComponent(AName: string): TComponent;
```

### Example

```Delphi
function OwnedComponent(const Container: TComponent;
  const ComponentName: string): TComponent;
begin
  Result := Container.FindComponent(ComponentName);
end;
```

### Usage

`FindComponent` finds an immediately owned component by non-empty case-insensitive Velox component name.

**Parameters and result**

`AName` is the component's `Name`, with no trimming. The result is a live owner-owned `TComponent` or nil.

**Behaviour**

- Comparison is case-insensitive under Velox `CompareText` rules.
- Empty, whitespace-only and unknown names do not receive special normalisation; empty returns nil and whitespace is searched literally.
- Only immediate owned children participate.
- The returned reference remains owned by its existing owner and can become stale on destruction.

**Errors and edge cases**

A nil receiver fails. A miss returns nil, so callers must test before dereferencing. Allocation while building the cache can raise.

### Additional Technical Info
`FindComponent` is a script-visible method declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`FindComponent` searches only the receiver's immediate owned-component list. It does not recurse through grandchildren, search Velox modules or interpret a dotted path.

**Implementation trace**

Studio 37.0 returns nil for an empty name or missing list. On first non-empty lookup it builds and sorts a cached list with Delphi `CompareText`, then uses binary search; owner insertion/removal/rename code maintains that cache.

**Side effects and ownership**

Logically read-only, but the first lookup can allocate/build the sorted-name cache. No ownership transfer occurs.

**Performance and concurrency**

First lookup after cache invalidation is O(n log n); subsequent lookup is O(log n). Component lists and cache maintenance are not a general concurrent-access contract.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Name`](../Properties/Name.md) defines the validated lookup key.
- [`Components`](../Properties/Components.md) provides positional immediate-child access.
- [`ComponentCount`](../Properties/ComponentCount.md) reports the search population.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.FindComponent`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.FindComponent)
- [Free Pascal: `TComponent.FindComponent`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.findcomponent.html)

<small>Created 2026-07-15</small>
