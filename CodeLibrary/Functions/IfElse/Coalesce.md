---
title: "Coalesce"
description: "Returns the first Variant unless it is Null, otherwise converts the fallback to text, with Null fallback becoming empty text."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - coalesce
  - 'null'
  - variant
  - string
  - fallback
---

```Delphi
Function Coalesce(const v1, v2: variant): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  PreferredCode: variant;
begin
  PreferredCode := Null;
  Value := Coalesce(PreferredCode, 'UNSPECIFIED');
  // UNSPECIFIED
end;
```

### Usage

`Coalesce` returns the first Variant unless it is Null, otherwise converts the fallback to text, with Null fallback becoming empty text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `v1` | `variant`, `const` | Preferred value. Only a successful equality comparison with `Null` selects `v2`. |
| `v2` | `variant`, `const` | Fallback value. A Null fallback becomes `''` under Velox's default null-comparison rule. Other values are converted to text. |

Both arguments are evaluated before `Coalesce` starts. The function is a selector, not lazy control flow: an exception or side effect while computing `v2` occurs even when `v1` is returned.

**Returns**

A `string` produced from the selected Variant. The result does not preserve the selected Variant's original type.

**Global Variant-rule dependency**

If Velox code changes it:

- `ncrStrict` makes every equality involving Null false. A Null `v1` then reaches implicit Null-to-string conversion, which normally raises because installed `NullStrictConvert` is `True`.
- `ncrError` makes the first equality involving Null raise `EVariantInvalidNullOpError`.

`NullEqualityRule` is shared by all scripts in the Velox process. The normal `ncrLoose` setting selects the fallback for `Null`; `ncrStrict` can instead cause a Null-to-string conversion error, and `ncrError` raises during the comparison. [`IfNull`](IfNull.md) uses the same rule but preserves the selected Variant type.

**Usage notes**

Use [`CoalesceEmpty`](CoalesceEmpty.md) when Null, Empty and blank text should all select a fallback. Use [`IfNull`](IfNull.md) when the selected Variant type must be preserved. Validate or explicitly format typed values when stable machine-readable text is required.

### Additional Technical Info
`Coalesce` selects `v2` only when `v1` compares equal to the Variant value `Null`, then converts the selected value to `string`. It is not a general "first present value" function: an Empty Variant, an empty string, whitespace and numeric zero do not select the fallback.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The PascalScript import points directly to `vxCommonString.Coalesce`:

1. Evaluate `v1 = Null` using Delphi Variant equality.
2. If true, evaluate `v2 = Null`; return `''` when that is true, otherwise assign `v2` to the string result.
3. If the first comparison is false, assign `v1` to the string result.

No trimming, `VarIsNull`, `VarIsEmpty`, validation or exception handling is added.

**Selection matrix under the installed defaults**

| `v1` | Selected value/result |
|---|---|
| `Null` | `v2`; if `v2` is also Null, `''`. |
| Unassigned/Empty Variant | `v1`, whose implicit string conversion produces `''`; `v2` is not selected. |
| `''` | The empty first string; `v2` is not selected. |
| Whitespace-only string | The original whitespace; it is not trimmed. |
| `0` or `False` | The first value converted to text. |
| Other convertible value | The first value converted to text. |

**Conversion behavior**

String conversion follows the installed Delphi Variant runtime. Numbers, dates and Boolean values can produce locale- or RTL-dependent text. Variant arrays, interfaces, custom values or values without a valid string cast can raise instead of returning a fallback. `Coalesce` does not call `VarToStr`, so its guarded Null case matters: an unguarded Null-to-string cast is not equivalent to `VarToStr(Null)`.

**Side effects**

The function itself only compares and converts values. Side effects may occur while either argument expression is evaluated, including the fallback expression that is not selected.

**Errors**

Variant comparison and implicit string-conversion errors propagate. Velox does not catch them. In particular, the name does not promise that every Variant can safely become text.

**Performance and concurrency**

Constant-time selection plus the cost of converting and allocating the selected text. Calls share Delphi's process-global Variant comparison/conversion settings; concurrent native changes to those settings can alter behavior.

**Related entries**

- [`CoalesceEmpty`](CoalesceEmpty.md) applies Velox's broader null-or-empty predicate to the first value.
- [`CoalesceString`](CoalesceString.md) selects by exact empty string with no Variant conversion.
- [`IfNull`](IfNull.md) returns the selected Variant rather than text.
- [`IfEmpty`](IfEmpty.md) selects by the first value's exact `VarToStr` result.

**External references**

- [Embarcadero `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.NullEqualityRule) - documents the installed default and alternate equality rules.
- [Embarcadero `System.Variants.VarIsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsNull) - documents the type test that this implementation does not use.
- [Free Pascal `VarIsNull`](https://www.freepascal.org/docs-html/rtl/variants/varisnull.html) - portability reference; installed Delphi and Velox source remain authoritative.

<small>Created 2026-07-15</small>
