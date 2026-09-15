---
title: "CoalesceInteger"
description: "Converts the first non-Null Variant to a 32-bit Integer, or the fallback when the first is Null, with Null fallback becoming zero."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - coalesce
  - 'null'
  - variant
  - integer
  - rounding
  - conversion
---

```Delphi
Function CoalesceInteger(const v1, v2: variant): integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  OptionalCount: variant;
begin
  OptionalCount := Null;
  Value := CoalesceInteger(OptionalCount, 12);
  // 12
end;
```

### Usage

`CoalesceInteger` converts the first non-Null Variant to a 32-bit Integer, or the fallback when the first is Null, with Null fallback becoming zero.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `v1` | `variant`, `const` | Preferred value. Null selects `v2`; every other Variant is sent to Integer conversion. |
| `v2` | `variant`, `const` | Fallback used only after a Null first value. Null maps to `0`. |

Both expressions are evaluated before the function call. Selection does not prevent fallback-expression errors or side effects.

**Returns**

A signed 32-bit value in the range `-2147483648..2147483647`, after Velox Variant conversion, or `0` when both values compare as Null.

**Important distinctions**

- `0` never selects `v2`.
- Empty Variant is not Null; it converts to zero and hides `v2`.
- A floating value is rounded, so `1.6` ordinarily becomes `2`; default midpoint ties use banker's rounding (`2.5 -> 2`, `3.5 -> 4`). This helper is not a truncation function.
- A direct Boolean Variant uses Automation `WordBool` numeric semantics (`True = -1`). Explicitly map Boolean business flags when `1` is required.
- Values outside the signed 32-bit range fail rather than clamp or wrap under the installed checked conversion path.
- The result loses the source Variant type and any distinction between defaulted zero and intentional zero.

**Global Variant-rule dependency**

The normal shared `NullEqualityRule = ncrLoose` setting recognises `Null` and selects the fallback. With `ncrStrict`, a Null preferred value is not selected and normally fails conversion to `Integer`; `ncrError` raises during the comparison. This setting applies to all scripts in the Velox process.

### Additional Technical Info
`CoalesceInteger` selects `v2` only when `v1` compares equal to Variant Null, then converts the selected Variant to a signed 32-bit Delphi `Integer`. If both values compare as Null, it returns `0`. Numeric zero is a valid preferred value, not a missing-value marker.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The runtime pointer targets `vxCommonString.CoalesceInteger`:

1. Compare `v1 = Null` using Delphi Variant equality.
2. If true, compare `v2 = Null`; return `0` if true, otherwise assign `v2` to the Integer result.
3. If false, assign `v1` to the Integer result.

The assignment uses installed Delphi `_VarToInteger`. Floating, Currency and date values pass through Delphi `Round`; ordinal values are range-checked; strings use the Variant runtime's string-to-integer path. Velox adds no validation or catch.

**Input and conversion behavior**

| Selected Variant | Integer behavior |
|---|---|
| Null fallback | `0`, handled before conversion. |
| Empty/unassigned first value | Does not select `v2`; converts to `0`. |
| In-range ordinal | Preserved numerically. |
| Floating, Currency or date value | Rounded using Delphi `Round`, not truncated. Default nearest-mode midpoint ties go to the even integer; native code can alter the process/thread rounding environment. |
| Boolean | Installed `_VarToInteger` converts the Variant `WordBool`: `False` becomes `0` and `True` becomes `-1`, not `1`. |
| Integer text | Installed source tries Windows `VarI4FromStr` with the user-default locale, then Delphi integer/Boolean parsing after a type mismatch. Accepted presentations are host/runtime dependent. |
| Decimal text such as `'12.5'` | Not a documented integer format; it can fail rather than following floating rounding. |
| Out-of-range, unsupported or malformed value | Variant conversion/range exception. |

**Side effects**

No direct Velox state change. Both argument expressions are eager, and automation/custom Variant conversion may invoke external code.

**Errors**

Comparison, parsing, rounding overflow, range and unsupported-type errors propagate. There is no saturation, default-on-error result or Boolean success indicator.

**Performance and concurrency**

Constant-time selection and a scalar conversion. Text/automation conversions can allocate or consult host settings. Process-global Variant settings and rounding environment are shared runtime state.

**Remarks**

Validate ranges before calling when input may exceed 32 bits. Use an explicit decimal parser and rounding rule when financial or regulatory rounding must be stable and auditable.

**Related entries**

- [`CoalesceFloat`](CoalesceFloat.md) returns Double without integer rounding.
- [`Coalesce`](Coalesce.md) returns text.
- [`IfNull`](IfNull.md) preserves the selected Variant and defers conversion.

**External references**

- [Embarcadero `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.NullEqualityRule)
- [Embarcadero `System.Variants.VarIsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsNull)
- [Embarcadero `System.Round`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Round) - documents nearest/even default rounding and runtime rounding-mode influence.
- [Free Pascal `VarIsNull`](https://www.freepascal.org/docs-html/rtl/variants/varisnull.html) - portability reference; Velox's integer conversion is the installed Delphi implementation.
- [Free Pascal `Round`](https://www.freepascal.org/docs-html/rtl/system/round.html) - compatible banker's-rounding context; installed Delphi remains authoritative.

<small>Created 2026-07-15</small>
