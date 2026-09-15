---
title: "Boolean"
description: "Logical and bitwise and, or and xor operations in Velox expressions."
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - operators
  - boolean
---

`and`, `or` and `xor` combine Boolean operands logically or integer operands bit by bit. Operand types determine which operation is performed.

## Syntax

```Delphi
BooleanResult := BooleanA and BooleanB;
BooleanResult := BooleanA or BooleanB;
BooleanResult := BooleanA xor BooleanB;

IntegerResult := IntegerA and IntegerB;
IntegerResult := IntegerA or IntegerB;
IntegerResult := IntegerA xor IntegerB;
```

Unary `not` is covered under `Unary`. Integer shifts are covered under `Arithmetic (Math)`.

## How it works

The expression parser places `and` in the multiplying-precedence group and `or`/`xor` in the next, adding-precedence group. Therefore `A or B and C` means `A or (B and C)`. Parenthesise mixed operators when the business rule should be unmistakable.

`GetResultType` accepts:

- matching Boolean types, producing that Boolean type;
- integer operands, producing the left operand's integer type;
- a Variant/notification Variant with another Variant or integer-compatible operand, deferring more checking to runtime.

Velox sets `icBooleanShortCircuit`. `DoBinCalc` emits a conditional skip for Boolean `and` and `or`: the right operand is not evaluated when the left value already determines the result. `xor` always needs both operands. Integer bitwise operations always evaluate both sides.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Count: Integer;
  IsAccepted: Boolean;
begin
  Count := 4;
  IsAccepted := (Count > 0) and (Count <= 10);
  Value := IsAccepted;
end;
```

Both comparisons are Boolean. If the first were false, the second would be skipped by short-circuit evaluation.

## Boolean operations

- `A and B` is true only when both are true.
- `A or B` is true when either or both are true.
- `A xor B` is true when exactly one is true.
- Short-circuiting is left-to-right for Boolean `and` and `or` only.

Use a safe left-side guard before a right-side operation that is valid only in some states. Do not use the right operand for a required side effect because it may be skipped.

## Integer bitwise operations

For integer operands, the runtime applies the operation independently to each bit. Result width/type follows the left operand selected by the compiler. Mixed signed/unsigned or differently sized operands can therefore convert or truncate the right value into the left-side representation.

Bit masks should use constants and variables of a deliberate compatible integer type. The operators do not mean Boolean truth testing merely because zero is often used as false in other environments.

## Common mistakes

- Confusing logical and bitwise behaviour. Use declared Boolean operands for conditions and integer operands for masks.
- Expecting `xor` to short-circuit. Both operands must be evaluated.
- Depending on evaluation of a right-side function under Boolean `and`/`or`.
- Omitting parentheses in a mixture of relational, `and`, `or` and `xor` operators.
- Assuming a Variant containing Boolean receives compile-time Boolean treatment. A Variant result is not the compiler's exact Boolean type, so the normal Boolean short-circuit emission is not guaranteed.

## Edge cases and quirks

- Constant Boolean combinations can produce compiler warnings that an operand is not needed or that a result is constant.
- The host fixes short-circuit mode when it creates the script compiler. Script-level Delphi directives should not be used to assume a different mode.
- Integer `and` shares precedence with multiplication/division; `or` and `xor` share precedence with addition/subtraction.
- Variant operations use runtime Variant conversion/operation rules and may evaluate both operands or raise a type/Null error. Convert to an explicit Boolean before relying on a guard.
- Boolean aliases `LongBool`, `WordBool` and `ByteBool` are recognised by the compiler's `IsBoolean` check in addition to its default Boolean type.

## Errors, performance and concurrency

Unsupported operand combinations produce a compile-time type mismatch where statically known; Variant incompatibilities can fail at runtime. Logical/bitwise operations are constant-time, but evaluated operand functions can be expensive or stateful. The operators add no concurrency protection.

## Related reference

- `Unary` — Boolean and bitwise `not`.
- `Relational (Comparison)` — creates Boolean values from comparisons.
- `if`, `while loop` and `repeat loop` — consume Boolean conditions.

## External references

- [Free Pascal: Boolean operators](https://www.freepascal.org/docs-html/current/ref/refsu46.html)
- [Free Pascal: Logical operators](https://www.freepascal.org/docs-html/current/ref/refsu45.html)
- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Expressions_%28Delphi%29)
