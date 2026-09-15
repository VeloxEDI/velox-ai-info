---
title: "IfNull"
description: "Returns the fallback Variant only when the first Variant compares equal to Null."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - ifnull
  - 'null'
  - variant
  - fallback
  - type-preserving
---

```Delphi
Function IfNull(const aValue1, aValue2: Variant): Variant
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  PreferredValue: variant;
begin
  PreferredValue := Null;
  Value := IfNull(PreferredValue, 25);
  // Integer Variant containing 25
end;
```

### Usage

`IfNull` returns the fallback Variant only when the first Variant compares equal to Null.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue1` | `Variant`, `const` | Preferred value compared with Variant Null using Velox equality rules. |
| `aValue2` | `Variant`, `const` | Fallback returned when that equality is true. |

Both argument expressions are evaluated before selection. `IfNull(Value, ExpensiveFallback())` always evaluates `ExpensiveFallback`, even when `Value` is not Null.

**Returns**

The selected Variant, normally retaining its type, including string, numeric, date, Boolean, Empty or Null. If both arguments are Null, the result is Null.

**Errors**

Null comparison under `ncrError`, custom Variant comparison/copy errors, argument evaluation failures and allocation errors propagate. The fallback is not an error handler.

**Usage notes**

Use `IfNull` when a database-style Null alone means absent and retaining the selected type matters. Use [`IfEmpty`](IfEmpty.md) when exact empty text conversion should also select the fallback, or [`CoalesceEmpty`](CoalesceEmpty.md) when whitespace-only strings should count as empty.

### Additional Technical Info
`IfNull` returns `aValue2` only when `aValue1` compares equal to Variant Null; otherwise it returns `aValue1`. The selected Variant is copied without deliberate conversion, so its type is preserved.

It does not treat Empty/unassigned, empty text, whitespace, zero or `False` as Null. The example is fictional, deterministic and source-reviewed and was not executed by the documentation workflow.

**Implementation**

The compile/runtime import points directly to `vxCommon.IfNull`:

```Delphi
if aValue1 = Null then
  Result := aValue2
else
  Result := aValue1;
```

No `VarIsNull`, text conversion, trimming, cloning of referenced objects or exception handling is performed.

**Selection matrix with default `ncrLoose` equality**

| `aValue1` | Result |
|---|---|
| Null | `aValue2` |
| Empty/unassigned Variant | Original Empty Variant |
| `''` | Original empty-string Variant |
| Whitespace-only string | Original whitespace string |
| `0` | Original numeric zero and numeric subtype |
| `False` | Original Boolean Variant |
| Any other non-Null value | Original first Variant |

**Global Null-equality dependency**

Installed Delphi initializes process-global `System.Variants.NullEqualityRule` to `ncrLoose`, where Null equals only Null. The implementation depends on that setting:

- `ncrStrict`: every equality involving Null is false, so a Null first value is returned rather than replaced.
- `ncrError`: equality involving Null raises `EVariantInvalidNullOpError`.

Velox source does not assign this variable. A direct `VarIsNull` implementation would be independent of the rule, but this function does not use one. Callers normally see the documented default unless native code in the process changes it.

**Type and reference semantics**

The selected Variant is assigned to the result using normal Variant copy semantics. Scalar/string contents are value/reference-counted as defined by Delphi. Interface/object/array-like Variant contents are not deep-cloned; selecting them does not create an independent business object.

**Side effects**

The function body only compares and copies. Both inputs are eager, and custom Variant equality/copy logic can execute code outside the helper.

**Performance and concurrency**

Constant-time comparison and Variant copy for ordinary scalar values. Reference counting may occur. Behavior shares the process-global Null comparison rule and can change if native code mutates it concurrently.

**Related entries**

- [`IfEmpty`](IfEmpty.md) converts the first Variant to text for its exact-empty test.
- [`Coalesce`](Coalesce.md) uses the same Null equality idea but always returns text.
- [`CoalesceFloat`](CoalesceFloat.md) and [`CoalesceInteger`](CoalesceInteger.md) force numeric conversion.

**External references**

- [Embarcadero `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.NullEqualityRule) - authoritative for the installed default/alternate comparison behavior.
- [Embarcadero `System.Variants.VarIsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsNull) - documents the direct type test not used here.
- [Free Pascal `VarIsNull`](https://www.freepascal.org/docs-html/rtl/variants/varisnull.html) - portability reference; the Velox function uses Delphi equality rather than this test.

<small>Created 2026-07-15</small>
