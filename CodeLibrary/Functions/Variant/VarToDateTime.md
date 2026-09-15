---
title: "VarToDateTime"
description: "Converts a Variant to a Delphi TDateTime using type-specific and host-locale rules."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - datetime
  - conversion
  - locale
---

```Delphi
Function VarToDateTime(const V : Variant) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Candidate: Variant;
begin
  Candidate := EncodeDate(2026, 7, 19);
  Value := VarToDateTime(Candidate);
end;
```

### Usage

`VarToDateTime` converts a Variant to a Velox TDateTime using type-specific and host-locale rules.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `V` | `Variant` (`const`) | Date/time, numeric, textual, Boolean, interface or custom Variant to convert. |
| Result | `TDateTime` | Velox date/time serial: the integral part represents days relative to the Velox epoch and the fractional part represents time of day. No time-zone identity is carried. |

**Errors**

Unsupported types, invalid text, strict Null conversion, out-of-range Automation dates and failed custom/interface conversions raise `EVariantError` items. There is no fallback parameter and no Boolean success result.

### Additional Technical Info
`VarToDateTime` converts `V` to a Delphi `TDateTime` value. The conversion path depends on the Variant's stored type: date Variants are returned directly, integers are treated as Delphi date serials, and text or other Automation types use locale-sensitive conversion.

The example is fictional and source-reviewed only. It avoids a locale-dependent date literal.

**Implementation**

The Velox wrapper delegates to `System.Variants.VarToDateTime`, which calls Delphi's internal Variant-to-date conversion.

- `varDate` returns its stored `TDateTime` directly.
- Empty/`varEmpty` returns `0`.
- Small and ordinary integer types are used as numeric day serials. `Int64`/`UInt64`, floating and Currency paths use Delphi/Automation conversion where needed.
- Text is first passed to the operating-system Variant date parser with the user-default locale. If that reports a type mismatch, Delphi tries its current date parser and then its current floating parser.
- Interface, custom and by-reference Variant types use their supported Delphi Variant conversion path.

**Edge cases and quirks**

- `0` is a valid `TDateTime` value representing the Delphi epoch, not a conversion-failure sentinel.
- Null normally raises under Delphi's default strict Null-conversion policy. If host code disables `NullStrictConvert`, Null converts to `0`. Test with [`VarIsNull`](VarIsNull.md) when this distinction matters.
- Boolean values are converted numerically. Delphi `WordBool` true is normally `-1`, so Boolean-to-date conversion is legal but rarely meaningful.
- Numeric input is a serial value, not a Unix timestamp, YYYYMMDD number or duration. Convert those representations explicitly.
- Text acceptance and day/month order depend on the Velox process host's Windows user locale and Delphi format settings. A string accepted on one server may be rejected or interpreted differently on another.
- Numeric text can be accepted by the final floating fallback and treated as a date serial.
- `TDateTime` is a floating representation with no time-zone or daylight-saving metadata. This function does not parse or normalise an offset into a zoned instant.

**Performance and concurrency**

Direct date and integer cases are constant-time. Text/Automation paths allocate temporary text and call locale-aware conversion services. The wrapper mutates no state, but output can depend on process-wide locale/format settings; changing those settings concurrently is not a safe way to control parsing.

**Related entries**

- [`VarAsType`](VarAsType.md) with `varDate` returns a date-typed Variant rather than a `TDateTime` result.
- [`VarIsNull`](VarIsNull.md) lets a script define its own Null rule before conversion.
- Date/time conversion functions provide alternatives when the input format is known and should not depend on Variant coercion.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarToDateTime`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarToDateTime)
- [Free Pascal: `Variants.VarToDateTime`](https://www.freepascal.org/docs-html/rtl/variants/vartodatetime.html) - compatibility context; Velox uses Delphi's locale and Variant policies.

<small>Created 2026-07-15</small>
