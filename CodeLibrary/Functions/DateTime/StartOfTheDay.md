---
title: "StartOfTheDay"
description: "Returns the encoded date at midnight by truncating the supplied `TDateTime`."
sidebar_position: 137
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - day
  - midnight
  - truncation
---

```Delphi
Function StartOfTheDay( const AValue : TDateTime) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 14, 30, 5, 125);
  Value := StartOfTheDay(InputValue); // 16 July 2026 00:00:00.000
end;
```

### Usage

`StartOfTheDay` returns the encoded date at midnight by truncating the supplied `TDateTime`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Value whose time portion is removed. |

**Returns**

`Trunc(AValue)` as a `TDateTime`, representing midnight on the encoded date for valid values.

**Behaviour**

- Hour, minute, second and millisecond information is discarded.
- Ordinary valid pre-epoch values truncate to their encoded midnight integer.
- No calendar lookup, timezone conversion or clock read occurs.
- Reapplying the function to its result is idempotent.

**Errors**

No exception is expected for valid finite values. Core floating conversion behaviour applies to invalid values.

**Usage notes**

Use this for an inclusive encoded lower boundary. `EndOfTheDay` returns 23:59:59.999, not an exclusive next-day boundary.

### Additional Technical Info
`StartOfTheDay` removes the encoded time portion and returns midnight on the same encoded date.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import calls `System.DateUtils.StartOfTheDay`. The installed function consists of one raw `Trunc(AValue)` operation; it does not decode or re-encode the fields.

**Edge cases and quirks**

- This is raw floating-point truncation towards zero, relying on Delphi's `TDateTime` representation.
- The routine does not validate the raw value; arbitrary non-finite values are outside its supported contract.
- A timezone-aware concept of “day start” may differ because the encoded value has no zone or daylight-saving rules.
- Free Pascal provides the same-name operation; current Delphi source defines the exact Velox terminal.

**Side effects**

None.

**Performance and concurrency**

Constant-time truncation with no allocation, I/O or shared state.

**Related entries**

- [`EndOfTheDay`](EndOfTheDay.md) returns the day's final encoded millisecond.
- [`DateOf`](DateOf.md) uses the same raw date-part operation.

**External references**

- [Embarcadero `System.DateUtils.StartOfTheDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.StartOfTheDay)
- [Free Pascal `StartOfTheDay`](https://www.freepascal.org/docs-html/rtl/dateutils/startoftheday.html)

<small>Created 2026-07-15</small>
