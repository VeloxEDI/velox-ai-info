---
title: "StrToFloat"
description: "Converts system-locale numeric text to an Extended value and raises when parsing fails."
sidebar_position: 32
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - floating-point
  - locale
  - delphi
---

```Delphi
function StrToFloat(const S: string): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StrToFloat('125');  // 125.0 in every decimal locale
end;
```

### Usage

`StrToFloat` converts system-locale numeric text to an Extended value and raises when parsing fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Signed floating text. The decimal character must equal the Windows system locale's decimal separator; an `E`/`e` exponent can include its own sign. |

**Returns**

The parsed `Extended` value. Precision and range follow the Velox target's definition of `Extended`; on targets where `Extended` aliases `Double`, it does not provide 80-bit precision.

**Behaviour**

The accepted ordinary form is an optional sign, digits with an optional locale decimal separator, and an optional `E`/`e` exponent. Leading and trailing ASCII spaces are ignored. Thousands separators and currency symbols are not accepted.

**Errors**

Invalid syntax, a disallowed separator or out-of-range input raises `EConvertError`, which propagates into the script. Use [`StrToFloatDef`](StrToFloatDef.md) when a fallback is intentional.

**Usage notes**

For machine-to-machine data, normalise the source format deliberately before this call or use a conversion whose separator contract is fixed. Do not assume a workstation's displayed regional format matches a Velox Service host.

### Additional Technical Info
`StrToFloat` converts numeric text to `Extended` using a fresh snapshot of the Windows system locale. It supports ordinary decimal and scientific notation, propagating a conversion exception when the whole value is not valid for the selected locale.

The example deliberately avoids a decimal separator. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox deliberately replaces PascalScript's built-in `StrToFloat` registration with `vxStrToFloat`. The wrapper calls `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` for each invocation and passes that local record to Delphi `System.SysUtils.StrToFloat(S, AFormatSettings)`. The Delphi terminal parses the complete string through its text-to-floating implementation.

**Edge cases and quirks**

- Locale comes from Windows `LOCALE_SYSTEM_DEFAULT`, not the Velox service account's user locale and not Delphi's mutable global `FormatSettings`. A script can therefore behave differently on hosts with different system regional settings.
- A dot is not universally valid. If the system decimal separator is a comma, `1.5` fails and `1,5` is the applicable form.
- The installed Delphi 37.0 terminal additionally recognises case-insensitive `NAN`, `INF`, `+INF` and `-INF`, although the concise public routine description focuses on ordinary numeric grammar.
- An exponent marker must be followed by exponent digits. The entire remaining input must be consumed apart from accepted surrounding spaces.
- Overflow, invalid floating operations or an exponent outside the target range fail conversion rather than returning a saturated value.
- Free Pascal documents a similar format-settings overload, but its version history and supported floating representation are compatibility information only; Velox executes Delphi's implementation.

**Side effects**

None outside constructing a local format-settings record and allocating temporary conversion state.

**Performance and concurrency**

Parsing is linear in input length. Creating locale settings on every call adds an operating-system locale lookup but avoids dependence on Delphi's mutable global format record. The local settings overload is safe from concurrent changes to that Delphi global; a host system-locale change can still affect later calls.

**Related entries**

- [`StrToFloatDef`](StrToFloatDef.md) returns a supplied value when parsing fails.
- [`StrToBool`](StrToBool.md) tries Delphi's global-format floating parser as its first Boolean rule and therefore has a different locale source.
- [`FloatToStr`](FloatToStr.md) formats a floating value using the same Velox system-locale policy.

**External references**

- [Free Pascal `StrToFloat`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtofloat.html) - compatible decimal/scientific reference; Free Pascal version and precision details do not define Velox behaviour.
- [Embarcadero `System.SysUtils.StrToFloat`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloat) - documents the Delphi overload family used by the Velox wrapper.

<small>Created 2026-07-15</small>
