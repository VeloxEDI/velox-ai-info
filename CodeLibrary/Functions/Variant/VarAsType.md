---
title: "VarAsType"
description: "Returns a new Variant converted to a specified Variant base type."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - conversion
  - vartype
---

```Delphi
Function VarAsType(const V : Variant; AVarType : TVarType) : Variant
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := VarAsType('42', varInteger); // Integer Variant containing 42
end;
```

### Usage

`VarAsType` returns a new Variant converted to a specified Variant base type.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `V` | `Variant` (`const`) | Source value to copy or convert. |
| `AVarType` | `TVarType` | Destination base type code, for example `varInteger`, `varDouble`, `varCurrency`, `varDate`, `varBoolean`, `varOleStr`, `varString`, `varUString`, `varEmpty` or `varNull`. It must not contain `varArray` or `varByRef`. |
| Result | `Variant` | New Variant whose stored type is the requested type when conversion succeeds. |

**Errors**

Invalid type codes and unsupported conversions raise `EVariantError` items. Common failures include `EVariantTypeCastError` for an incompatible representation and `EVariantOverflowError` or `EVariantRangeCheckError` when a numeric value does not fit the target. Null conversion can also raise when Velox's strict Null conversion policy applies.

No fallback is supplied and no conversion error is swallowed. If untrusted input is allowed, handle the exception at the appropriate script boundary and avoid retrying with unrelated type assumptions.

### Additional Technical Info
`VarAsType` explicitly converts `V` to the Variant type code in `AVarType` and returns the converted Variant. The input Variant is not changed.

The example is fictional and source-reviewed only.

**Implementation**

The Velox wrapper delegates directly to `System.Variants.VarAsType`, which calls Delphi's Variant cast engine. A source already stored with the exact requested type is copied. Nested/by-reference Variant values are resolved where required; standard types use Delphi conversion helpers, custom Variant types can supply their own casts, and Automation-compatible conversions can use the operating system's user-locale rules.

The operation is a type conversion, not a parser with a Boolean success result. It either returns the new value or raises.

**Behaviour**

- A numeric target applies that type's range and rounding rules. A value that fits `varDouble` may overflow `varInteger`, and a floating conversion may lose precision.
- A string-to-number, string-to-date or date/string conversion can depend on the Velox host's locale and current Delphi formatting environment.
- Target `varEmpty` produces an Empty/Unassigned result, except that converting Null to Empty follows Delphi's `NullStrictConvert` policy.
- Target `varNull` produces Null; it does not preserve the source value.
- Interface and custom Variant targets rely on the source/target type's supported conversion paths.
- Array conversion is not supported by adding `varArray` to a base code. Create an array with [`VarArrayCreate`](VarArrayCreate.md) and convert individual elements as needed.

**Performance and concurrency**

Simple numeric casts are constant-time. String, interface and custom-type conversions may allocate or invoke external/custom Variant handlers. The Velox wrapper has no mutable state, but results that depend on process-wide locale or Variant globals can change if host code modifies those settings concurrently.

**Related entries**

- [`VarType`](VarType.md) reports the current type code before conversion.
- [`VarToDateTime`](VarToDateTime.md) converts specifically to the non-Variant `TDateTime` result type.
- [`VarToStr`](VarToStr.md) and [`VarToStrDef`](VarToStrDef.md) provide native-string conversion with defined Null handling.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarAsType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarAsType)
- [Free Pascal: `Variants.VarAsType`](https://www.freepascal.org/docs-html/rtl/variants/varastype.html) - compatibility context; Velox follows the Delphi cast engine.

<small>Created 2026-07-15</small>
