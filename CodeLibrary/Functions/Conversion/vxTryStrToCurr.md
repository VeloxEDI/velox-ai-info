---
title: "vxTryStrToCurr"
description: "Attempts a system-locale Currency conversion and reports whether the output value is valid."
sidebar_position: 56
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - currency
  - validation
  - locale
  - delphi
---

```Delphi
function vxTryStrToCurr(
  const S: string;
  out Value: Currency): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Amount: Currency;
begin
  if vxTryStrToCurr('125', Amount) then
    Value := Amount
  else
    Value := Null;
end;
```

### Usage

`vxTryStrToCurr` attempts a system-locale Currency conversion and reports whether the output value is valid.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Optional sign, decimal/scientific digits and the Windows system decimal separator, with optional surrounding ASCII spaces. |
| `Value` | `Currency`, `out` | Receives the four-decimal fixed-point result on success. Treat it as undefined/unusable when the function returns `False`. |

**Returns**

`True` when the entire token is valid and in Currency range; otherwise `False`.

**Behaviour**

Use the Boolean as the validity contract. Symbols, grouping characters, accounting parentheses, the wrong decimal separator, malformed exponents, extra characters and range overflow return `False`.

**Errors**

Ordinary parse and range failures return `False`. The function does not catch locale acquisition, allocation or unexpected runtime exceptions.

**Usage notes**

This is the preferred member of the Currency parsing family when invalid input is expected and must be handled explicitly. It does not validate decorated money formats; normalise those according to the source specification first.

### Additional Technical Info
`vxTryStrToCurr` attempts to parse complete system-locale numeric text into Delphi `Currency`. It returns a Boolean instead of raising for ordinary conversion failure and writes a usable `Value` only when that Boolean is `True`.

The fictional integer example is source-reviewed and not executed by the documentation workflow.

**Implementation**

The scripting import maps the function to `vxFormats.vxTryStrToCurr`. The wrapper creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and invokes `System.SysUtils.TryStrToCurr(S, Value, AFormatSettings)`. The installed Delphi overload directly returns its Currency `TextToFloat` result.

That terminal parses decimal/scientific syntax, rounds to four places with ties to even, and rejects results outside Currency's scaled signed-64-bit range.

**Edge cases and quirks**

- The parser accepts a signed exponent even though the destination is fixed-point Currency.
- Excess fractional precision is rounded rather than treated as invalid. Exact half-way cases round to an even fourth-decimal digit.
- `NAN`, `INF` and `-INF` return `False`.
- Leading/trailing ASCII spaces are accepted; arbitrary internal spaces are not.
- Failure does not supply a defined business value. Do not read, log or persist `Value` unless the Boolean is `True`, even if a particular build appears to leave a prior/intermediate value there.
- The source locale is Windows `LOCALE_SYSTEM_DEFAULT`, not the current user. Identical text can succeed on one Velox host and fail on another.
- The DocWiki description for this routine contains legacy wording about returning `Default`; the declaration and installed source show the actual `out Value`/Boolean contract documented here.

**Side effects**

On success the caller's output variable is written. No persistent product state is changed.

**Performance and concurrency**

Parsing is linear in source length. The local settings record isolates the call from Delphi global-format mutations; system-locale changes can affect subsequent calls.

**Related entries**

- [`vxStrToCurr`](vxStrToCurr.md) raises on failure.
- [`vxStrToCurrDef`](vxStrToCurrDef.md) returns a caller-supplied fallback and cannot distinguish fallback collision.
- [`vxTryStrToFloat`](vxTryStrToFloat.md) has a floating `Extended` destination and accepts floating special values.

**External references**

- [Embarcadero `System.SysUtils.TryStrToCurr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TryStrToCurr) - documents the exact Delphi overload family; the installed declaration/source resolve the page's legacy fallback wording.
- [Free Pascal `TryStrToCurr`](https://www.freepascal.org/docs-html/rtl/sysutils/trystrtocurr.html) - compatible Boolean Currency conversion reference; Free Pascal is not proof of Delphi rounding or failure-output state.

<small>Created 2026-07-15</small>
