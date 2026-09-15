---
title: "DecodeTime"
description: "Writes the hour, minute, second and millisecond time-of-day components of a TDateTime value."
sidebar_position: 28
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - time
  - decoding
  - milliseconds
  - var-parameters
  - delphi
---

```Delphi
procedure DecodeTime(const DateTime: TDateTime;
  var Hour, Min, Sec, MSec: Word);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  HourValue, MinuteValue, SecondValue, MilliSecondValue: Word;
begin
  DecodeTime(EncodeTime(14, 30, 45, 125),
    HourValue, MinuteValue, SecondValue, MilliSecondValue);
  // Outputs: 14, 30, 45, 125
  Value := MilliSecondValue;
end;
```

### Usage

`DecodeTime` writes the hour, minute, second and millisecond time-of-day components of a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `DateTime` | `TDateTime`, `const` | Encoded value whose time-of-day is decoded. |
| `Hour` | `Word`, `var` | Overwritten with `0..23`. |
| `Min` | `Word`, `var` | Overwritten with `0..59`. |
| `Sec` | `Word`, `var` | Overwritten with `0..59`. |
| `MSec` | `Word`, `var` | Overwritten with `0..999`. |

**Behaviour**

All four output variables are overwritten. Date-only values return four zeros. Any calendar date combined with the same time returns the same outputs.

**Errors**

Valid finite values do not raise. Unsupported non-finite/overflowing numeric values can propagate timestamp-conversion errors.

### Additional Technical Info
`DecodeTime` decomposes a `TDateTime` value's time of day into hour, minute, second and millisecond outputs. The calendar date is ignored.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The modified PascalScript runtime registers directly to Delphi 37.0 `System.SysUtils.DecodeTime`. The RTL converts the value to `TTimeStamp`, takes its integer millisecond-of-day field, then uses division/remainder operations to split it into minutes/milliseconds and hours/minutes/seconds.

**Edge cases and quirks**

- Effective precision is one millisecond. Smaller differences in the underlying `Double` are rounded/normalised by timestamp conversion and cannot appear in the outputs.
- Negative pre-epoch `TDateTime` values use Delphi's magnitude-based fractional-time convention; timestamp conversion extracts that intended time of day rather than returning negative fields.
- The procedure performs no timezone conversion. It reports whatever wall-clock fields are encoded in the number.
- The script declaration uses `var`, while Free Pascal documentation may show `out`. Incoming output-variable values do not affect the result.
- A zero input is both a valid date epoch at midnight and a time-only midnight; all time outputs are zero in either interpretation.

**Side effects**

Only the four output variables are changed.

**Performance and concurrency**

Constant-time integer division/remainder operations with no allocation or shared state.

**Related entries**

- [`DecodeDate`](DecodeDate.md) returns calendar components.
- [`DecodeDateTime`](DecodeDateTime.md) writes all seven date/time outputs.
- [`CompareTime`](CompareTime.md) compares times through the same millisecond-scale model.

**External references**

- [Embarcadero `System.SysUtils.DecodeTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DecodeTime) - documents the exact Delphi routine.
- [Free Pascal `DecodeTime`](https://www.freepascal.org/docs-html/rtl/sysutils/decodetime.html) - documents the compatible decomposition and parameter-mode difference.

<small>Created 2026-07-15</small>
