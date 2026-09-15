---
title: "DecodeDateTime"
description: "Writes all calendar-date and millisecond-resolution time components of a TDateTime value."
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - decoding
  - milliseconds
  - var-parameters
  - delphi
---

```Delphi
Procedure DecodeDateTime(const AValue: TDateTime;
  var AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond: Word)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Y, Mo, D, H, Mi, S, MS: Word;
begin
  DecodeDateTime(EncodeDate(2026, 7, 18) + EncodeTime(14, 30, 45, 125),
    Y, Mo, D, H, Mi, S, MS);
  // Outputs: 2026, 7, 18, 14, 30, 45, 125
  Value := MS;
end;
```

### Usage

`DecodeDateTime` writes all calendar-date and millisecond-resolution time components of a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time to decompose. |
| `AYear` | `Word`, `var` | Overwritten with the calendar year. |
| `AMonth` | `Word`, `var` | Overwritten with month `1..12`. |
| `ADay` | `Word`, `var` | Overwritten with the valid day in that month. |
| `AHour` | `Word`, `var` | Overwritten with hour `0..23`. |
| `AMinute` | `Word`, `var` | Overwritten with minute `0..59`. |
| `ASecond` | `Word`, `var` | Overwritten with second `0..59`. |
| `AMilliSecond` | `Word`, `var` | Overwritten with millisecond `0..999`. |

**Behaviour**

All seven output variables are overwritten. The routine does not attach or return a timezone; the components describe the calendar and clock fields already encoded in `AValue`.

**Errors**

Valid values do not raise. Non-finite or unsupported raw values can propagate timestamp conversion errors; no function handler is present.

### Additional Technical Info
`DecodeDateTime` decomposes one `TDateTime` into seven calendar and clock components, down to milliseconds. It is a convenience wrapper over Delphi's separate date and time decoders.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.DecodeDateTime`. Its implementation calls `System.SysUtils.DecodeDate` for the first three outputs, followed by `System.SysUtils.DecodeTime` for the remaining four. Both operate through `DateTimeToTimeStamp` at millisecond resolution.

**Edge cases and quirks**

- Sub-millisecond information in the underlying `Double` is not represented in the outputs.
- Delphi decodes date and time independently. For a raw value before the supported year-1 boundary, date outputs can become zero while `DecodeTime` still writes a time-of-day. Treat `AYear = 0` as invalid input rather than a partially useful timestamp.
- Negative but valid pre-1899 values decode correctly under Delphi's special negative time convention.
- The script declaration represents Delphi `out` parameters as `var`; incoming values are ignored.
- Free Pascal exposes the same seven logical outputs, but exact invalid-value and timestamp-rounding behaviour is implementation-specific.

**Side effects**

Only the seven caller variables are changed.

**Performance and concurrency**

Constant bounded calendar and time arithmetic with no allocation or shared state.

**Related entries**

- [`DecodeDate`](DecodeDate.md) returns only year/month/day.
- [`DecodeTime`](DecodeTime.md) returns only time fields.
- [`DecodeDateWeek`](DecodeDateWeek.md) returns ISO week fields rather than calendar month/day.

**External references**

- [Embarcadero `System.DateUtils.DecodeDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DecodeDateTime) - documents the exact Delphi wrapper and outputs.
- [Free Pascal `DecodeDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/decodedatetime.html) - documents the compatible Free Pascal decomposition.

<small>Created 2026-07-15</small>
