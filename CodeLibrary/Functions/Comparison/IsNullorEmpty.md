---
title: "IsNullorEmpty"
description: "Tests whether a Variant is null, empty, clear or reduces to empty trimmed text under Velox's rules."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - variant
  - "null"
  - empty
---

```Delphi
Function IsNullorEmpty( const aValue : variant) : boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsNullorEmpty(Null);
end;
```

### Usage

`IsNullorEmpty` tests whether a Variant is null, empty, clear or reduces to empty trimmed text under Velox's rules.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Variant`, `const` | Value to classify. Conversion is attempted only after the explicit state, string and numeric branches. |

**Returns**

| Input category | Result |
|---|---|
| `VarIsNull`, `VarIsEmpty` or `VarIsClear` | `True` |
| String Variant | Whether `Trim(aValue) = ''` |
| Numeric Variant, including numeric zero | `False` |
| Other Variant type | Whether `Trim(VarToStr(aValue)) = ''`, if conversion succeeds |

**Behaviour**

`Null`, unassigned/Empty and clear values are deterministically empty under their Velox Variant predicates. Empty and whitespace-only string Variants are empty after Velox `Trim`. Numeric values are always considered nonempty, regardless of magnitude.

Other types are converted with Velox `VarToStr`, trimmed and compared with the empty string. This fallback makes the result dependent on whether and how that Variant type supports string conversion.

**Errors**

The explicit state and numeric checks avoid conversion errors for those categories. Other values can raise a Variant conversion or property-access error, and the function does not catch it.

### Additional Technical Info
`IsNullorEmpty` classifies a `Variant` through explicit Null/Empty/clear checks, a trimmed-string branch, a numeric branch and finally a string-conversion fallback. It is Velox's documented absence predicate; numeric zero is deliberately considered present.

The example returns `True` through the explicit Null predicate. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The PascalScript import calls `vxCommonString.IsNullorEmpty` directly. The branch order is significant: type predicates run before any direct equality or general conversion, string values are trimmed, and all numeric values exit `False` without formatting.

**Edge cases and quirks**

- Numeric zero is `False` (not empty). Use a separate zero rule when zero is also absent for a particular field.
- `False` is not explicitly an empty state. Its fallback string representation is normally nonempty, so it returns `False`.
- String trimming occurs only after the Variant is identified as string. The exact characters removed are those recognised by the deployed Delphi `Trim` implementation.
- Variant arrays, interfaces, dispatch values, custom variants and other complex values are not automatically empty. `VarToStr` can return text or raise because no conversion exists.
- A string containing an embedded null character is still a Delphi string and is not truncated by this implementation; trimming/comparison use string length.
- Process-wide Variant string-conversion settings can influence the fallback for applicable types.

**Side effects**

The function does not mutate the Variant. A custom Variant type could execute its own conversion logic when `VarToStr` is called; any side effects of that custom handler are outside this wrapper's control.

**Performance and concurrency**

State and numeric checks are constant-time. String trimming/conversion is proportional to produced text and can allocate. The wrapper is re-entrant, but custom Variant handlers and global conversion rules can have their own concurrency constraints.

**Remarks**

This function is safer for absence testing than direct `Variant = Null`, but its name still represents Velox's particular policy. Define separately whether numeric zero, Boolean false, an empty array or an inactive object should count as absent in the owning configuration field.

**Related entries**

- [`IsNullorZero`](IsNullorZero.md) uses direct Variant equality and has different Null/coercion semantics.
- [`CheckBoolean`](CheckBoolean.md) converts a present Variant to Boolean.
- [`Testing values`](../../ScriptingGuide/TestingValues.md) distinguishes common Variant states.

**External references**

- [Embarcadero `VarIsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsNull)
- [Embarcadero `VarIsEmpty`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsEmpty)
- [Embarcadero `VarIsClear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsClear)
- [Embarcadero `VarToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarToStr)
- [Free Pascal `VarIsNull`](https://www.freepascal.org/docs-html/rtl/variants/varisnull.html)
- [Free Pascal `VarIsEmpty`](https://www.freepascal.org/docs-html/rtl/variants/varisempty.html) — compatible predicate context; Delphi's runtime defines Velox's exact Variant behaviour.

<small>Created 2026-07-15</small>
