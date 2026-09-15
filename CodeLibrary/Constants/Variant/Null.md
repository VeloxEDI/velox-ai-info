---
title: 'Null'
description: Returns a fresh explicit-missing Variant of type varNull, with deterministic predicate tests but global-rule-dependent comparisons and conversions.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, 'null', missing, database]
---

```Delphi
function Null: Variant;
```

### Example

```Delphi
function MissingOrText(const Candidate: Variant): String;
begin
  if VarIsNull(Candidate) then
    Result := '(missing)'
  else
    Result := VarToStr(Candidate);
end;
```

### Usage

Returns a fresh explicit-missing Variant of type varNull, with deterministic predicate tests but global-rule-dependent comparisons and conversions.

### Additional Technical Info
`Null` returns a Variant whose base type is [`varNull`](../VariantTypes/varNull.md) (1). It represents an explicitly unknown or missing value, commonly returned by nullable dataset fields and Velox mapping/conversion helpers. It is still an assigned Variant and is different from [`Unassigned`](Unassigned.md), empty text, zero, `False`, a nil interface and an absent object reference.

Although shown in the Constants group, this is a zero-argument function-backed sentinel. Modified Pascal Script registers the declaration and binds the current Delphi function. Each evaluation clears its result and sets `VType` to `varNull`; there is no mutable global Null object.

**Test before converting**

Use [`VarIsNull`](../../Functions/Variant/VarIsNull.md) for a deterministic state test or [`VarType`](../../Functions/Variant/VarType.md) when the exact type code is needed. Do not replace that predicate with `Candidate = Null`: installed Delphi comparison behavior depends on process-global `NullEqualityRule` and `NullMagnitudeRule`. Their defaults are loose, but native host code can change them to strict or error behavior.

Installed Delphi also defaults `NullStrictConvert` to `True`, so a normal Null cast to a non-Variant type can raise a Variant conversion exception. Two important script-visible exceptions are deliberate:

- [`VarToStr`](../../Functions/Variant/VarToStr.md) returns the process-global `NullAsStringValue`, initially `''`.
- The modified Pascal Script runtime routes Variant-to-script `string`, `WideString` and `UnicodeString` conversion through `VarToStr` specifically to avoid Null conversion errors. This produces empty text under the default but loses the fact that the source was Null.

[`VarToStrDef`](../../Functions/Variant/VarToStrDef.md) supplies an explicit Null-only string fallback. Test first when `''` or the fallback could also be a real value and provenance matters.

**Effects and boundaries**

Creating or assigning the inline sentinel performs no I/O and mutates no Velox configuration. Assignment replaces the destination Variant's previous value. Arithmetic, ordering, Boolean conversion and assignment to strongly typed destinations should not be used as implicit missing-value policies; branch explicitly and decide the integration's required fallback/error behavior.

The example is source-reviewed only and was not executed.

**External references**

- [Embarcadero `System.Variants.Null`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.Null)
- [Embarcadero `System.Variants.VarIsNull`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarIsNull)
- [Free Pascal `Null`](https://www.freepascal.org/docs-html/rtl/variants/null.html)

<small>Created 2026-07-15</small>
