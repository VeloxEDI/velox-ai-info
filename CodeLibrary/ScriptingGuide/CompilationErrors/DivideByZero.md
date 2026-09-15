---
title: "Divide by Zero"
description: "Why constant folding detected a zero divisor before the Velox script could compile."
sidebar_position: 12
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - division
  - constant-folding
---

On this compilation-diagnostics page, `Divide by Zero` means the compiler evaluated a constant arithmetic expression and found a zero divisor before the script could run. A divisor that depends on runtime data follows the runtime exception path instead.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := 100 div (3 - 3); // Compile-time Divide by Zero
end;
```

Correct the constant or remove the invalid calculation:

```Delphi
Value := 100 div 5;
```

For a dynamic divisor, validate the value at runtime:

```Delphi
if Divisor = 0 then
  RaiseException(erCustomError, 'Divisor must not be zero');

Value := Numerator div Divisor;
```

## How Velox detects it

The modified PascalScript compiler pre-calculates eligible constant expressions. Its `PreCalc` path catches Delphi `EDivByZero` and `EZeroDivide` exceptions and emits `ecDivideByZero`. Velox then displays the compiler message as an Error and compilation fails.

This does not prove that every possible divisor has been checked. If a value comes from a variable, function, property, dataset or Variant, its zero value is normally known only while the script runs and can raise a runtime arithmetic exception.

## Integer and real division quirk

The Velox compiler supports explicit integer `div`. It also compiles `/` as integer division when both operands are integer types; a real operand is required for real division. Therefore `5 / 2` can produce integer `2`, while `5.0 / 2` produces a real result. This differs from assumptions carried over from some Pascal/Delphi environments and should be considered when correcting the expression.

Both integer and real constant calculations can reach the compile-time zero-divisor handling.

## Correction procedure

1. Inspect the full divisor expression, including constants hidden in parentheses.
2. Correct constant arithmetic rather than merely changing the operator.
3. For data-dependent values, test the divisor immediately before division.
4. Decide whether integer truncation or real division is intended and make operand types explicit.
5. Define an appropriate business outcome for zero; do not silently substitute `1` unless that is the genuine rule.

## Common causes

- A constant expression that simplifies to zero.
- A configuration constant set to zero.
- Assuming a runtime guard can protect a calculation the compiler has already folded elsewhere.
- Expecting `/` with two integer operands to force a real result.
- Validating a text/Variant value without converting it consistently with the later division.

## Related reference

- `Arithmetic (Math)` — operator types, integer division and constant folding.
- `try..except` — handling runtime exceptions, not compile-time diagnostics.
- `Calculation always evaluates to` — another result discovered during compilation.

## External references

- [Free Pascal: Arithmetic operators](https://www.freepascal.org/docs-html/current/ref/refsu44.html)
- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Expressions_%28Delphi%29)
