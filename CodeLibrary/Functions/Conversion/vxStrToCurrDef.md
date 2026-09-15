---
title: "vxStrToCurrDef"
description: "Converts system-locale currency text, returning a supplied Currency value when parsing fails."
sidebar_position: 50
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - currency
  - fallback
  - locale
  - delphi
---

```Delphi
function vxStrToCurrDef(
  const S: string;
  const Default: Currency): Currency;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Amount: Currency;
begin
  Amount := vxStrToCurrDef('not supplied', -1);
  Value := Amount;  // -1 indicates the chosen fallback in this example
end;
```

### Usage

`vxStrToCurrDef` converts system-locale currency text, returning a supplied Currency value when parsing fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Locale-sensitive numeric/scientific text. Currency symbols, grouping separators and accounting parentheses are not accepted. |
| `Default` | `Currency`, `const` | Value returned for any ordinary syntax, separator, precision/range or complete-consumption failure. |

**Returns**

The parsed `Currency` when conversion succeeds; otherwise exactly `Default`. The return alone cannot distinguish successful input equal to the fallback from failed input.

**Behaviour**

Accepted ordinary syntax is an optional sign, decimal digits, an optional system-locale decimal fraction, and an optional signed decimal exponent, with surrounding ASCII spaces. Thousands separators and currency symbols are rejected.

**Errors**

Ordinary conversion errors are suppressed into `Default`. Locale acquisition, allocation and other unexpected runtime exceptions can still propagate because the function does not catch them.

**Usage notes**

Use [`vxTryStrToCurr`](vxTryStrToCurr.md) when downstream logic must distinguish failure from a valid value equal to the fallback. A default should represent a deliberate business rule, not conceal malformed mandatory data.

### Additional Technical Info
`vxStrToCurrDef` parses system-locale numeric text as four-decimal Delphi `Currency`. When syntax or range validation fails, it returns the caller's `Default` value instead of raising a conversion exception.

The fictional example uses an application-chosen sentinel. It is source-reviewed and not executed by the documentation workflow; choose a fallback that cannot be confused with valid business data.

**Implementation**

The scripting import binds the entry to `vxFormats.vxStrToCurrDef`. The wrapper captures `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls `System.SysUtils.StrToCurrDef(S, Default, AFormatSettings)`. The installed Delphi terminal runs the same Currency `TextToFloat` path as `StrToCurr`, assigning `Default` only when that path returns `False`.

Successful input is scaled to four fractional digits, range-checked against the signed 64-bit Currency representation and rounded to nearest with ties to even when more fractional precision is present.

**Edge cases and quirks**

- A legitimate parsed amount can equal `Default`. This function supplies no success flag, so a fallback collision is inherently ambiguous.
- More than four fractional digits are rounded to Currency scale; use a separate validation rule if upstream precision beyond four places must be rejected rather than rounded.
- The system decimal separator must be used. A value copied from a host with a different locale can silently select `Default`.
- `NAN` and infinities are invalid for Currency and select `Default`.
- Overflow, malformed exponent text, internal junk and partial consumption all select the same fallback; the failure reason is not returned.
- The explicit settings record is created from Windows `LOCALE_SYSTEM_DEFAULT`, not a user profile or Delphi global settings.
- Free Pascal exposes a comparable fallback routine, but Delphi's installed parser, range and rounding implementation are authoritative for Velox.

**Side effects**

No persistent state changes. A local format-settings record and parser temporaries are created.

**Performance and concurrency**

Runtime is linear in the source length. Local explicit settings avoid mutable-global format races, although a system-locale change can affect a later invocation.

**Related entries**

- [`vxStrToCurr`](vxStrToCurr.md) raises on the same conversion failures.
- [`vxTryStrToCurr`](vxTryStrToCurr.md) returns a Boolean success result.
- [`vxCurrToStr`](vxCurrToStr.md) produces locale-sensitive general numeric text from Currency.

**External references**

- [Embarcadero `System.SysUtils.StrToCurrDef`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrToCurrDef) - documents the explicit-settings Delphi fallback overload used by Velox.
- [Free Pascal `StrToCurrDef`](https://www.freepascal.org/docs-html/rtl/sysutils/strtocurrdef.html) - compatible fallback reference; Delphi source defines Velox's exact parser and rounding.

<small>Created 2026-07-15</small>
