---
title: "TryJulianDateToDateTime"
description: "Tries to convert an astronomical Julian date into an encoded Gregorian date and millisecond time."
sidebar_position: 153
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
Function TryJulianDateToDateTime(const AValue: Double;
  var ADateTime: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EncodedValue: TDateTime;
begin
  if TryJulianDateToDateTime(2451545.0, EncodedValue) then
    Value := EncodedValue; // 1 January 2000 at 12:00
end;
```

### Usage

`TryJulianDateToDateTime` tries to convert an astronomical Julian date into an encoded Gregorian date and millisecond time.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `Double`, `const` | Julian date number including its noon-based fractional day. |
| `ADateTime` | `TDateTime`, `var` | Receives the converted value when the calendar part is encodable. |

**Returns**

`True` when the derived Gregorian year/month/day can be encoded; otherwise normally `False`. Numeric and post-encode failures are not comprehensively caught.

**Behaviour**

- `2451545.0` maps to 1 January 2000 at 12:00.
- Adding `0.5` advances twelve hours to the following midnight.
- Output is an untagged calendar value; the routine does not retain an astronomical time scale such as UTC or TT.

**Errors**

Unencodable calendar fields normally return `False`. Numeric conversion, overflow or timestamp errors can still propagate.

### Additional Technical Info
`TryJulianDateToDateTime` converts an astronomical Julian date number to Delphi's proleptic-Gregorian `TDateTime`. Julian integral-day boundaries occur at noon, and the conversion reduces the fractional day to millisecond resolution.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.TryJulianDateToDateTime`. The terminal:

1. applies `Trunc` and integer Gregorian-calendar conversion arithmetic;
2. casts the derived fields to `Word` and calls `TryEncodeDate`;
3. converts `Abs(Frac(AValue))` to a millisecond-within-day value;
4. subtracts 12 hours for the Julian noon boundary; and
5. adds the fractional milliseconds with DateUtils timestamp arithmetic.

**Edge cases and quirks**

- The result is limited by Delphi's encodable years `1..9999`. An unencodable derived date normally returns `False` without assigning `ADateTime`.
- The `Try` contract covers the date-encode decision, not every floating/integer operation. NaN, infinity or extreme magnitudes can raise during `Trunc`, integer arithmetic or later timestamp increments instead of returning `False`.
- Fractional input is quantised through `MilliSecondOfTheDay`; sub-millisecond detail is lost and binary floating-point approximation applies.
- The implementation uses the absolute fractional magnitude. Negative/extreme Julian values should not be extrapolated without confirming the supported convention and range.
- Near the supported date boundaries, the subsequent 12-hour and millisecond adjustments are not wrapped in a second Boolean validation.

**Side effects**

May write `ADateTime`; no shared state or I/O.

**Performance and concurrency**

Constant-time floating-point, integer and timestamp arithmetic with no shared mutable state.

**Related entries**

- [`JulianDateToDateTime`](JulianDateToDateTime.md) raises a conversion exception when this routine returns `False`.
- [`TryModifiedJulianDateToDateTime`](TryModifiedJulianDateToDateTime.md) applies the Modified Julian offset first.
- [`DateTimeToJulianDate`](DateTimeToJulianDate.md) performs the inverse conversion.

**External references**

- [Embarcadero `System.DateUtils.TryJulianDateToDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TryJulianDateToDateTime)
- [Free Pascal `TryJulianDateToDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/tryjuliandatetodatetime.html)

<small>Created 2026-07-15</small>
