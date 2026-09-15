---
title: "EndOfTheMonth"
description: "Returns the final millisecond of the calendar month containing a supplied TDateTime value."
sidebar_position: 42
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - month
  - boundary
  - leap-year
---

```Delphi
Function EndOfTheMonth(const AValue: TDateTime): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EndOfTheMonth(EncodeDate(2028, 2, 10)); // 29 February, 23:59:59.999
end;
```

### Usage

`EndOfTheMonth` returns the final millisecond of the calendar month containing a supplied TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Supported date/time whose containing calendar month is selected; its day and time do not otherwise affect the result. |

**Returns**

The final valid calendar day of `AValue`'s month at `23:59:59.999`.

**Important usage notes**

- The input's original day and clock fields are discarded.
- The month boundary is calendar-based and timezone-neutral.
- The output is millisecond-resolution; use an exclusive next-month start for robust range predicates over higher-precision storage.
- Unsupported raw values can decode to invalid zero fields and fail in the subsequent month-length path.

**Errors**

Invalid or unsupported raw values propagate RTL conversion/range failures. Valid `TDateTime` dates do not raise.

### Additional Technical Info
`EndOfTheMonth` derives the calendar year and month from `AValue`, selects that month's final valid date and returns its final millisecond.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.EndOfTheMonth`. It decodes year/month/day, reads the month's length (including leap-year February), encodes that final day and delegates to `EndOfTheDay`.

**Side effects**

None.

**Performance and concurrency**

Constant-time field extraction, table lookup and encoding with read-only shared tables.

**Related entries**

- [`EndOfAMonth`](EndOfAMonth.md) accepts a year/month pair.
- [`EndOfTheDay`](EndOfTheDay.md) changes only the time boundary.

**External references**

- [Embarcadero `System.DateUtils.EndOfTheMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EndOfTheMonth)
- [Free Pascal `EndOfTheMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/endofthemonth.html)

<small>Created 2026-07-15</small>
