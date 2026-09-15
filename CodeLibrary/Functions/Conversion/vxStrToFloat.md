---
title: "vxStrToFloat"
description: "Converts Windows system-locale numeric text to Extended and raises when parsing fails."
sidebar_position: 54
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - floating-point
  - locale
  - validation
  - delphi
---

```Delphi
function vxStrToFloat(const S: string): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := vxStrToFloat('125');
end;
```

### Usage

`vxStrToFloat` converts Windows system-locale numeric text to Extended and raises when parsing fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Optional sign, digits with an optional system decimal separator, and an optional `E`/`e` exponent with its own optional sign and required digits. Leading/trailing ASCII spaces are accepted. |

**Returns**

The parsed `Extended`. Its actual precision, exponent range and storage follow the Velox build target; on targets where `Extended` aliases `Double`, no 80-bit precision is available.

**Behaviour**

Ordinary input is a complete signed decimal or scientific token. The decimal character must be the Windows system `DecimalSeparator`; thousands separators and currency symbols are never accepted. Surrounding U+0020 spaces are ignored.

**Errors**

Malformed syntax, the wrong decimal character and out-of-range input raise Velox `EConvertError` into the script. Use [`vxStrToFloatDef`](vxStrToFloatDef.md) or [`vxTryStrToFloat`](vxTryStrToFloat.md) when failure is expected.

**Usage notes**

For machine interchange, define and normalise a fixed decimal grammar before calling a system-locale routine. Do not rely on a workstation's display format matching the Velox host.

### Additional Technical Info
`vxStrToFloat` parses complete decimal/scientific text as `Extended` using a fresh snapshot of the Windows system locale. It raises when the text is malformed or outside the target floating range. In the current scripting import, [`StrToFloat`](StrToFloat.md) is an exact alias of this implementation.

The integer example avoids a locale-specific separator. It is fictional, source-reviewed and not executed by the documentation workflow.

**Implementation**

`uPSI_vxFormats` registers both `vxStrToFloat` and the unprefixed `StrToFloat` name against `vxFormats.vxStrToFloat`. Each invocation creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls `System.SysUtils.StrToFloat(S, AFormatSettings)`. The installed Delphi 37.0 overload delegates to the target's text-to-Extended terminal and raises `EConvertError` when it reports failure.

**Edge cases and quirks**

- A dot is not portable. It fails as a decimal character when the system decimal separator is a comma.
- The exponent marker must be followed by at least one exponent digit. Internal spaces, grouping, suffixes and partial tokens fail.
- The installed Delphi terminal additionally accepts case-insensitive `NAN`, `INF`, `+INF` and `-INF` as successful `Extended` values.
- Overflow or an invalid floating operation fails rather than returning a clamped finite value.
- `Extended` differs by target: its precision/range can change between Win32 and targets where it aliases `Double`.
- Locale comes from `LOCALE_SYSTEM_DEFAULT`, not the current user and not Delphi's mutable global `FormatSettings` record.
- The unprefixed [`StrToFloat`](StrToFloat.md) is deliberately mapped to this same wrapper, so both names have identical locale, special-value and exception behaviour in Velox.
- Free Pascal's overload is useful language-family context but its supported floating representations and version history do not establish Delphi behaviour.

**Side effects**

The call changes no persistent data and uses local conversion state. The `vxFormats` unit has a separate load-time action that sets the initialising thread locale and refreshes Delphi global settings.

**Performance and concurrency**

Parsing is linear in input length. A fresh settings record adds a system-locale lookup but isolates the terminal from Delphi global-format mutations; subsequent calls can reflect a system-locale change.

**Related entries**

- [`StrToFloat`](StrToFloat.md) is an exact registered alias.
- [`vxStrToFloatDef`](vxStrToFloatDef.md) returns a supplied fallback on failure.
- [`vxTryStrToFloat`](vxTryStrToFloat.md) returns a Boolean success result.
- [`vxCurrStrToFloat`](vxCurrStrToFloat.md) first discards most non-numeric characters and therefore has a very different acceptance contract.

**External references**

- [Embarcadero `System.SysUtils.StrToFloat`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloat) - documents the exact Delphi explicit-settings overload family used by Velox.
- [Free Pascal `StrToFloat`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtofloat.html) - compatible decimal/scientific comparison; Free Pascal does not define Velox target precision or special-value implementation.

<small>Created 2026-07-15</small>
