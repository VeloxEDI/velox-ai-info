---
title: "vxStrToDateTime"
description: "Parses date/time text with Windows system-locale settings and raises when conversion fails."
sidebar_position: 53
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - date
  - time
  - locale
  - delphi
---

```Delphi
function vxStrToDateTime(const S: string): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // For a day/month/year, 24-hour system locale:
  Value := vxStrToDateTime('31/12/2026 14:30');
end;
```

### Usage

`vxStrToDateTime` parses date/time text with Windows system-locale settings and raises when conversion fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Date/time text interpreted with the Windows system short-date, short-time, separator, name, AM/PM and two-digit-year settings. |

**Returns**

The parsed `TDateTime`: date plus time for combined input, midnight for date-only input, or a time fraction for time-only input. No timezone conversion is applied.

**Behaviour**

Date fields follow `ShortDateFormat`, `DateSeparator`, locale names and `TwoDigitYearCenturyWindow`. Time fields use the system time separator, optional seconds/fractions and system or standard AM/PM strings. Date-only and time-only inputs are legitimate distinct paths.

**Errors**

Invalid or out-of-range date/time text raises Velox `EConvertError` into the script. The public signature has no fallback or success output.

**Usage notes**

Use this routine for genuinely locale-formatted values. For integration payloads, prefer an explicit, documented format and handle timezones separately. Do not use [`vxStringtoTime`](vxStringtoTime.md) as an equivalent time-only parser because its result includes today's date.

### Additional Technical Info
`vxStrToDateTime` delegates to Delphi's Windows system-locale date/time parser. It accepts a locale date with an optional time, or a time-only value, and raises when that parser reports failure.

The example is locale-qualified, fictional and source-reviewed. It is not executed by the documentation workflow.

**Implementation**

The formats scripting import binds the entry to `vxFormats.vxStrToDateTime`. The wrapper builds `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls `System.SysUtils.StrToDateTime(S, AFormatSettings)`. In the installed Delphi 37.0 source, that overload calls `TryStrToDateTime` and raises `EConvertError` on `False`.

`TryStrToDateTime` first attempts the locale date scanner. If a date succeeds and further numeric content remains, it locates and scans a time using regular/short-time rules, then combines the parts (subtracting the time fraction for negative pre-epoch dates). If date scanning fails, it attempts to parse the entire input as time-only.

**Edge cases and quirks**

- A time-only success returns a fraction between `0.0` and less than `1.0`; unlike [`vxStringtoTime`](vxStringtoTime.md), Delphi does not attach today's date.
- Date-only input returns midnight. A valid 30 December 1899 midnight and a valid time-only midnight both have numeric value `0.0`; this raising routine distinguishes them from failure by raising only on invalid input.
- An omitted year uses the current local year; short years use the moving century window. Output can therefore change over time.
- Input must use the host's **system** locale, not an interactive user's locale. The same text can mean a different date or fail on another Velox host.
- Impossible dates/times, wrong field order and invalid AM/PM usage normally fail. However, the installed date-first parser is **not** a strict whole-string validator: after a date it searches the remainder for another number, so a nonnumeric suffix with no later digit can be ignored; the regular date-plus-time path can also accept some whitespace-prefixed suffix text. The time-only fallback is stricter and requires its input to be consumed. Validate an upstream interchange format separately when trailing content must be rejected.
- The installed time encoder accepts hours `0` through `23`; hour `24` fails.
- Negative `TDateTime` dates are combined with time by subtraction to preserve Delphi's representation of pre-epoch timestamps.
- This function does not recognise ISO-8601 timezone suffixes or convert between local time and UTC.
- Free Pascal documents a similar routine but includes date-form differences, including one-number dates not supported by Delphi. Treat it as dialect comparison only.

**Side effects**

No persistent state changes. Current local year and system locale are observable inputs.

**Performance and concurrency**

Parsing is linear in input length with small scans of locale name arrays. Local explicit settings avoid Delphi global-format races; a later system-locale change can alter subsequent calls.

**Related entries**

- [`vxStrToDate`](vxStrToDate.md) accepts date-only locale text.
- [`vxStringtoDateTime`](vxStringtoDateTime.md) uses a caller-supplied Velox mask and returns zero on ordinary failure.
- [`vxStringtoTime`](vxStringtoTime.md) converts `ShortTimeFormat` into a Velox mask and anchors the result to today.

**External references**

- [Embarcadero `System.SysUtils.StrToDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrToDateTime) - documents the Delphi locale parser and raising contract used by Velox.
- [Free Pascal `StrToDateTime`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtodatetime.html) - compatible date/time concept with documented dialect differences that do not define Velox.

<small>Created 2026-07-15</small>
