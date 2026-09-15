---
title: "DateTimeToUnix"
description: "Converts a TDateTime value to a rounded signed count of seconds from the Unix epoch using Velox's timezone-neutral arithmetic."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - unix-time
  - epoch
  - timezone
  - rounding
---

```Delphi
function DateTimeToUnix(D: TDateTime): Int64;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DateTimeToUnix(EncodeDate(1970, 1, 2)); // 86400
end;
```

### Usage

`DateTimeToUnix` converts a TDateTime value to a rounded signed count of seconds from the Unix epoch using Velox's timezone-neutral arithmetic.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `D` | `TDateTime` | Date/time value to treat as a timezone-neutral point on the Unix-epoch scale. |

**Returns**

An `Int64` calculated as `Round((D - 25569) * 86400)`. Epoch midnight returns `0`; earlier values return negative seconds and later values return positive seconds.

**Behaviour**

The result is a mathematical conversion of the supplied number. To produce a conventional UTC Unix timestamp, `D` must already represent UTC. Supplying a local wall-clock value simply labels that clock reading as though it were on the same timezone-neutral scale.

**Errors**

There is no function-level error handling. Numeric conversion exceptions propagate into the script.

### Additional Technical Info
`DateTimeToUnix` converts the supplied Delphi day count to signed seconds relative to `1970-01-01 00:00:00`. The Velox-exposed entry is a custom PascalScript helper. It does **not** call the similarly named Delphi `System.DateUtils` function and it does not convert local time to UTC.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The modified PascalScript compile unit exposes the one-argument signature. Its matching runtime unit registers a Velox/PascalScript-owned helper whose complete formula subtracts the Delphi day number of the Unix epoch (`25569`), converts days to seconds (`86400` per day), then calls Delphi `Round`.

This differs materially from installed Delphi 37.0 `System.DateUtils.DateTimeToUnix(const AValue; AInputIsUTC)`. The Delphi routine can convert a local value to UTC when asked and uses whole-second `SecondsBetween` semantics. Velox exposes neither that overload nor its Boolean argument.

**Edge cases and quirks**

- Fractions of a second are rounded to the nearest integer, not truncated. Delphi `Round` uses ties-to-even (banker's rounding), so exact half-second values can round up or down according to the neighbouring even integer.
- The custom implementation has no daylight-saving ambiguity handling and no `AInputIsUTC` option. Convert local values explicitly before calling it.
- Dates before 1970 produce negative values. Rounding around the epoch is symmetric according to `Round`, not floor-towards-negative-infinity.
- Timed values before 30 December 1899 expose a further Velox-specific defect. Delphi stores a pre-epoch time as the magnitude of a negative fraction, but this helper subtracts the raw `Double` directly. For example, a pre-epoch `06:00` value is treated as another quarter-day into the past rather than a quarter-day after that date's midnight. The result is therefore not a correct chronological Unix timestamp for such timed values. Date-only midnights are not affected by this fractional-time defect.
- Floating-point representation can move a nominal half-second slightly away from the tie. Do not depend on a decimal half being represented exactly after previous arithmetic.
- Extremely large or non-finite values can exceed `Int64`/`Round` range and propagate a numeric exception.
- The linked official pages document upstream routines with an optional timezone flag. They are comparison references, not the terminal implementation used by this Velox entry.

**Side effects**

None. In particular, the function does not read the host timezone or clock.

**Performance and concurrency**

Constant-time floating/integer arithmetic with no allocation or shared state.

**Remarks**

Record whether a `TDateTime` variable represents UTC or local time in the surrounding integration design. The type cannot enforce that distinction.

**Related entries**

- [`DateUTC`](DateUTC.md) returns the current UTC date, but discards the current time.
- [`DateTimeToModifiedJulianDate`](DateTimeToModifiedJulianDate.md) uses fractional days and a different epoch.

**External references**

- [Embarcadero `System.DateUtils.DateTimeToUnix`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DateTimeToUnix) - documents the Delphi routine whose overload and truncation/timezone behaviour differ from the Velox helper.
- [Free Pascal `DateTimeToUnix`](https://www.freepascal.org/daily/doc/rtl/dateutils/datetimetounix.html) - documents the compatible upstream concept with an `AInputIsUTC` argument not exposed here.

<small>Created 2026-07-15</small>
