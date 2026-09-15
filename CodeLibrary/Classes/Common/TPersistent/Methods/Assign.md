---
title: Assign
description: Requests a descendant-specific content copy and falls back through the source AssignTo protocol.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tpersistent, assign]
---

```Delphi
procedure Assign(Source: TPersistent);
```

### Example

```Delphi
procedure CopyPersistent(const Source, Destination: TPersistent);
begin
  Destination.Assign(Source);
end;
```

### Usage

Requests a type-specific content copy and falls back through the source AssignTo protocol.

**Parameters and result**

`Source` must be a compatible live `TPersistent`. The destination remains the same object while its assignable values are copied or replaced.

**Behaviour**

- Exact copied fields, object ownership and depth are defined by the destination/source item implementations.
- Reference assignment (`Destination := Source`) aliases one object; `Destination.Assign(Source)` requests content copying.
- Base fallback gives the source a chance to implement `AssignTo` for the destination type.
- Self-assignment safety is type-specific; some list-like implementations can clear before copying.

**Errors and edge cases**

Nil source and unsupported source/destination combinations raise `EConvertError` in the base protocol. item conversion/allocation/callback errors propagate and may leave partial changes.

### Additional Technical Info
`Assign` is a script-visible method declared on hidden ancestor `TPersistent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Assign` asks the destination object to copy compatible content from `Source`. It copies object state according to descendant rules; it is not the same as assigning one object reference to another.

**Implementation trace**

PascalScript registers the virtual Delphi method. Studio 37.0's base `TPersistent.Assign` calls `Source.AssignTo(Self)` when Source is non-nil; nil calls `AssignError`. Descendants normally override `Assign` and may handle compatible types before falling back to this protocol.

**Side effects and ownership**

Can replace destination content, allocate/free owned subobjects and invoke descendant notifications. It does not transfer ownership of the `Source` object itself.

**Performance and concurrency**

Depends on descendant content size and copy depth; often O(n). No transaction, rollback or thread-safety guarantee.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`TObject.Free`](../../TObject/Methods/Free.md) is lifetime destruction, not content assignment.
- [`TCollection.Clear`](../../TCollection/Methods/Clear.md) illustrates a destructive operation some descendant assignments can perform internally.

**External references**

- [Embarcadero DocWiki: `System.Classes.TPersistent.Assign`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TPersistent.Assign)
- [Free Pascal: `TPersistent.Assign`](https://www.freepascal.org/docs-html/rtl/classes/tpersistent.assign.html)

<small>Created 2026-07-15</small>
