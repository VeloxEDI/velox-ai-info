---
title: "Class type expected"
description: "Why a class-capable expression or type is required by the current script construct."
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - classes
  - types
---

This error means the current construct requires a class or class-like value, but the resolved type does not support the requested operation. The exact requirement depends on whether the script is accessing an imported class, a script class, a static member or a `with` statement.

## Example

This attempts to use `with` on a scalar value:

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Count: Integer;
begin
  with Count do // Error: Class type expected
    Value := 1;
end;
```

Use `with` only for a supported record or class value, or refer to the scalar directly:

```Delphi
Count := Count + 1;
Value := Count;
```

## Contexts that emit the error

The modified PascalScript compiler uses this diagnostic in several distinct paths:

- An imported or external-class member/static operation requires an external class type (`btExtClass`).
- A script-class type value or static call requires a script class type (`btClass`).
- A `with Expression do` statement requires a record or a supported class value.

The wording is therefore slightly broader than its name suggests: the `with` parser accepts a record as well as a class. Conversely, a record does not satisfy the separate static/class-member paths.

## How to diagnose it

1. Identify the construct at the reported position: a member access, class/static call or `with` statement.
2. Find the Code Library page for the expression or type on the left side.
3. Check whether that page documents a class instance, a class type, a record, a Variant or a scalar.
4. For object members, confirm that an instance expression is used where an instance is required and a type name is used only for an exposed static member.
5. Remove `with` and write the full qualified member access if the inferred owner is ambiguous.

## Common causes

- Applying `with` to an integer, string, Boolean, array or unresolved Variant.
- Treating a record type or record value as a class type for a static operation.
- Calling an instance member through a class name, or a static member through an unrelated value.
- Assuming every Delphi class is exposed to Velox scripts. Only registered Code Library types and members are available.
- A preceding type error causing an expression to resolve differently from intended.

## Location and follow-on messages

Velox displays the parser position at which the required type check fails. That may be the `do`, a period/member token or the opening call rather than the declaration that gave the value its incorrect type. Correct the earliest type-related diagnostic first.

## Related reference

- `with` — supported record/class owners and member-resolution risks.
- `Classes` — types and members registered for Velox scripts.
- `Type mismatch` — assigning or passing a value of an incompatible type.

## External references

- [Embarcadero DocWiki: Classes and Objects (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Classes_and_Objects_%28Delphi%29)
