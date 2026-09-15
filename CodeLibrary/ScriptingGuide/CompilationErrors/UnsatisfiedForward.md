---
title: "Unsatisfied Forward"
description: "Why a forward-declared routine has no matching implementation."
sidebar_position: 48
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - forward
  - procedures
  - functions
---

Velox reports `Unsatisfied Forward <name>` when a script declares a procedure or function as `forward` but compilation finishes without resolving it to a matching implementation.

## Example

```Delphi
procedure PrepareValue(var Value: Variant); forward;

procedure ScriptEvent(var Value: Variant);
begin
  PrepareValue(Value);
end;
```

Add the matching implementation later in the same compilation:

```Delphi
procedure PrepareValue(var Value: Variant); forward;

procedure PrepareValue(var Value: Variant);
begin
  Value := 'Prepared';
end;

procedure ScriptEvent(var Value: Variant);
begin
  PrepareValue(Value);
end;
```

## How Velox detects it

The compiler records an internal routine as forwarded when it accepts the declaration. A later implementation with the same routine name and compatible signature resolves that record. After source parsing and unresolved-label processing, Velox scans its internal procedure list. For the first routine whose `Forwarded` flag remains set, it emits `ecUnsatisfiedForward` using the routine name and the original declaration position, then stops the compilation cleanup path.

The check occurs before export verification and before unused-global hints/output generation.

## Correction procedure

1. Find the named forward declaration at the reported declaration position.
2. Confirm that an implementation body exists later in the same compiled script or included source.
3. Match the routine name, function result, parameter count, order, modes and types.
4. Correct a spelling difference in either declaration or implementation.
5. Remove the forward declaration only when no earlier call or mutual recursion requires it and no implementation is intended.
6. Recompile to reveal any additional unresolved forward; only the first one is reported in a compile pass.

## Edge cases and quirks

- A same-named implementation with an incompatible signature can produce `Forward Parameter Mismatch` instead of satisfying the declaration.
- Parameter names do not determine signature identity, but parameter modes and type identity do.
- The message includes the routine name without quotes in the current PascalScript formatter.
- Only internal script routines participate in this final `Forwarded` scan. Host-registered external routines follow their registration/binding path.
- The error position is reset to the original forward declaration, even though the failure is only known at the end of parsing.
- The scan stops at the first unresolved routine, so correcting one can reveal another.
- This is a compile-time error; callers do not execute with a missing target.

## Related reference

- `Forward Parameter Mismatch` - an implementation was found but its signature differs.
- `Procedure header for 'XXX' does not match.` - a Velox reserved event has the wrong host-required signature.
- `Function never used` - a defined but currently un-emitted unused-routine hint.

## External references

- [Free Pascal: Forward declared functions](https://www.freepascal.org/docs-html/ref/refse97.html)
- [Embarcadero DocWiki: E2065 Unsatisfied forward or external declaration](https://docwiki.embarcadero.com/RADStudio/Sydney/en/E2065_Unsatisfied_forward_or_external_declaration_%27%25s%27_%28Delphi%29)

The Embarcadero diagnostic also covers unit/interface, method and external declarations. Velox's documented path here is the embedded compiler's unresolved internal script-routine scan.
