---
title: "Arithmetic (Math)"
description: "Numeric arithmetic, integer division, remainder and shift operations in Velox scripts."
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - operators
  - arithmetic
---

Arithmetic operators calculate numeric results. The same tokens also provide set union/difference/intersection or integer shifts for compatible operands.

## Syntax

```Delphi
Left + Right
Left - Right
Left * Right
Left / Right
Left div Right
Left mod Right
Left shl BitCount
Left shr BitCount
```

Multiplication, division, remainder and shifts bind more tightly than addition/subtraction. Operators at the same level associate through the compiler's expression tree; use parentheses whenever rounding or conversion order matters.

## Numeric behaviour

`TPSPascalCompiler.GetResultType` and the PascalScript calculation opcodes determine the result:

- `+`, `-` and `*` accept compatible integers and real types. With two integer operands the compiler selects the left operand's integer type. With a real operand it selects a real operand type.
- `/` and `div` share a significant Velox/PascalScript rule described below. `mod` is integer-only.
- `shl` and `shr` accept integer operands and return the left operand's integer type.
- Variant operands defer arithmetic and conversion to the runtime Variant path.
- Compatible sets overload `+` as union, `-` as difference and `*` as intersection.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Quantity: Integer;
  UnitPrice: Double;
  Discount: Double;
begin
  Quantity := 3;
  UnitPrice := 12.50;
  Discount := 2.00;
  Value := (Quantity * UnitPrice) - Discount;
end;
```

Because `UnitPrice` is real, multiplication and the final result follow a real-number path. The calculated value is `35.5` before assignment to the Variant.

## Division

The current Velox source does not define PascalScript's `PS_DELPHIDIV` conditional. Consequently:

- `/` with two integer operands uses the runtime's integer division path and produces an integer-typed result selected from the left operand.
- `/` with at least one real operand performs real division.
- `div` is the explicit integer-division operator and requires integer-compatible operands in normal statically typed code.
- `mod` returns the integer remainder.

This differs from Delphi and Free Pascal, where `/` is defined as real division even for integer inputs. Write a real operand or explicit conversion when a fractional result is required; for example, use `7.0 / 2.0`, not `7 / 2`.

## Common mistakes

- Assuming `7 / 2` produces `3.5` in Velox. With two integer operands it follows integer division and produces `3`.
- Ignoring the left operand's type in mixed-size integer arithmetic. A smaller or unsigned left type can narrow/wrap the result.
- Dividing by zero or calculating `mod 0`.
- Depending on implicit Variant conversions for business-critical precision. Convert and validate explicitly.
- Omitting parentheses in currency, percentage or rounding logic.

## Edge cases and quirks

- The two-integer result type is the left operand's registered integer type, not automatically the widest type. Reversing operands can therefore change type/range behaviour even for a commutative mathematical operation.
- The runtime has no extra checked-arithmetic layer in these operator paths. Fixed-width overflow can wrap or otherwise follow the underlying runtime representation; validate ranges rather than relying on overflow detection.
- A constant zero divisor can be discovered during compiler constant folding; a dynamic zero reaches a runtime divide-by-zero error.
- `Currency`, `Single`, `Double` and `Extended` retain their own precision/rounding characteristics. Do not compare calculated real values for exact equality unless the domain and representation make that safe.
- Shift results retain the left operand's width/sign representation. Validate the shift count and use an explicitly sized mask/value; no portable business rule should depend on an out-of-range shift.
- Set `+`, `-` and `*` require compatible set types and mean union, difference and intersection rather than numeric arithmetic.
- Exponentiation (`**`) is not in the current expression parser's supported operator token list.

## Errors and side effects

Statically incompatible operands cause a compile-time type mismatch. Divide-by-zero, Variant conversion and unsupported runtime types raise a script-runtime error. Operators do not mutate scalar operands, but function/property operands are evaluated and keep their side effects.

## Performance and concurrency

Primitive arithmetic is constant-time. Variant conversions, large managed values or operand functions can dominate cost. Operators provide no numeric atomicity or synchronisation when operands come from shared objects.

## Related reference

- `Assignment` — stores the calculated result.
- `Unary` — unary sign and negation.
- `Boolean` — integer bit masks with `and`, `or` and `xor`.
- `Relational (Comparison)` — compares numeric results.

## External references

- [Free Pascal: Arithmetic operators](https://www.freepascal.org/docs-html/current/ref/refsu44.html)
- [Free Pascal: Logical operators](https://www.freepascal.org/docs-html/current/ref/refsu45.html)
- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Expressions_%28Delphi%29)
