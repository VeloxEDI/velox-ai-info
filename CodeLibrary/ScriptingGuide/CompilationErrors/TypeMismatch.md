---
title: "Type mismatch"
description: "How Velox reports incompatible expression, assignment, argument, cast, comparison and declaration types."
sidebar_position: 42
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - types
  - assignment
  - parameters
---

Velox reports `Type mismatch` when a value's compile-time type is not compatible with the operation, destination, parameter or declaration that receives it. The message is shared by many compiler paths and does not include the expected or supplied type, so the surrounding construct must be inspected.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Count: Integer;
begin
  Count := 'three'; // Error: Type mismatch
  Value := Count;
end;
```

Use a value of the destination type, or perform an intentional supported conversion:

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Count: Integer;
begin
  Count := 3;
  Value := Count;
end;
```

## What Velox validates

The current modified PascalScript compiler uses this diagnostic for several distinct families:

| Family | What must be compatible |
|---|---|
| Assignment and results | The right-hand expression and the variable, property, function result or temporary receiving it. |
| Routine calls | Each actual argument and formal parameter. `var` and `out` parameters use stricter variable/type checks than ordinary input parameters. |
| Operators and comparisons | Operand types supported by the unary, arithmetic, Boolean, relational, set or membership operator. |
| Constant evaluation | Types used while folding a compile-time expression, set value, range or attribute argument. |
| Indexing | String, dynamic-array and static-array indexes must be integer types; a string-element assignment must supply a character type. |
| Sets and `case` values | Element, range and selector types must agree with the owning set or selector. |
| Classes and interfaces | Casts, class-reference operations, interface inheritance and `nil` assignment must target a supported class/interface-capable type. |
| Type declarations | Array bounds, enumerated/subrange values, interface ancestors and other declaration components must have the required type family. |
| Control flow | A `for` counter and bounds must use one of the counter types implemented by the embedded compiler; conditions must be Boolean-compatible. |

Assignments ultimately pass through the compiler's compatibility check before bytecode is emitted. Calls are checked once while collecting arguments and again when non-input parameters are prepared, which is why a `var` argument can fail even when a similar by-value call would be accepted.

## Diagnosis procedure

1. Start with the first compiler error. Later type errors can be consequences of an unresolved name or malformed expression.
2. Identify the owning construct: assignment, call, operator, index, declaration, cast, set, `case`, condition or loop.
3. Determine the declared type on each side. For a call, inspect the exact exposed overload and every parameter mode.
4. Replace an accidental value with one of the required type. Use a conversion only when the conversion is meaningful for the data.
5. Recompile before changing another expression; the message does not carry enough information to diagnose several edits at once.

## Edge cases and quirks

- Velox emits only `Type mismatch`; unlike Delphi's E2010 message, it does not print the expected and supplied type names.
- Script identifiers are case-insensitive, but types remain semantically distinct even when their names look related.
- `Variant` permits many operations to be selected at compile time, but it does not make every structured, class, set, array or `var`-parameter combination compatible. Some `Variant` failures are deferred until runtime instead.
- A `var` or `out` argument must first be writable storage. A literal or expression produces `Variable Expected`; writable storage of the wrong type produces `Type mismatch`.
- Open-array and generic `AnyString` call paths have special handling. `AnyString` accepts registered string/character types (and, in one input path, `Variant`), while non-input parameters are resolved to the actual storage type.
- Assigning `nil` is implemented only for supported pointer, dynamic-array, class, external-class, interface and procedural targets. Other targets produce `Type mismatch`.
- String and array indexes must be integer types. A valid integer index can still be outside the runtime bounds; that is not this compile-time diagnostic.
- Constant expressions may be folded during compilation. Incompatible operands fail before the event runs; arithmetic exceptions use the separate `Divide by Zero` or `Math Error` diagnostics.
- The exact compatibility rules come from the shipped embedded PascalScript compiler. Free Pascal and Delphi documentation is useful language context, not proof that every upstream implicit conversion is available in Velox.

## Performance and concurrency

This diagnostic is produced during compilation and has no runtime concurrency effect. Correcting it may change whether a conversion occurs at compile time or runtime, so avoid using `Variant` merely to silence the compiler when a stable typed value is available.

## Related reference

- `Variable Expected` - a construct received a value rather than writable storage.
- `Unknown type` - a type name could not be resolved at all.
- `Unknown identifier` - a value, routine or member name could not be resolved.
- `Invalid number of parameters` - the call has the wrong argument count rather than incompatible argument types.

## External references

- [Free Pascal: Value typecasts](https://www.freepascal.org/docs-html/ref/refse84.html)
- [Embarcadero DocWiki: Type Compatibility and Identity (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Type_Compatibility_and_Identity)
- [Embarcadero DocWiki: E2010 Incompatible types](https://docwiki.embarcadero.com/RADStudio/en/E2010_Incompatible_types_-_%27%25s%27_and_%27%25s%27_%28Delphi%29)
