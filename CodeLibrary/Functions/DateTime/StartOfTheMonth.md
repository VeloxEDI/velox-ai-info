---
title: "StartOfTheMonth"
description: "Returns midnight on the first day of the supplied value's encoded calendar month."
sidebar_position: 138
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - month
  - midnight
  - boundary
---

```Delphi
Function StartOfTheMonth( const AValue : TDateTime) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 14, 30, 5, 125);
  Value := StartOfTheMonth(InputValue); // 1 July 2026 00:00:00.000
end;
```

### Usage

`StartOfTheMonth` returns midnight on the first day of the supplied value's encoded calendar month.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Value that supplies the calendar year and month. |

**Returns**

An encoded `TDateTime` for the first day of the decoded month at midnight.

**Behaviour**

- All clock fields and the original day-of-month are discarded.
- Calendar month/year fields are decoded correctly for valid pre-epoch values.
- No timezone or locale operation is performed.
- Reapplying the function is idempotent.

**Errors**

Decode or encode exceptions propagate unchanged.

**Usage notes**

Use `StartOfAMonth` when the year and month are supplied independently.

### Additional Technical Info
`StartOfTheMonth` returns midnight on day one of the calendar month encoded by `AValue`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to `System.DateUtils.StartOfTheMonth`. Delphi decodes year, month and day from `AValue`, discards the original day, then calls `EncodeDate(decodedYear, decodedMonth, 1)`.

**Edge cases and quirks**

- The boundary is encoded calendar midnight, not a timezone-aware instant.
- Invalid or non-finite raw input can raise while decoding.
- Free Pascal describes the compatible calendar boundary; installed Delphi's decode/encode chain governs Velox.

**Side effects**

None.

**Performance and concurrency**

Constant-time field decoding and date encoding with no I/O.

**Related entries**

- [`StartOfAMonth`](StartOfAMonth.md) constructs a supplied month.
- [`EndOfTheMonth`](EndOfTheMonth.md) returns the final encoded millisecond.

**External references**

- [Embarcadero `System.DateUtils.StartOfTheMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.StartOfTheMonth)
- [Free Pascal `StartOfTheMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/startofthemonth.html)

<small>Created 2026-07-15</small>
