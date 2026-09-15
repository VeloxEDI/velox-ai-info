---
title: "Invalid jump"
description: "Why a goto cannot cross the loop, case, with or exception-block boundary checked by Velox."
sidebar_position: 21
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - goto
  - labels
---

Velox reports `Invalid jump` when a `goto` crosses into or out of a protected structured-statement region. The label can be declared and defined in the same procedure and still be an invalid target because entering or leaving that region would bypass compiler-managed control or cleanup state.

## Example

This jump enters a `while` body from outside the loop:

```Delphi
procedure ScriptEvent(var Value: Variant);
label
  InsideLoop;
begin
  goto InsideLoop; // Error: Invalid jump

  while Value <> '' do
  begin
  InsideLoop:
    Value := '';
  end;
end;
```

Keep control flow inside the structured statement, or replace the jump with a condition:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  while Value <> '' do
    Value := '';
end;
```

## How Velox detects it

The modified PascalScript compiler records the bytecode range occupied by each supported structured region. After compiling the region, it compares every recorded label and `goto` in the current procedure:

- a jump originating inside the range must target a label inside the same range; and
- a jump originating outside the range must not target a label inside the range.

The check is applied to `for`, `while` and `repeat` bodies, `case` statements, `with` statements, and the bodies of `try`, `except` and `finally`. It is stricter than merely requiring the label and jump to be in the same procedure.

## Correction procedure

1. Locate both the `goto` and its target label.
2. Identify every loop, `case`, `with` or exception block that contains one but not the other.
3. Move both points into the same region, or replace the jump with `break`, `continue`, `exit`, a Boolean flag or a helper procedure as appropriate.
4. Recompile after correcting the earliest invalid boundary.

## Edge cases and quirks

- A jump across a nested boundary is invalid even when the source indentation makes the target appear nearby.
- The check works on compiled bytecode ranges, so the reported row can be at the end of the structured statement rather than at the original `goto`.
- `if` bodies do not have their own explicit `HasInvalidJumps` range in the current compiler. Do not rely on that implementation detail to design control flow; another enclosing region can still reject the jump.
- Velox recognises `goto` without Free Pascal's separate `{$GOTO ON}` switch. The Free Pascal page is compatibility guidance, not the Velox enablement rule.

## Related reference

- `Label '%s' not set` - a declared label that has no definition.
- `Not in a loop` - using `break` or `continue` without an active loop.
- `try..finally` - cleanup semantics that a jump must not bypass.

## External references

- [Free Pascal: Goto statements](https://www.freepascal.org/docs-html/ref/refsu54.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
