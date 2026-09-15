---
title: "Math Error"
description: "Why Velox constant folding caught a Delphi floating-point EMathError other than its zero-divisor cases."
sidebar_position: 25
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - mathematics
  - constant-folding
---

On this page, `Math Error` means the compiler raised a Delphi `EMathError` while pre-calculating a constant expression. The compiler handles integer and floating-point zero division first as `Divide by Zero`; this message is the remaining floating-point mathematical-exception path.

## Safe correction pattern

There is no portable, deterministic failing expression to copy: the limit and exception behaviour can differ between 32-bit and 64-bit floating-point representations and control-word settings. Instead, reduce the magnitude or move a genuinely data-dependent calculation behind explicit validation.

```Delphi
procedure ScriptEvent(var Value: Variant);
const
  SafeScale = 1.0E150;
begin
  { 1.0E300 is within the finite Double range. }
  Value := SafeScale * SafeScale;
end;
```

Choose limits from the actual business domain rather than treating this sample value as a universal validation boundary.

## How Velox detects it

The modified PascalScript compiler's `PreCalc` path asks its calculation helper to evaluate eligible constant operands. Its exception order is significant:

1. Delphi `EDivByZero` and `EZeroDivide` become `Divide by Zero`.
2. Other Delphi `EMathError` descendants become `Math Error`.
3. Other unexpected exceptions become `Internal error (<message>)`.

The compiler passes the caught exception message into `ecMathError`, but the public formatter ignores that parameter and returns only `Math Error`. The displayed text therefore does not reveal whether the underlying condition was overflow, underflow or another floating-point fault.

## Correction procedure

1. Inspect constant arithmetic near the reported position, including constants hidden by aliases and parentheses.
2. Check multiplication, division and conversion ranges for the numeric type being produced.
3. Reduce or rescale the expression without changing its business meaning.
4. If values are genuinely runtime data, validate their range immediately before the operation and define a deliberate failure outcome.
5. Recompile on the same Velox architecture that reported the error.

## Edge cases and quirks

- This diagnostic concerns compile-time evaluation. Equivalent arithmetic involving a runtime variable follows the runtime exception path instead.
- `EMathError` is a Delphi exception family. Free Pascal has a similarly named compatibility class, but its floating-point modes and exception behaviour are not proof of Velox behaviour.
- Real-number range differs by platform and representation. A literal or result accepted in one build can overflow in another.
- The lost exception detail makes the smallest constant subexpression the best diagnostic target.
- Constant folding does not perform business-domain checks such as permitted currency ranges; it only encounters host arithmetic behaviour.

## Related reference

- `Divide by Zero` - the two zero-divisor exception paths handled before `EMathError`.
- `Internal error` - unexpected non-mathematical exceptions during constant folding.
- `Arithmetic (Math)` - Velox numeric operators and result-type quirks.

## External references

- [Free Pascal: EMathError](https://www.freepascal.org/docs-html/rtl/sysutils/ematherror.html)
- [Embarcadero DocWiki: System.SysUtils.EMathError](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.EMathError)
