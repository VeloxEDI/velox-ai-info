---
title: "CoalesceEmpty"
description: "Returns the first value as text unless Velox considers it null, empty or blank; otherwise converts the fallback to text."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - coalesce
  - 'null'
  - empty
  - blank
  - variant
  - fallback
---

```Delphi
Function CoalesceEmpty(const v1, v2: variant): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  OptionalLabel: variant;
begin
  OptionalLabel := '   ';
  Value := CoalesceEmpty(OptionalLabel, 'Not supplied');
  // Not supplied
end;
```

### Usage

`CoalesceEmpty` returns the first value as text unless Velox considers it null, empty or blank; otherwise converts the fallback to text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `v1` | `variant`, `const` | Preferred value tested by Velox `IsNullorEmpty`. |
| `v2` | `variant`, `const` | Fallback converted to text when the predicate is true. Null normally becomes empty text. |

Both expressions are evaluated before the call. `v2` is not lazy and cannot be used to defer a costly, failing or state-changing fallback expression.

**Returns**

The selected value converted to `string`, or `''` for a selected Null fallback under the installed default Variant rules.

**Errors**

Predicate conversion, fallback comparison and final implicit string-conversion errors propagate. There is no catch, default-on-error behavior or conversion-success result.

**Usage notes**

Use this function when whitespace-only text should count as absent but numeric zero must remain meaningful. If callers need to preserve the selected Variant type, perform an explicit predicate and assignment rather than using this string-returning helper.

### Additional Technical Info
`CoalesceEmpty` converts `v1` to text unless `IsNullorEmpty(v1)` is true. A Null, unassigned/Empty, clear interface value or whitespace-only string selects `v2`; numeric zero explicitly does not. A selected Null fallback becomes `''` under Delphi's default null-equality rule.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The runtime pointer targets `vxCommonString.CoalesceEmpty`:

1. Call Velox `IsNullorEmpty(v1)`.
2. When false, assign `v1` to the string result.
3. When true, compare `v2 = Null`; return `''` if true, otherwise assign `v2` to the string result.

The first test is a type-aware predicate. The fallback Null test is a Variant equality comparison and therefore retains the global-rule dependency described below.

**What `IsNullorEmpty` means here**

| First-value category | Empty? | Detail |
|---|---:|---|
| Null Variant | Yes | Tested with `VarIsNull`. |
| Unassigned/Empty Variant | Yes | Tested with `VarIsEmpty`/`VarIsClear`. |
| Nil dispatch or unknown interface Variant | Yes | `VarIsClear` treats these as clear. |
| String `''` or only trim characters | Yes | `Trim(v1) = ''`; surrounding whitespace on a nonblank string is not removed from the returned value. |
| Numeric value, including `0` | No | The implementation explicitly exits false for every `VarIsNumeric` value. |
| Other Variant kind | Depends | It calls `Trim(VarToStr(v1))`; an empty conversion selects the fallback and a failed conversion raises. |

This is broader than [`IfEmpty`](IfEmpty.md), which compares the exact untrimmed `VarToStr` result with `''`. It is also broader than [`Coalesce`](Coalesce.md), which selects only for Null.

**Fallback and conversion quirks**

- The selected result is always text, even when `v1` or `v2` was numeric, Boolean or a date.
- Numeric zero is preserved and converted; it is never a missing-value signal.
- A nonblank string is returned with its original whitespace, because trimming is used only for the predicate.
- Arrays, objects and custom Variants can fail during the predicate's `VarToStr` or the final string cast.
- Date, numeric and Boolean text can depend on installed Delphi conversion rules and host locale.
- A Null `v2` is recognized by `v2 = Null` only while `NullEqualityRule` is `ncrLoose` (the installed default). `ncrStrict` can lead to a Null-to-string cast error; `ncrError` raises during comparison.

**Side effects**

The function itself reads no Velox configuration and mutates no argument. Both argument expressions are evaluated eagerly, and Variant/interface conversion code may execute outside this function.

**Performance and concurrency**

Simple type checks for common inputs. Strings are trimmed for the test, and remaining Variant kinds may be converted twice (once to test and once to return), with corresponding allocation and locale costs. The fallback equality and conversions share process-global Delphi Variant settings.

**Related entries**

- [`Coalesce`](Coalesce.md) tests only Variant Null.
- [`CoalesceString`](CoalesceString.md) tests exact empty text only.
- [`IfEmpty`](IfEmpty.md) tests exact `VarToStr` output and returns a Variant.
- [`IfNull`](IfNull.md) preserves the selected Variant type and does not treat Empty/blank as Null.

**External references**

- [Embarcadero `System.Variants.VarIsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsNull)
- [Embarcadero `System.Variants.VarToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarToStr) - documents the conversion used for non-string, nonnumeric values.
- [Embarcadero `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.NullEqualityRule) - applies to the fallback Null comparison.
- [Free Pascal `VarToStr`](https://www.freepascal.org/docs-html/rtl/variants/vartostr.html) - portability reference; Velox uses installed Delphi behavior.

<small>Created 2026-07-15</small>
