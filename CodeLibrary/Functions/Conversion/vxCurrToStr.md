---
title: "vxCurrToStr"
description: "Formats a Currency value as text with Windows system-locale settings."
sidebar_position: 44
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - currency
  - formatting
  - locale
  - delphi
---

```Delphi
function vxCurrToStr(Value: Currency): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Amount: Currency;
begin
  Amount := 125.5;
  Value := vxCurrToStr(Amount);
end;
```

### Usage

`vxCurrToStr` formats a Currency value as text with Windows system-locale settings.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Value` | `Currency` | Signed 64-bit fixed-point amount with four stored fractional digits. |

**Returns**

The shortest applicable general-format representation, using the Windows system decimal separator. Insignificant trailing fractional zeros are removed and the decimal separator appears only when needed.

**Behaviour**

`Currency` covers `-922337203685477.5808` through `922337203685477.5807`. Within that range, general formatting preserves the fixed-point value, removes insignificant trailing zeros, emits no grouping and uses the system decimal separator when a fractional part remains.

**Errors**

All possible `Currency` bit patterns are representable by the formatter, so ordinary calls have no conversion-failure path. Resource or locale-initialisation exceptions can still propagate.

**Usage notes**

For machine-readable integration output, define the required decimal separator explicitly rather than relying on a host locale. Use a formatting routine with an explicit mask when fixed decimal places are required.

### Additional Technical Info
`vxCurrToStr` converts Delphi's fixed-point `Currency` type to general numeric text using a fresh snapshot of the Windows system locale. Despite its name, it does not add a currency symbol or thousands grouping.

The fictional example is source-reviewed and is not executed by the documentation workflow. On a dot-decimal host it yields `125.5`; a comma-decimal host uses its system decimal separator.

**Implementation**

The scripting import registers `vxCurrToStr` against `vxFormats.vxCurrToStr`. The wrapper constructs `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls the explicit-settings overload `System.SysUtils.CurrToStr(Value, AFormatSettings)`.

In the installed Delphi 37.0 RTL, that overload calls `FloatToText` with `fvCurrency`, `ffGeneral`, and Currency's 19-digit conversion precision. The terminal formats the scaled 64-bit value; it does not call the `ffCurrency` presentation mode.

**Edge cases and quirks**

- `vxCurrToStr` is intended for numeric interchange/display text, not a decorated monetary amount. Currency symbol, positive/negative currency patterns and `CurrencyDecimals` are not used.
- Zero is returned as `0`. An integral amount has no decimal separator; `125.5000` is represented as the locale equivalent of `125.5`.
- Locale comes from Windows `LOCALE_SYSTEM_DEFAULT`, not the current service account's user locale and not Delphi's mutable global `FormatSettings` record.
- The installed Delphi terminal uses `ffGeneral`. Free Pascal's linked `CurrToStr` documentation describes a materially different `ffNumber`/two-decimal equivalence, so that page is a dialect comparison only and must not be used to predict Velox output.
- A string produced on one host may not round-trip on another host whose system decimal separator differs.

**Side effects**

The call only creates local formatting state and returns a new string. At `vxFormats` unit initialisation, Velox also sets the initialising thread locale to the system default and refreshes Delphi global format settings; the function itself does not repeat or depend on that global refresh.

**Performance and concurrency**

Formatting uses a small fixed RTL buffer plus the returned string and is effectively constant-time. The explicit local settings overload is isolated from concurrent changes to Delphi's global format record; a later operating-system locale change can affect later calls.

**Related entries**

- [`vxStrToCurr`](vxStrToCurr.md) parses system-locale numeric text back to `Currency`.
- [`vxFloatToStr`](vxFloatToStr.md) formats an `Extended` value with 15 significant digits.
- [`FloatToStr`](FloatToStr.md) is registered to the same Velox floating formatter as `vxFloatToStr`.

**External references**

- [Embarcadero `System.SysUtils.CurrToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.CurrToStr) - documents the exact Delphi overload family and its general-format behaviour.
- [Free Pascal `CurrToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/currtostr.html) - dialect comparison whose documented two-decimal number format differs from the Delphi terminal executed by Velox.

<small>Created 2026-07-15</small>
