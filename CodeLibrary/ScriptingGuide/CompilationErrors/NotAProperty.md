---
title: "Not a property"
description: "What the PascalScript default-property registration exception means and why script punctuation does not fix it."
sidebar_position: 27
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - properties
  - registration
---

`Not a property : '<name>'` is a host-registration exception, not an ordinary error emitted while parsing a script statement. It means an import tried to make a named class member the default indexed property, but the existing registered item with that name is a method or another non-property member.

## Message shape

```text
Not a property : '<registered member name>'
```

The short Code Library catalogue label omits the parameter. Preserve the complete message because the member name identifies the failing import registration.

## How it is produced

Velox loads script-visible class import units while preparing the compiler. An import can register a property and then call PascalScript's `SetDefaultPropery` operation (the spelling is from the shipped API). That operation searches the compile-time class's registered items by name:

- if it finds an indexed property, it records it as the class's default property;
- if it finds a non-property item, it raises `Not a property : '<name>'`;
- if it finds no item, it raises the separate `Unknown Property` exception.

The exception occurs in the script-host setup path. It is not `ecReadOnlyProperty`, and it is not caused by assigning to an object property in user code.

## What to do

1. Retain the full message, Velox version, module context and script that caused compiler initialisation.
2. Confirm whether the issue occurs for every script using the same imported module or class family.
3. Report it through the normal Velox support path as a Code Library/import registration defect.
4. Do not rename members or add punctuation to production scripts as a speculative workaround.

## Edge cases and quirks

- Standard shipped imports call this operation for several default members such as `Fields`, `Items`, `Values`, `Map` and `Variable`. A new or mismatched import can therefore surface the exception before the user's statement is analysed.
- The lookup is case-insensitive because registered item names are normalised.
- A same-named method can shadow the intended registration and trigger this exact branch.
- No runnable script example is provided: a user script cannot intentionally repair or safely reproduce host class registration.

## Related reference

- `Not an array property` - the named item is a property but has no index parameters.
- `Unknown Property` - the named default member is absent from the registered class.
- `Read-only property` - a normal script tries to write a registered property with no setter.

## External references

- [Free Pascal: Property definition](https://www.freepascal.org/docs-html/ref/refsu33.html)
- [Embarcadero DocWiki: Properties (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Properties_%28Delphi%29)
