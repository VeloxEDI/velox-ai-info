---
title: "VarToStr"
description: "Converts a Variant to native string, using Delphi's global Null string value for Null."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - string
  - conversion
  - 'null'
---

```Delphi
Function VarToStr( const V : Variant) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := VarToStr(2048); // 2048
end;
```

### Usage

`VarToStr` converts a Variant to Velox string, using Velox's global Null string value for Null.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `V` | `Variant` (`const`) | Value to convert. Standard numeric, date, Boolean and string Variant types are supported; custom/interface types depend on their conversion support. |
| Result | `string` | Velox string representation. Null returns `NullAsStringValue`; Empty normally returns `''`. |

**Errors**

Null is handled without error, but incompatible non-Null interfaces, arrays, custom values or failed conversions raise `EVariantError` items. Use [`VarToStrDef`](VarToStrDef.md) only when a Null fallback is required; it does not catch these failures either.

### Additional Technical Info
`VarToStr` converts `V` to the script's native `string` type. Null does not use the normal strict Variant cast: the function returns Delphi's process-global `NullAsStringValue`, which is empty by default.

The example is fictional and source-reviewed only.

**Implementation**

The Velox wrapper calls `System.Variants.VarToStr`. Delphi implements this as `VarToStrDef(V, NullAsStringValue)`: it first tests for Null and only performs a normal Variant-to-string assignment when the value is not Null.

For non-Null built-in values, the installed Delphi run time applies type-specific formatting:

- signed and unsigned integers use decimal text;
- floating values use Delphi `FloatToStr` and its current formatting environment;
- Currency and `varDate` use operating-system Variant formatting for the user-default locale;
- Boolean text follows Delphi's process-wide Variant Boolean string/rule settings;
- string Variants are converted to the current native string representation; and
- custom/interface Variants use their registered or Automation string conversion where supported.

**Edge cases and quirks**

- Null returns the global `NullAsStringValue` even when `NullStrictConvert` is enabled. The default value is `''`, but host code can change it.
- Empty also normally returns `''`, so the default result cannot distinguish Empty, Null and actual empty text.
- Formatting is for display/interchange only when the receiving contract accepts it. Date, Currency, floating and Boolean results can depend on the Velox host environment.
- A Variant array is not joined or serialised; trying to convert an array to ordinary text raises rather than producing a useful list or JSON representation.
- A textual representation is not necessarily round-trippable to the original Variant type or precision.

**Performance and concurrency**

The result is allocated as needed. Numeric formatting is small and bounded; custom/Automation conversions may do more work. The function reads process-global Null, Boolean and formatting/locale state. Concurrent mutation of that state can make output inconsistent even though the wrapper itself has no side effects.

**Related entries**

- [`VarToStrDef`](VarToStrDef.md) supplies an explicit Null result.
- [`VarToWideStr`](VarToWideStr.md) returns the distinct `WideString`/OLE string type.
- [`VarIsNull`](VarIsNull.md) preserves the distinction before converting.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarToStr)
- [Free Pascal: `Variants.VarToStr`](https://www.freepascal.org/docs-html/rtl/variants/vartostr.html) - compatibility context; Velox uses Delphi's formatting globals and locale.

<small>Created 2026-07-15</small>
