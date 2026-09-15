---
title: "JulianDateToDateTime"
description: "Converts a Julian date number with its noon-based fractional day to a millisecond-resolution `TDateTime`."
sidebar_position: 81
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - julian
  - conversion
---

```Delphi
Function JulianDateToDateTime(const AValue: Double): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := JulianDateToDateTime(2451545.0); // 1 January 2000 at 12:00
end;
```

### Usage

`JulianDateToDateTime` converts a Julian date number with its noon-based fractional day to a millisecond-resolution `TDateTime`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `Double`, `const` | Julian date number, including an optional fractional day measured from the Julian noon boundary. |

**Returns**

The equivalent untagged `TDateTime`, rounded to the millisecond resolution used by the conversion path.

**Behaviour**

- `2451545.0` maps to 1 January 2000 at 12:00.
- Adding `0.5` advances 12 encoded hours and therefore reaches the next midnight.
- The result contains no timezone or time-scale metadata. The routine does not decide whether the input represents UTC, TT or another astronomical convention.
- Calendar output uses Velox's supported proleptic Gregorian rules rather than a historical regional calendar switch.

**Errors**

An invalid, non-finite or unsupported Julian date can raise `EConvertError`, a floating-point exception or a downstream date/timestamp range exception. Velox does not translate those failures.

### Additional Technical Info
`JulianDateToDateTime` converts a numeric Julian date into Delphi's proleptic-Gregorian `TDateTime` representation. Julian dates begin at noon, so an integral Julian date maps to 12:00 rather than midnight.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.JulianDateToDateTime`. Its conversion terminal:

1. takes the integral Julian-day portion with `Trunc`;
2. derives a proleptic-Gregorian year, month and day and attempts to encode that date;
3. converts the absolute fractional portion to a millisecond-within-day value;
4. subtracts 12 hours to align the Julian noon boundary with Delphi's midnight boundary; and
5. adds the milliseconds through DateUtils timestamp arithmetic.

If the calendar date cannot be encoded, the routine raises the DateUtils invalid-Julian-date conversion error.

**Edge cases and quirks**

- The supported result is limited to Delphi's encodable calendar years 1 through 9999. Julian values outside that effective range raise rather than returning a sentinel.
- Fractional days are reduced to millisecond resolution by the helper path and are subject to normal binary floating-point approximation.
- The conversion uses `Trunc` and the absolute fractional magnitude. Do not extrapolate the result for negative or extreme Julian numbers without checking that the desired date lies in the supported calendar range and convention.
- An integral value is noon, not midnight. Forgetting this 12-hour offset is the most common semantic error.
- The returned `TDateTime` is untagged. Formatting it as local time does not make the astronomical input local.

**Side effects**

None.

**Performance and concurrency**

Constant-time numeric and calendar conversion with no external I/O or shared mutable state.

**Remarks**

Record the astronomical scale and timezone convention alongside the input in the surrounding configuration. This function performs representation conversion only.

**Related entries**

- [`IncMilliSecond`](IncMilliSecond.md) is used by the terminal adjustment and establishes millisecond quantisation.
- [`IsValidDate`](IsValidDate.md) documents Delphi's supported Gregorian component range.

**External references**

- [Embarcadero `System.DateUtils.JulianDateToDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.JulianDateToDateTime)
- [Free Pascal `JulianDateToDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/juliandatetodatetime.html)

<small>Created 2026-07-15</small>
