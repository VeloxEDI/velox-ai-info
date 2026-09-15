---
title: "vxTryStrToDate"
description: "Attempts a system-locale date conversion and reports whether the output value is valid."
sidebar_position: 57
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - date
  - validation
  - locale
  - delphi
---

```Delphi
function vxTryStrToDate(
  const S: string;
  out Value: TDateTime): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  ParsedDate: TDateTime;
begin
  // For a host whose system short-date order is day/month/year:
  if vxTryStrToDate('31/12/2026', ParsedDate) then
    Value := ParsedDate
  else
    Value := Null;
end;
```

### Usage

`vxTryStrToDate` attempts a system-locale date conversion and reports whether the output value is valid.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Date text in the Windows system short-date grammar. |
| `Value` | `TDateTime`, `out` | Receives a valid date at midnight when the function returns `True`. Do not use it when the function returns `False`. |

**Returns**

`True` only when the locale scanner consumes the whole source and encodes a valid date; otherwise `False`.

**Behaviour**

The Boolean is the authoritative validity result. Successful two-field dates can receive the current year; two-digit years are expanded through the captured `TwoDigitYearCenturyWindow`. A successful `Value` has no time or timezone component.

**Errors**

Ordinary date conversion failures return `False`. Locale acquisition, allocation and unexpected runtime exceptions are not caught by the function.

### Additional Technical Info
`vxTryStrToDate` attempts to parse a complete Windows system-locale date. It returns `True` and writes the midnight date on success, or returns `False` for ordinary syntax/range failure without raising `EConvertError`.

The example is locale-qualified, fictional and source-reviewed. It is not executed by the documentation workflow.

**Implementation**

The scripting import binds to `vxFormats.vxTryStrToDate`. The wrapper constructs `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls `System.SysUtils.TryStrToDate(S, Value, AFormatSettings)`. The installed Delphi terminal derives a token sequence from `ShortDateFormat`, scans locale fields/names, applies current-year and short-year rules, calls `TryEncodeDate`, and requires its position to pass the end of the input.

**Edge cases and quirks**

- A valid date can yield `Value=0.0` for 30 December 1899 while the function returns `True`; always test the Boolean rather than the numeric value.
- The system date order/separator can differ from both a user's workstation and a remote file's declared format.
- Wrong separators, impossible leap dates, time suffixes and extra trailing characters return `False`.
- Omitted-year and short-year results depend on the current year and system century-window setting.
- Locale name forms are accepted only when requested by `ShortDateFormat`; weekday names, when scanned, are checked against the final date.
- `Value` is not a business fallback on `False`. Treat it as unusable even if a build appears to preserve or partially assign it.
- Free Pascal's linked routine documents broader one-number input and explicitly identifies it as non-Delphi behaviour. It does not expand Velox's accepted forms.

**Side effects**

The caller's output variable is written on success. No persistent Velox data is changed.

**Performance and concurrency**

The scan is linear with bounded locale-name comparison. Explicit local settings avoid Delphi global-format races; later system-locale or year changes can affect subsequent calls.

**Remarks**

This is the preferred locale-date entry when invalid optional input is expected and must be handled explicitly. It is not a parser for a remote partner's fixed date format unless that format is guaranteed to match the Velox host system locale.

**Related entries**

- [`vxStrToDate`](vxStrToDate.md) raises for the same failures.
- [`vxStrToDateDef`](vxStrToDateDef.md) replaces failure with a caller-supplied value.
- [`vxStringtoDateTimeValid`](vxStringtoDateTimeValid.md) applies a caller-supplied Velox mask with more permissive separator/suffix handling.

**External references**

- [Embarcadero `System.SysUtils.TryStrToDate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TryStrToDate) - documents the explicit-settings Delphi Boolean overload used by Velox.
- [Free Pascal `TryStrToDate`](https://www.freepascal.org/daily/doc/rtl/sysutils/trystrtodate.html) - dialect comparison whose documented single-number extension does not apply to Delphi/Velox.

<small>Created 2026-07-15</small>
