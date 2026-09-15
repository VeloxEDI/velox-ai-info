---
title: Tag
description: Provides mutable NativeInt component metadata whose meaning is entirely defined by the surrounding application.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, tag]
---

```Delphi
property Tag: NativeInt read write;
```

### Example

```Delphi
procedure MarkComponent(const Item: TComponent;
  const Marker: NativeInt);
begin
  Item.Tag := Marker;
end;
```

### Usage

`Tag` provides mutable NativeInt component metadata whose meaning is entirely defined by the surrounding application.

**Parameters and result**

Read/write `NativeInt`. Width follows the running process target, so it is 32-bit in a 32-bit process and 64-bit in a 64-bit process.

**Behaviour**

- Default value is zero for a normally constructed component.
- A value is meaningful only when the owning contract defines it.
- Do not assume portability of large values between 32-bit and 64-bit Velox processes.
- Do not use it as a pointer, credential, database key or durable Velox identifier without an explicit contract.

**Errors and edge cases**

A nil receiver fails. Assignments outside the running `NativeInt` range follow normal conversion/range behaviour.

### Additional Technical Info
`Tag` is a script-visible property declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Tag` is a general-purpose native-width signed integer stored on every `TComponent`. Delphi and Velox do not assign it a universal meaning.

**Implementation trace**

PascalScript directly reads and writes the native `TComponent.Tag` field. Object allocation zero-initialises it; native component streaming can persist published properties in contexts that actually stream the component.

**Side effects and ownership**

Writing changes live component metadata and may affect descendant/application code that also uses `Tag`.

**Performance and concurrency**

O(1), mutable and unsynchronised.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`DesignInfo`](DesignInfo.md) is separate reserved designer metadata.
- [`ClassName`](../../TObject/Properties/ClassName.md) is diagnostic runtime type text, not a Tag schema.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.Tag`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.Tag)
- [Free Pascal: `TComponent.Tag`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.tag.html)

<small>Created 2026-07-15</small>
