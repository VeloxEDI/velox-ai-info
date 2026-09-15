---
title: ClassName
description: Returns the unqualified actual runtime class name through a Velox PascalScript pseudo-property.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tobject, classname]
---

```Delphi
property ClassName: String read; // PascalScript pseudo-property
```

### Example

```Delphi
function RuntimeClassName(const Obj: TObject): string;
begin
  Result := Obj.ClassName;
end;
```

### Usage

`ClassName` returns the unqualified actual runtime class name through a Velox scripting pseudo-property.

**Parameters and result**

Read-only `String`. The result is the unqualified class identifier such as `TStringList`, preserving its declared case.

**Behaviour**

- This is not a Velox instance property; the pseudo-property is a scripting convenience.
- The text omits unit/scope qualification and is not globally unique across all possible modules.
- Use it for diagnostics and cautious branching, not authentication, authorisation or a substitute for a typed API.
- item class names can change with product/library versions.

**Errors and edge cases**

Reading through nil/stale object references is unsafe. The method does not return an empty string for nil.

### Additional Technical Info
`ClassName` is a script-visible property declared on hidden ancestor `TObject`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`ClassName` exposes Delphi's `TObject.ClassName` class function using property syntax added by the Velox-modified PascalScript import. It reports the actual runtime class, not merely the declared variable type.

**Implementation trace**

`uPSC_std`/`uPSR_std` register a read-only helper named `ClassName`. Studio 37.0 reads the class's VMT name and converts its stored UTF-8 identifier to a Delphi string.

**Side effects and ownership**

Read-only with no ownership or state change.

**Performance and concurrency**

Small/O(class-name length). Safe only while the object reference remains valid.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Create`](../Methods/Create.md) creates a bare object.
- [`Free`](../Methods/Free.md) invalidates the reference and therefore this pseudo-property.

**External references**

- [Embarcadero DocWiki: `System.TObject.ClassName`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TObject.ClassName)
- [Free Pascal: `TObject.ClassName`](https://www.freepascal.org/docs-html/rtl/system/tobject.classname.html)

<small>Created 2026-07-15</small>
