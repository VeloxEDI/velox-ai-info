---
title: "Duration"
description: "Formats a Velox-specific approximate date/time separation as non-zero year, month, day, time and optional millisecond components."
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - duration
  - approximation
  - milliseconds
---

```Delphi
Function Duration(aNow, aThen: TDateTime; ShowMsecs: Boolean): String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  LaterValue, EarlierValue: TDateTime;
begin
  LaterValue := EncodeDateTime(2026, 1, 1, 0, 0, 0, 0);
  EarlierValue := EncodeDateTime(2025, 12, 31, 23, 59, 58, 750);
  Value := Duration(LaterValue, EarlierValue, True); // '1sec 250ms'
end;
```

### Usage

`Duration` formats a Velox-specific approximate date/time separation as non-zero year, month, day, time and optional millisecond components.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aNow` | `TDateTime` | Intended later endpoint of the interval. Velox does not validate that it is later. |
| `aThen` | `TDateTime` | Intended earlier endpoint. Year and month adjustments are applied forward from this value. |
| `ShowMsecs` | `Boolean` | When `True`, appends a non-zero millisecond component. The script declaration requires this argument even though the Velox helper declares a default of `False`. |

**Returns**

A space-separated string containing only non-zero components, using `yr`/`yrs`, `month`/`months`, `day`/`days`, `hr`/`hrs`, `min`/`mins`, `sec`/`secs` and `ms`. A zero interval returns `0secs`. If the only non-zero component is milliseconds and `ShowMsecs` is `False`, the result is also `0secs`.

**Errors**

There is no Velox exception handler. Invalid, non-finite or out-of-range raw `TDateTime` values can propagate conversion or arithmetic exceptions from the Velox helpers.

**Usage notes**

Use `HoursBetween`, `HourSpan` or another single-unit operation when a machine-readable duration is required. Treat this function as display text with a known approximation model, not as a value to parse back into an exact interval.

### Additional Technical Info
`Duration` builds a compact English string from Velox's custom decomposition of two `TDateTime` values. It is intended for `aNow` at or after `aThen`; it is not a general calendar interval type and its year/month components use average-length approximations.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The Velox date-tools wrapper performs this exact sequence:

1. `YearsBetween(aNow, aThen)` computes complete average-length years using a 365.25-day divisor.
2. `MonthsBetween(aNow, aThen) mod 12` independently computes complete average-length months using a 30.4375-day divisor.
3. It advances `aThen` by the calculated months and then years using `IncMonth`/`IncYear`.
4. `DaySpan` calculates the absolute raw `TDateTime` difference between that adjusted value and `aNow`.
5. `Trunc` supplies the day count and `DecodeTime(Frac(...))` supplies hour through millisecond fields.
6. Conditional string fragments are concatenated and trailing whitespace is removed.

The function has no locale-aware pluralisation or translated labels.

**Edge cases and quirks**

- The operation is not symmetric. The year/month adjustment is always applied forward to `aThen`. Reversing endpoints can produce a much larger day component; pass the later value first.
- Years and months are approximate elapsed units, not calendar anniversary counts. The two counts are derived independently from the original endpoints, so boundary cases can appear surprising. For example, a 365-day span can be represented as approximately 11 months plus residual days rather than one year.
- Direction is discarded by all of the span helpers. The returned text never says whether `aNow` is before or after `aThen`.
- `DaySpan` subtracts the raw `Double` representation. For timed values on different dates before 30 December 1899, or a timed interval spanning that epoch, Delphi's negative-date convention makes that raw subtraction chronologically wrong. The formatted residual can therefore be wrong for historical timestamps.
- The values are timezone-neutral. Daylight-saving transitions are not applied; two local wall-clock values are treated only as encoded numbers.
- Components whose value is zero are omitted. There are no commas, and milliseconds are printed immediately after the preceding space as, for example, `250ms`.
- Sub-millisecond values are reduced through `DecodeTime`'s millisecond-resolution timestamp conversion.

**Side effects**

None. The function does not read the system clock, timezone or locale.

**Performance and concurrency**

The work is bounded calendar arithmetic plus allocation of the result string. It uses no shared mutable state and is safe to call concurrently with valid values.

**Related entries**

- [`DaySpan`](DaySpan.md) supplies the fractional-day residual used internally.
- [`HoursBetween`](HoursBetween.md) returns complete hours without building display text.

**External references**

- [Embarcadero `System.DateUtils.YearsBetween`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.YearsBetween)
- [Free Pascal `YearsBetween`](https://www.freepascal.org/docs-html/rtl/dateutils/yearsbetween.html) - Free Pascal also documents an `AExact` option that Velox's Delphi terminal does not expose.
- [Embarcadero `System.DateUtils.MonthsBetween`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MonthsBetween)
- [Free Pascal `MonthsBetween`](https://www.freepascal.org/docs-html/rtl/dateutils/monthsbetween.html) - Free Pascal also declares an `AExact` option; Velox's Delphi terminal exposes only the two-endpoint approximate form.
- [Embarcadero `System.DateUtils.DaySpan`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DaySpan)
- [Free Pascal `DaySpan`](https://www.freepascal.org/docs-html/rtl/dateutils/dayspan.html)
- [Embarcadero `System.SysUtils.DecodeTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DecodeTime)
- [Free Pascal `DecodeTime`](https://www.freepascal.org/docs-html/rtl/sysutils/decodetime.html)

<small>Created 2026-07-15</small>
