---
title: "HourOfTheWeek"
description: "Returns the zero-based encoded hour index since Monday at the start of the containing ISO week."
sidebar_position: 54
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - hour
  - iso-8601
  - week
  - calendar-index
---

```Delphi
Function HourOfTheWeek(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Wednesday at 05:00: two complete days plus five hours.
  Value := HourOfTheWeek(EncodeDateTime(2026, 7, 15, 5, 0, 0, 0)); // 53
end;
```

### Usage

`HourOfTheWeek` returns the zero-based encoded hour index since Monday at the start of the containing ISO week.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose ISO weekday and hour fields are used. |

**Returns**

`HourOf(AValue) + (DayOfTheWeek(AValue) - 1) * 24`, in the range `0..167`.

**Important usage notes**

- Monday `00:00` begins at 0; Sunday `23:xx` returns 167.
- This is an encoded calendar index, not elapsed real-world hours. A daylight-saving transition does not make the week contain 167 or 169 indexed hours.
- Minutes, seconds and milliseconds are discarded.
- The week definition is fixed to ISO Monday-to-Sunday and is not locale-configurable.
- No UTC/local conversion occurs.

**Errors**

Unsupported raw values can fail during weekday/time decoding. No function catches the exception.

### Additional Technical Info
`HourOfTheWeek` returns a zero-based index within an ISO Monday-to-Sunday week. It combines the Monday-based weekday number with the current hour field.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.HourOfTheWeek`. `DayOfTheWeek` supplies Monday `1` through Sunday `7`; complete earlier weekdays contribute 24 hours each, then `HourOf` supplies the current hour.

**Side effects**

None.

**Performance and concurrency**

Constant-time field extraction and integer arithmetic with no shared state.

**Related entries**

- [`DayOfTheWeek`](DayOfTheWeek.md) supplies the ISO weekday component.
- [`EndOfTheWeek`](EndOfTheWeek.md) returns the Sunday boundary for the same week model.

**External references**

- [Embarcadero `System.DateUtils.HourOfTheWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.HourOfTheWeek)
- [Free Pascal `HourOfTheWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/houroftheweek.html)

<small>Created 2026-07-15</small>
