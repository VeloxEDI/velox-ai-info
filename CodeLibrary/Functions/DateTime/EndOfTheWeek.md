---
title: "EndOfTheWeek"
description: "Returns the final millisecond of the Sunday ending the ISO week that contains a supplied TDateTime value."
sidebar_position: 43
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - iso-8601
  - week
  - sunday
  - boundary
---

```Delphi
Function EndOfTheWeek(const AValue: TDateTime): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Saturday 18 July 2026 belongs to the week ending Sunday 19 July.
  Value := EndOfTheWeek(EncodeDate(2026, 7, 18));
end;
```

### Usage

`EndOfTheWeek` returns the final millisecond of the Sunday ending the ISO week that contains a supplied TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Supported date/time used to identify the containing ISO Monday-to-Sunday week. Its time is ignored. |

**Returns**

The week-ending Sunday at `23:59:59.999`. The result can fall in a different calendar month or year from `AValue`.

**Important usage notes**

- The week is ISO Monday-to-Sunday, not a locale-configurable or Sunday-to-Saturday week.
- A date near a month/year boundary can produce an end date in the next month/year.
- The clock portion of `AValue` does not affect week membership.
- This operation returns the true Sunday week boundary. By contrast, `EndOfAWeek` can end any explicitly supplied weekday.
- The final-millisecond and timezone-neutral caveats for other `EndOf...` functions also apply.

**Errors**

Unsupported or non-finite raw values can fail during weekday/date decoding. No Velox handler is present.

### Additional Technical Info
`EndOfTheWeek` returns Sunday at `23:59:59.999` for the ISO week containing `AValue`. ISO weeks start on Monday and end on Sunday.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.EndOfTheWeek`. The terminal truncates `AValue` to its date, subtracts `DayOfTheWeek(AValue) - 1` to reach Monday, adds six whole days, then applies `EndOfTheDay`.

**Side effects**

None.

**Performance and concurrency**

Constant bounded calendar arithmetic with no shared mutable state.

**Related entries**

- [`EndOfAWeek`](EndOfAWeek.md) accepts explicit ISO week fields and a required selected weekday.
- [`DayOfTheWeek`](DayOfTheWeek.md) supplies the Monday-based weekday number used internally.

**External references**

- [Embarcadero `System.DateUtils.EndOfTheWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EndOfTheWeek)
- [Free Pascal `EndOfTheWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/endoftheweek.html)

<small>Created 2026-07-15</small>
