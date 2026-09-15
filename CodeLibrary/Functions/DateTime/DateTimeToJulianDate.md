---
title: "DateTimeToJulianDate"
description: "Converts a TDateTime value to a Julian date whose day boundary is noon."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - julian-date
  - conversion
  - precision
  - delphi
---

```Delphi
Function DateTimeToJulianDate(const AValue: TDateTime): Double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Timestamp: TDateTime;
begin
  Timestamp := EncodeDate(2000, 1, 1) + EncodeTime(12, 0, 0, 0);
  Value := DateTimeToJulianDate(Timestamp); // 2451545.0
end;
```

### Usage

`DateTimeToJulianDate` converts a TDateTime value to a Julian date whose day boundary is noon.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Gregorian date/time to convert. The value itself supplies no timezone. |

**Returns**

A `Double` Julian date. For example, 1 January 2000 at `00:00` is `2451544.5`; noon is `2451545.0`.

**Behaviour**

The half-day offset is intrinsic to the Julian convention: a civil midnight has a `.5` fractional result and civil noon is an integer boundary. The time fraction is carried to the precision available in the input `Double`; it is not restricted to whole seconds by this routine.

**Errors**

No error handler is added by Velox. Valid Velox dates convert directly; failures from decoding or unsupported floating values propagate.

### Additional Technical Info
`DateTimeToJulianDate` converts a Delphi `TDateTime` calendar value into the continuous Julian date convention used in astronomy and related calculations. The result includes a fractional day and changes its integer day number at noon rather than midnight.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.DateTimeToJulianDate`. The terminal decodes the Gregorian year, month and day, applies the integer Gregorian-to-Julian calendar formula, subtracts `32075.5`, then adds `Abs(Frac(AValue))` as the time fraction.

**Edge cases and quirks**

- The result describes the supplied calendar fields only. It is not automatically Greenwich/UTC merely because Julian dates are commonly used as universal time coordinates; normalise the input before conversion when that meaning is required.
- The terminal uses `Abs(Frac(AValue))` so Delphi's negative `TDateTime` time convention contributes a positive time-of-day fraction.
- Floating-point results can contain representation error. Compare or format them with an appropriate tolerance/precision rather than assuming exact decimal equality.
- Invalid raw `TDateTime` values can decode to zero fields or overflow intermediate calendar arithmetic. The script binding performs no validation.
- Free Pascal documents the same conversion concept, but Velox runs the installed Delphi algorithm.

**Side effects**

None.

**Performance and concurrency**

Constant-time integer/floating arithmetic with no allocation or shared state.

**Related entries**

- [`DateTimeToModifiedJulianDate`](DateTimeToModifiedJulianDate.md) subtracts the standard `2400000.5` offset and uses a midnight boundary.

**External references**

- [Embarcadero `System.DateUtils.DateTimeToJulianDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DateTimeToJulianDate) - documents the exact Delphi conversion bound by Velox.
- [Free Pascal `DateTimeToJulianDate`](https://www.freepascal.org/daily/doc/rtl/dateutils/datetimetojuliandate.html) - documents the compatible Free Pascal conversion.

<small>Created 2026-07-15</small>
