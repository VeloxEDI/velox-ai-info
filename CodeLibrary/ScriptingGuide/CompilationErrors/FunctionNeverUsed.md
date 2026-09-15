---
title: "Function never used"
description: "Meaning of the unused-function hint and when removal or intentional retention is appropriate."
sidebar_position: 18
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - hint
  - functions
---

`Function '<name>' never used` is a defined PascalScript Hint intended to identify a declared routine that is never referenced. It is listed in the Velox Code Library because the compiler exposes the message name, but the current Velox compiler source does not emit this hint.

## Current Velox behaviour

The modified PascalScript compiler defines `ehFunctionNotUsed` and knows how to format its function-name parameter. A complete source search shows no call that creates this hint. The compiler's implemented unused-declaration scan emits `Variable never used` for unused variables and for an unused function `Result`, but it does not scan for uncalled functions with `ehFunctionNotUsed`.

Consequently, standard scripts in the current product should not receive `Function never used`. Its presence in the diagnostic catalogue must not be interpreted as proof that Velox performs dead-function analysis.

## Illustrative condition

This is the kind of source the defined hint describes, but it does not currently trigger that message in standard Velox:

```Delphi
function BuildUnusedValue: string;
begin
  Result := 'unused';
end;

procedure ScriptEvent(var Value: Variant);
begin
  Value := 'Ready';
end;
```

If the helper genuinely has no caller, the normal correction is to remove it. If it is intended to be used, add the correct call rather than a dummy reference:

```Delphi
Value := BuildUnusedValue;
```

## If this message appears

1. Retain the full formatted message, including module, row and column.
2. Record the Velox version and whether the compiler or scripting host is customised.
3. Search the named routine's call sites, including included source and event entry points.
4. Remove genuinely obsolete code, or add the intended functional call.
5. If the current standard Velox build produced it, provide a minimal reproduction for product review because that differs from the traced source behaviour.

## Severity and impact

The defined message class is Hint, not Error. If a compiler variant emits it, the hint alone should not prevent compilation. Velox suppresses hints originating outside the main compiled module when it formats compile output, so included-source visibility may also vary.

## Related reference

- `Variable never used` — the unused-declaration hint actually emitted by the current compiler.
- `Unsatisfied forward` — a declared routine that lacks an implementation.
- `Includes` — declarations and calls brought into the compilation unit.

## External references

No external language reference is linked because this page documents an un-emitted, PascalScript-specific hint rather than a Delphi or Free Pascal syntax rule.
