---
title: "Not an array property"
description: "What the PascalScript default-property registration exception means when the named property has no indexes."
sidebar_position: 28
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - indexed-properties
  - registration
---

`Not an array property : '<name>'` is raised while the Velox host registers script-visible classes. The named member is a property, but its registered declaration has no index parameters, so PascalScript cannot use it as the class's default `Object[Index]` property.

## Message shape

```text
Not an array property : '<registered property name>'
```

The full property name is essential support evidence.

## How it is produced

An import first registers a property and can then nominate it through PascalScript's `SetDefaultPropery` API. The compile-time class lookup verifies both the item kind and `Decl.ParamCount`:

- a property with one or more index parameters can become the default;
- a property with zero index parameters raises this exception;
- a non-property item raises `Not a property` instead.

This check establishes only the compile-time registration shape. Getter/setter availability and runtime behaviour are separate property contracts.

## Indexed versus scalar property

```Delphi
{ Indexed property shape: eligible to be nominated as a default property. }
property Items[Index: Integer]: String read GetItem write SetItem;

{ Scalar property shape: not eligible. }
property Count: Integer read GetCount;
```

These declarations illustrate the distinction; Velox users do not register host classes from ordinary scripts.

## What to do

1. Preserve the full error, including the property name.
2. Record the Velox version and the module or class family being compiled.
3. Report the import mismatch through the normal support path.
4. Do not change a valid script from `Object[Index]` to an arbitrary member solely to hide a host-registration failure.

## Edge cases and quirks

- A read-only indexed property can still be a valid default property for reads; zero index parameters, not setter availability, causes this exception.
- The operation is performed during compiler import setup, so the error can appear before a user-code row has meaningful involvement.
- The API name is misspelt `SetDefaultPropery` in the shipped PascalScript interface; that spelling does not affect the public message.
- No executable Velox script example is provided because script code cannot create or correct this registration state.

## Related reference

- `Not a property` - the named default member has the wrong registered item kind.
- `Unknown Property` - no registered member has the requested name.
- `Period ('.') expected` - one possible user-code result when `Object[Index]` has no valid default property.

## External references

- [Free Pascal: Array properties](https://www.freepascal.org/docs-html/ref/refsu35.html)
- [Embarcadero DocWiki: Properties (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Properties_%28Delphi%29)
