---
title: "IfEmpty"
description: "Returns the fallback when converting the first Variant to text yields exactly empty text."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - ifempty
  - variant
  - empty
  - vartostr
  - fallback
---

```Delphi
Function IfEmpty(const aValue1, aValue2: Variant): Variant
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  OptionalValue: variant;
begin
  OptionalValue := Null;
  Value := IfEmpty(OptionalValue, 'Not supplied');
  // Not supplied with the installed default NullAsStringValue
end;
```

### Usage

`IfEmpty` returns the fallback when converting the first Variant to text yields exactly empty text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue1` | `Variant`, `const` | Preferred value converted with Velox `VarToStr` only for the empty test. |
| `aValue2` | `Variant`, `const` | Fallback Variant returned unchanged when the converted first value is exactly empty. |

Both expressions are evaluated before the function starts. The fallback expression is not lazy.

**Returns**

The selected Variant without an explicit result conversion. When `aValue1` is nonempty after `VarToStr`, its original Variant type and value are returned rather than the temporary text.

**Errors**

`VarToStr` conversion errors propagate. The function does not catch them and does not use `aValue2` as an error fallback.

**Usage notes**

Use this helper only when exact empty conversion is the business rule. For input text where whitespace should count as absent, use [`CoalesceEmpty`](CoalesceEmpty.md) or normalize explicitly. For Null-only selection without conversion, use [`IfNull`](IfNull.md).

### Additional Technical Info
`IfEmpty` returns `aValue2` when `VarToStr(aValue1) = ''` exactly; otherwise it returns the original `aValue1` Variant. Its definition of empty is therefore a conversion result, not a Variant-type predicate and not a trimmed blank test.

With installed Delphi's default `NullAsStringValue = ''`, both Null and Empty Variants test empty. Whitespace-only strings do not. The example is fictional, source-reviewed and was not executed by the documentation workflow.

**Implementation**

`uPSI_vxCommon` registers a direct pointer to `vxCommon.IfEmpty`. The native body is exactly equivalent to:

```Delphi
if VarToStr(aValue1) = '' then
  Result := aValue2
else
  Result := aValue1;
```

`VarToStr` calls `VarToStrDef` with the process-global `NullAsStringValue`. Installed Delphi initializes that string to `''`. Empty Variant converts to `''`; other types follow installed Variant-to-string rules.

**Selection behavior under installed defaults**

| `aValue1` | Converted test | Selection |
|---|---|---|
| Null Variant | `''` from `NullAsStringValue` | `aValue2` |
| Empty/unassigned Variant | `''` | `aValue2` |
| Empty string | `''` | `aValue2` |
| Whitespace-only string | Original whitespace | `aValue1` |
| Numeric zero | Numeric text, not empty | `aValue1` |
| `False` | Boolean text, not empty | `aValue1` |
| Date/number/string with nonempty conversion | Nonempty text | Original `aValue1` |
| Array/object/unsupported Variant | Conversion can raise | No result/fallback |

**Global-state and conversion quirks**

- Native code can change process-global `NullAsStringValue`. If it is nonempty, Null no longer selects `aValue2`; the original Null Variant is returned.
- The predicate is not trimmed. It differs materially from [`CoalesceEmpty`](CoalesceEmpty.md), whose string test uses `Trim` and whose type checks explicitly classify Null/Empty/clear values.
- Conversion occurs even when `aValue1` will be returned unchanged. A value that could otherwise be passed through can still fail because it cannot become text.
- Date, numeric and Boolean conversion text can depend on installed RTL/host settings, although only empty versus nonempty is used.
- The result preserves the selected Variant type, unlike the string-returning coalescers.

**Side effects**

The function changes no Velox state. Both argument expressions are eager, and automation/custom Variant conversion performed by `VarToStr` can execute external conversion code.

**Performance and concurrency**

One Variant-to-string conversion and comparison, followed by a Variant copy. Conversion may allocate. Behavior shares process-global `NullAsStringValue` and other installed Variant formatting state.

**Related entries**

- [`IfNull`](IfNull.md) tests Variant equality with Null and performs no text conversion.
- [`CoalesceEmpty`](CoalesceEmpty.md) uses a broader type-aware and trimmed predicate but returns text.
- [`IfBlank`](IfBlank.md) accepts typed strings and tests only exact empty text.
- [`Coalesce`](Coalesce.md) selects Null and converts the selected value to text.

**External references**

- [Embarcadero `System.Variants.VarToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarToStr) - documents `NullAsStringValue` use.
- [Embarcadero `System.Variants.VarIsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsNull) - contrasts a direct Null type test with this conversion-based predicate.
- [Free Pascal `VarToStr`](https://www.freepascal.org/docs-html/rtl/variants/vartostr.html) - documents a compatible default Null-to-empty result; installed Delphi remains authoritative.

<small>Created 2026-07-15</small>
