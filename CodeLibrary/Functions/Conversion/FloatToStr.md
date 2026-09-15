---
title: "FloatToStr"
description: "Formats an Extended value using Velox's system-default locale format settings."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - floating point
  - locale
  - formatting
---

```Delphi
function FloatToStr(Value: Extended): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := FloatToStr(1234.5);
  // The decimal separator follows the Windows system-default locale.
end;
```

### Usage

`FloatToStr` formats an Extended value using Velox's system-default locale format settings.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Value` | `Extended` | Floating-point value to format. Precision of `Extended` depends on the deployed Velox target. |

**Returns**

General-format text using up to 15 significant digits and the decimal separator from `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)`. Velox selects fixed or scientific notation according to the value. Thousands separators are not inserted.

Special values return `NAN`, `INF` or `-INF`.

**Errors**

Locale-initialisation and string-allocation failures propagate. `NaN` and infinities are formatted tokens rather than errors.

**Usage notes**

For machine interchange, explicitly normalise the decimal separator and define accepted exponent/precision rules, or use a purpose-built fixed contract. Do not parse this output under an unrelated locale without supplying matching rules.

### Additional Technical Info
`FloatToStr` formats an `Extended` floating-point value in Delphi general-number format with 15 significant digits. Velox deliberately supplies a fresh Windows **system-default locale** settings record; it does not call Delphi's parameterless overload.

The example does not assert exact punctuation because its result is locale-dependent. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The formats import registers the script name `FloatToStr` against the Velox function `vxFloatToStr`. That wrapper creates a local `TFormatSettings` snapshot for `LOCALE_SYSTEM_DEFAULT` and calls `System.SysUtils.FloatToStr(Value, FormatSettings)`. The selected RTL overload delegates to general floating-point text conversion with 15 significant digits.

**Edge cases and quirks**

- Output can use a decimal comma or another locale-specific decimal separator. Do not assume a period.
- Large or small magnitudes can use exponent notation. The exact changeover is part of Delphi's general-format algorithm, not a Velox configuration option.
- Formatting is limited to 15 significant digits even where Win32 `Extended` holds more precision. It is not a lossless serialisation of every `Extended` value.
- On current Win32 Delphi targets, `Extended` normally uses 80-bit precision; on Win64 it aliases `Double`. Calculations and rounded text near precision boundaries can differ between deployments.
- The locale is the Windows system default, which can differ from the interactive user's locale and from Delphi's global `FormatSettings`. A Velox service therefore need not format identically to a desktop test under another system configuration.

**Side effects**

No intended external side effect. The call reads operating-system locale data into a local settings record.

**Performance and concurrency**

Each call constructs locale settings and allocates a result string. Because the formatting overload receives a local settings value, it does not depend on concurrent changes to Delphi's global `FormatSettings`; a change to the operating-system default between calls can still change later results.

**External references**

- [Embarcadero `System.SysUtils.FloatToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FloatToStr) - documents the exact Delphi overload family, general format, precision and special values.
- [Free Pascal `FloatToStr`](https://www.freepascal.org/daily/doc/rtl/sysutils/floattostr.html) - compatible general-format reference; Velox's system-default settings wrapper is product-specific.

<small>Created 2026-07-15</small>
