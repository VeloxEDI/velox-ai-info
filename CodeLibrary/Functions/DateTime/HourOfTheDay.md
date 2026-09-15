---
title: "HourOfTheDay"
description: "Returns the zero-based hour elapsed within the encoded day as an exact alias of HourOf."
sidebar_position: 52
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - hour
  - alias
---

```Delphi
Function HourOfTheDay(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := HourOfTheDay(EncodeTime(23, 59, 59, 999)); // 23
end;
```

### Usage

`HourOfTheDay` returns the zero-based hour elapsed within the encoded day as an exact alias of HourOf.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose hour-of-day component is returned. |

**Returns**

A `Word` in `0..23`. Fractions within the current hour are discarded because the result is the hour field, not a fractional duration.

**Important usage notes**

- Despite the “hours since start of day” wording sometimes used for this family, this entry is exactly the 24-hour clock component.
- It does not round: `00:59:59.999` returns `0`.
- It reads no timezone and does not distinguish UTC from local values.
- All valid pre-epoch behaviour is identical to `HourOf`.

**Errors**

Unsupported raw values can fail in `DecodeTime`; no handler is present.

### Additional Technical Info
`HourOfTheDay` returns the complete zero-based hour within a day. In the installed Delphi implementation it is an inline alias of `HourOf`, so both functions have the same result and edge behaviour.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.HourOfTheDay`. The RTL implementation delegates exactly to `HourOf(AValue)`, which calls `DecodeTime` and returns its hour output.

**Side effects**

None.

**Performance and concurrency**

Constant-time extraction with no allocation or shared state.

**Related entries**

- [`HourOf`](HourOf.md) is the exact terminal alias target.
- [`HourOfTheMonth`](HourOfTheMonth.md) adds complete prior days in the month.

**External references**

- [Embarcadero `System.DateUtils.HourOfTheDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.HourOfTheDay)
- [Free Pascal `HourOfTheDay`](https://www.freepascal.org/docs-html/rtl/dateutils/houroftheday.html)

<small>Created 2026-07-15</small>
