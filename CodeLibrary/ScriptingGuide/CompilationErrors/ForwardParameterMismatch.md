---
title: "Forward Parameter Mismatch"
description: "How a routine implementation differs from its earlier forward declaration."
sidebar_position: 17
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - forward
  - parameters
---

Velox reports this error when a procedure or function implementation is matched to an earlier `forward` declaration but their callable signatures are not equivalent.

## Expected form

```Delphi
function Normalise(const Value: string; var Changed: Boolean): string; forward;

function Normalise(const Value: string; var Changed: Boolean): string;
begin
  Changed := True;
  Result := Value;
end;
```

## Example

The parameter mode changes from `var` to an ordinary value parameter:

```Delphi
procedure UpdateValue(var Value: string); forward;

procedure UpdateValue(Value: string); // Forward Parameter Mismatch
begin
end;
```

Repeat the same mode and type:

```Delphi
procedure UpdateValue(var Value: string);
begin
end;
```

## What the compiler compares

The modified PascalScript compiler resolves the implementation to the forward routine and calls its signature comparison. `TPSParametersDecl.Same` checks:

- the number of parameters;
- the result type identity for a function;
- each parameter's mode, such as ordinary, `const`, `var` or `out`; and
- each parameter's resolved type identity, in declaration order.

Parameter names are not compared. Renaming `Value` to `Text` alone does not cause this diagnostic, although keeping names aligned makes the source easier to audit.

## Type identity matters

The comparison uses the compiler's resolved type objects, not a broad “convertible at runtime” rule. Two types that can be assigned between each other may still be different forward-signature types. Use the same declared type name and shape on both headings.

## Correction procedure

1. Locate the preceding `forward` declaration for the routine.
2. Compare procedure versus function and confirm the result type.
3. Compare parameter count and order.
4. Compare every parameter mode and resolved type.
5. Make the implementation heading match the forward declaration exactly, then recompile.

## Common causes

- Adding a parameter to the implementation but not the forward declaration.
- Changing `var` to a value or `const` parameter.
- Changing a type alias or function result on only one heading.
- Reordering parameters.
- Editing one copy of a declaration in included source while leaving another stale.

## Related reference

- `Forward declarations` — declaring routines before their bodies.
- `Unsatisfied forward` — a forward declaration with no implementation.
- `Invalid number of parameters` — a call-site argument-count failure.

## External references

- [Embarcadero DocWiki: Procedures and Functions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Procedures_and_Functions_%28Delphi%29)
