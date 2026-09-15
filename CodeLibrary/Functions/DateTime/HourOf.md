---
title: "HourOf"
description: "Extracts the zero-based hour-of-day component from a TDateTime value."
sidebar_position: 51
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - hour
  - extraction
---

```Delphi
Function HourOf(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := HourOf(EncodeTime(14, 30, 45, 0)); // 14
end;
```

### Usage

`HourOf` extracts the zero-based hour-of-day component from a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose hour field is extracted. |

**Returns**

A `Word` in `0..23`. Midnight returns `0`; values from 23:00 through 23:59:59.999 return `23`.

**Important usage notes**

- The function returns a component, not elapsed hours and not a 1-based clock value.
- It performs no timezone conversion; the result is the hour already encoded in `AValue`.
- The decode path handles valid negative pre-epoch `TDateTime` values according to Velox's special sign convention.
- Sub-millisecond fractions do not change the hour except where timestamp rounding crosses an hour boundary.

**Errors**

Unsupported or non-finite raw values can fail during timestamp conversion. No function catches the exception.

### Additional Technical Info
`HourOf` returns the hour field encoded in a `TDateTime`, using 24-hour numbering from `0` through `23`. The calendar date does not affect the result.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.HourOf`. The terminal calls `DecodeTime`, writes the hour into the function result and discards the decoded minute, second and millisecond fields. `DecodeTime` converts through Delphi's millisecond timestamp representation.

**Side effects**

None.

**Performance and concurrency**

Constant-time field extraction with no allocation or shared state.

**Related entries**

- [`HourOfTheDay`](HourOfTheDay.md) is an exact alias.
- [`HourOfTheWeek`](HourOfTheWeek.md) combines this component with the ISO weekday.

**External references**

- [Embarcadero `System.DateUtils.HourOf`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.HourOf)
- [Free Pascal `HourOf`](https://www.freepascal.org/docs-html/rtl/dateutils/hourof.html)

<small>Created 2026-07-15</small>
