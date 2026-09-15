---
title: ScriptEvent
description: The general Velox script procedure signature, mutable Value parameter and execution contract.
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - events
  - scriptevent
  - variant
---

`ScriptEvent` is the standard entry procedure for a general Velox formula or host script. Velox compiles the procedure, verifies its exact `var Variant` parameter and retrieves it as the callable delegate for the owning script item.

## Syntax

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { Read and, when the host contract permits, replace Value. }
end;
```

The name is case-insensitive to the Pascal compiler, but the procedure must otherwise match this contract: one parameter, passed with `var`, whose registered type is `Variant`.

## Value contract

`Value` is passed by reference. A change made by the script is visible to the host after the procedure returns. Its initial meaning is defined by the owning formula, route, transport or other script item—not by `ScriptEvent` itself. It may contain text, a number, a Boolean, a date, `Null` or an unassigned Variant.

Do not assume that an empty string, numeric zero, Boolean `False`, `Null` and an unassigned Variant mean the same thing. Use the exact host page and the Variant test functions before conversion.

## How it works

The general compile path copies the script into the configured PascalScript engine. Velox registers the current source/destination context, compiles includes and imports, then verifies `ScriptEvent` using an in/out Variant parameter check. If compilation succeeds, Velox retrieves the `SCRIPTEVENT` method and invokes it through the owning script item. After retrieval, the scripter's compiled flag is reset so it can later compile another script in that reusable instance.

The surrounding host controls initial `Value`, invocation timing, error handling and what it does with the returned value. This page therefore defines the shared procedure contract; a host-specific page remains authoritative for business meaning.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if VarIsNull(Value) or VarIsEmpty(Value) or VarIsClear(Value) then
    Value := ''
  else
    Value := Trim(VarToStr(Value));
end;
```

This source-reviewed example normalises an uncertain input to trimmed text without attempting to convert `Null` or unassigned data first.

## Common mistakes

- Omitting `var` changes the parameter mode and fails Velox's procedure-header verification.
- Declaring `Value` as `String` or another narrower type fails verification even if the host normally supplies that type.
- Converting a `Null` or unassigned Variant before testing it can raise a Variant conversion or null-operation error.
- Assuming `Value := False` always means failure is unsafe; the owning host defines the returned value's effect.

## Edge cases and quirks

- PascalScript reports a custom “Procedure header for 'ScriptEvent' does not match.” error when the recognised name has the wrong signature.
- `var` passes the caller's storage, so an early `Exit` preserves changes already made by the script.
- An unhandled exception prevents normal return to the host. Velox's surrounding script item decides whether to log, fail or continue.
- The Delphi and Free Pascal pages below explain `var` semantics, but Velox's signature verifier is the authority for this event.

## Related reference

- **Testing values** — safe Variant state checks.
- **Functions** — parameter modes in registered declarations.
- **Compilation errors** — procedure header and type mismatch messages.

## External references

- [Free Pascal: Variable parameters](https://www.freepascal.org/docs-html/ref/refsu65.html)
- [Embarcadero DocWiki: Parameters (Delphi)](https://docwiki.embarcadero.com/RADStudio/Athens/en/Parameters_%28Delphi%29)
