---
title: "CoalesceFloat"
description: "Converts the first non-Null Variant to Double, or the fallback when the first is Null, with Null fallback becoming zero."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - coalesce
  - 'null'
  - variant
  - double
  - numeric
  - conversion
---

```Delphi
Function CoalesceFloat(const v1, v2: variant): double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  OptionalRate: variant;
begin
  OptionalRate := Null;
  Value := CoalesceFloat(OptionalRate, 1.25);
  // 1.25
end;
```

### Usage

`CoalesceFloat` converts the first non-Null Variant to Double, or the fallback when the first is Null, with Null fallback becoming zero.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `v1` | `variant`, `const` | Preferred value. Null selects `v2`; every other Variant is sent to Double conversion. |
| `v2` | `variant`, `const` | Fallback value used only after a Null first value. Null maps to numeric zero. |

Both arguments are evaluated before selection. Do not put a state-changing or potentially failing expression in `v2` expecting it to run conditionally.

**Returns**

A 64-bit IEEE-754 `Double` converted from the selected Variant, or `0.0` when both values compare as Null.

**Errors**

Invalid/null comparison rules, invalid numeric text, unsupported Variant kinds and conversion failures propagate as Velox Variant exceptions. There is no try/default behavior.

**Usage notes**

Use an explicit parse/validation path when input text has a governed decimal convention. Use a separate missing-value flag when zero and absence must remain distinguishable.

### Additional Technical Info
`CoalesceFloat` selects `v2` only when `v1` compares equal to Variant Null, then converts the selected value to Delphi `Double`. If both compare as Null, it returns `0`. It deliberately does not treat numeric zero as absent.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The import points directly to `vxCommonString.CoalesceFloat`:

1. Compare `v1 = Null` with Delphi Variant equality.
2. If true, compare `v2 = Null`; assign integer literal `0` to the Double result when true, otherwise assign `v2`.
3. If false, assign `v1` to the Double result.

The assignments invoke installed Delphi's Variant-to-Double conversion. No explicit parse format, bounds check, NaN policy or exception handling is added by Velox.

**Input behavior under installed defaults**

| Selected Variant | Double behavior |
|---|---|
| Null fallback | `0.0`, because the function handles it before conversion. |
| Empty/unassigned first value | Does not select `v2`; Delphi converts Empty to `0.0`. |
| Integer, floating or Currency | Numeric conversion to Double; large 64-bit integers may lose exact integer precision. |
| Boolean | Installed `_VarToDouble` converts the Variant `WordBool`: `False` becomes `0.0` and `True` becomes `-1.0`, not `1.0`. |
| Date Variant | Its `TDateTime` day/fraction number becomes a Double. |
| Numeric text | Installed source first tries Delphi floating parsing and then Windows `VarR8FromStr` with the user-default locale; accepted punctuation can therefore be host-dependent. |
| Empty/invalid text, array or unsupported value | Conversion error; `v2` is not used unless `v1` was Null. |

**Null and zero distinctions**

- `0`, `0.0` and text that converts to zero are valid preferred values.
- Empty Variant is not Null. It converts to zero and therefore also hides `v2`.
- The function cannot distinguish a Null/Null default result from an intentionally selected numeric zero after return.
- A direct Boolean Variant uses Automation `WordBool` numeric semantics (`True = -1`); explicitly map business Booleans when `1` is required.
- Selection uses `v1 = Null`, so the installed default `NullEqualityRule = ncrLoose` is required for the documented Null branch. `ncrStrict` can make Null fall into strict conversion and raise; `ncrError` raises during comparison.

**Precision and exceptional values**

`Double` carries about 15-17 significant decimal digits. Converting a sufficiently large `Int64`/`UInt64` can round it. Floating NaN and infinity values, when present in a compatible Variant, are not rejected or normalized by Velox. Validate them explicitly before database, comparison or serialization use.

**Side effects**

The function itself only compares and converts. Both argument expressions are evaluated eagerly, and object/custom Variant conversion can invoke external code.

**Performance and concurrency**

Constant-time selection plus Variant conversion. Text and automation conversions may allocate or consult host locale. Process-global Variant comparison/conversion settings are shared between calls.

**Related entries**

- [`CoalesceInteger`](CoalesceInteger.md) returns a 32-bit rounded Integer.
- [`Coalesce`](Coalesce.md) returns selected text.
- [`IfNull`](IfNull.md) preserves the selected Variant without forcing a numeric conversion.

**External references**

- [Embarcadero `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.NullEqualityRule)
- [Embarcadero `System.Variants.VarIsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsNull) - documents the explicit type test not used by this implementation.
- [Free Pascal `VarIsNull`](https://www.freepascal.org/docs-html/rtl/variants/varisnull.html) - portability reference; conversion details remain Delphi-specific here.

<small>Created 2026-07-15</small>
