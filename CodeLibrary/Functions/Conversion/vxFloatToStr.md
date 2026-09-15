---
title: "vxFloatToStr"
description: "Formats an Extended value as text with Windows system-locale settings."
sidebar_position: 45
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - floating-point
  - formatting
  - locale
  - delphi
---

```Delphi
function vxFloatToStr(Value: Extended): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Reading: Extended;
begin
  Reading := 125.5;
  Value := vxFloatToStr(Reading);
end;
```

### Usage

`vxFloatToStr` formats an Extended value as text with Windows system-locale settings.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Value` | `Extended` | Floating-point value to format. Actual precision and range depend on the Velox target. |

**Returns**

General-format numeric text with up to 15 significant digits. The result uses fixed notation when appropriate and scientific notation for sufficiently small or large magnitudes.

**Behaviour**

Ordinary finite values use the Windows system decimal separator and never use a thousands separator. Scientific output uses `E` and an exponent sign only when required by Velox's general-format rules.

**Errors**

Normal finite and special `Extended` values are formatable. Allocation or locale-initialisation exceptions can propagate; no fallback value is supplied.

**Usage notes**

Use an explicit mask when an integration contract requires a fixed decimal point, exact scale or prohibited exponent notation. General-format output is best treated as human-readable, locale-sensitive numeric text.

### Additional Technical Info
`vxFloatToStr` converts an `Extended` value to Delphi general-format text with 15 significant digits and a fresh Windows system-locale settings record. It is the implementation behind both the script names `vxFloatToStr` and [`FloatToStr`](FloatToStr.md).

The fictional example is source-reviewed and not executed by the documentation workflow. Its decimal character follows the host system locale.

**Implementation**

`uPSI_vxFormats` registers `vxFloatToStr` directly against `vxFormats.vxFloatToStr`; it also maps the unprefixed `FloatToStr` name to that same address. Each call creates `TFormatSettings` with `LOCALE_SYSTEM_DEFAULT` and selects `System.SysUtils.FloatToStr(Value, AFormatSettings)`.

The installed Delphi 37.0 overload calls `FloatToText` with `fvExtended`, `ffGeneral`, precision 15 and zero minimum exponent digits. The RTL removes trailing zeros, emits a decimal separator only when needed, and chooses fixed or scientific notation from the value's exponent.

**Edge cases and quirks**

- The terminal emits `NAN`, `INF` and `-INF` for the corresponding special floating values.
- Fifteen significant output digits can lose information from an 80-bit `Extended`. On targets where `Extended` aliases `Double`, the input itself has Double precision; scripts should not assume identical least-significant digits across build targets.
- General formatting chooses fixed or scientific notation from the decimal exponent and the 15-digit precision. In the installed RTL implementation, exponents greater than 15 or less than -3 select scientific notation; callers should not treat this as a fixed-decimal report formatter.
- Negative zero and floating rounding follow the installed Delphi RTL and target floating environment.
- Locale is the Windows system default, not a user's display preference and not Delphi's mutable global `FormatSettings`. Output can differ between Velox hosts.
- The unprefixed [`FloatToStr`](FloatToStr.md) is an exact scripting alias in the current registration. There is no semantic reason to call one name over the other.

**Side effects**

The call creates local settings and allocates the result string but does not mutate script or product state. The `vxFormats` unit has a separate initialisation action that sets the initialising thread locale and refreshes Delphi globals once.

**Performance and concurrency**

The RTL uses a small fixed conversion buffer, so cost is effectively constant for the bounded floating representation. Explicit local settings avoid races on Delphi's global format record; a system-locale change can affect a subsequent call.

**Related entries**

- [`FloatToStr`](FloatToStr.md) is registered to this exact implementation.
- [`vxStrToFloat`](vxStrToFloat.md) parses the corresponding system-locale decimal/scientific grammar.
- [`vxCurrToStr`](vxCurrToStr.md) formats fixed-point `Currency` without reducing it to floating point.

**External references**

- [Embarcadero `System.SysUtils.FloatToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.FloatToStr) - documents the exact overload family, 15-digit general format and special values.
- [Free Pascal `FloatToStr`](https://www.freepascal.org/daily/doc/rtl/sysutils/floattostr.html) - compatible general-format comparison; Free Pascal overloads and floating representations do not define Velox behaviour.

<small>Created 2026-07-15</small>
