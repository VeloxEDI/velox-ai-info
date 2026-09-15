---
title: Create
description: Invokes the root Delphi object constructor after runtime instance allocation and zero-initialisation.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tobject, create]
---

```Delphi
constructor Create;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Obj: TObject;
begin
  Obj := TObject.Create;
  try
    Value := Obj.ClassName;
  finally
    Obj.Free;
  end;
end;
```

### Usage

`Create` invokes the root object constructor after runtime instance allocation and zero-initialisation.

**Parameters and result**

No parameters. It returns a caller-owned object when no other ownership contract applies.

**Behaviour**

- Use a visible item constructor when the script needs real functionality.
- Successful construction must be paired with exactly one documented lifetime owner or `Free`.
- If a constructor exception escapes, Velox destroys the partially constructed instance.
- A bare `TObject` contains no Velox configuration or business state.

**Errors and edge cases**

Allocation can fail. Do not call methods on an unassigned result after construction failure.

### Additional Technical Info
`Create` is a script-visible constructor declared on hidden ancestor `TObject`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Create` is the root Object Pascal constructor. For bare `TObject` the method body does nothing; hidden constructor machinery allocates and initializes the instance before it runs.

**Implementation trace**

PascalScript registers Delphi `TObject.Create` directly. Studio 37.0's method body is empty, while constructor dispatch/NewInstance allocates the runtime class and zero-initialises instance storage. Concrete descendants can expose their own constructors with substantial initialization.

**Side effects and ownership**

Allocates heap memory and creates an object identity.

**Performance and concurrency**

Base construction is small/O(1), but descendant constructors can be expensive or stateful. No general thread-safety promise.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Free`](Free.md) is the nil-safe cleanup operation.
- [`ClassName`](../Properties/ClassName.md) exposes the actual runtime class name.

**External references**

- [Embarcadero DocWiki: `System.TObject.Create`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TObject.Create)
- [Free Pascal: `TObject.Create`](https://www.freepascal.org/docs-html/rtl/system/tobject.create.html)

<small>Created 2026-07-15</small>
