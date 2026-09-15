---
title: "VarToStrDef"
description: "Converts a Variant to native string and returns a caller-supplied value only for Null."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - string
  - fallback
  - 'null'
---

```Delphi
Function VarToStrDef( const V : Variant; const ADefault : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := VarToStrDef(Null, '(missing)'); // (missing)
end;
```

### Usage

`VarToStrDef` converts a Variant to Velox string and returns a caller-supplied value only for Null.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `V` | `Variant` (`const`) | Value to test for Null and otherwise convert. |
| `ADefault` | `string` (`const`) | Exact result returned when `V` is Null. It is not used for Empty or conversion failure. |
| Result | `string` | `ADefault` for Null; otherwise the converted Velox string. |

**Errors**

The function does not catch a failed conversion. Variant arrays, incompatible interfaces/custom types, range/conversion failures and other non-Null errors propagate as `EVariantError` items. It also does not protect against allocation failure while constructing the result.

### Additional Technical Info
`VarToStrDef` returns `ADefault` when `V` is Null. For every non-Null value it performs the same Delphi Variant-to-native-string conversion used by [`VarToStr`](VarToStr.md).

The example is fictional and source-reviewed only.

**Implementation**

The Velox wrapper delegates to `System.Variants.VarToStrDef`. Delphi calls its Null predicate first. A Null value bypasses the cast and returns `ADefault`; any other value is assigned to the string result through Delphi's normal Variant conversion engine.

This means `ADefault` is a Null policy, not a general error default.

**Behaviour and quirks**

- Empty/Unassigned is not Null and normally converts to `''` rather than `ADefault`.
- Empty text remains empty text. Zero and false produce their own textual representations.
- Unlike [`VarToStr`](VarToStr.md), the Null branch does not read `NullAsStringValue`; it always uses this call's `ADefault`.
- Non-Null numeric, date, Currency and Boolean formatting retains the host-dependent rules described for `VarToStr`.
- If `ADefault` is also a possible real conversion result, the caller cannot tell from the returned text whether the source was Null. Test [`VarIsNull`](VarIsNull.md) first when provenance matters.

**Performance and concurrency**

The Null branch returns a managed-string copy/reference of `ADefault`; other paths have the allocation and formatting cost of the source type. The function has no mutation or I/O, but non-Null formatting can read process-wide locale and Variant settings.

**Related entries**

- [`VarToStr`](VarToStr.md) uses Delphi's process-global Null string value.
- [`VarToWideStrDef`](VarToWideStrDef.md) provides the same Null-only contract for `WideString`.
- [`VarIsNull`](VarIsNull.md) distinguishes the fallback branch explicitly.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarToStrDef`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarToStrDef)
- [Free Pascal: `Variants.VarToStrDef`](https://www.freepascal.org/docs-html/rtl/variants/vartostrdef.html) - compatibility context for the Null-only default contract.

<small>Created 2026-07-15</small>
