---
title: "MonthOfTheYear"
description: "Returns the decoded calendar month number as an exact alias of `MonthOf`."
sidebar_position: 105
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - month
  - component
---

```Delphi
Function MonthOfTheYear(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 30, 0, 0);
  Value := MonthOfTheYear(InputValue); // 7
end;
```

### Usage

`MonthOfTheYear` returns the decoded calendar month number as an exact alias of `MonthOf`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose calendar month component is required. |

**Returns**

A `Word` from 1 through 12, identical to `MonthOf(AValue)`.

**Behaviour**

- Results are identical to `MonthOf` for every input.
- The time-of-day and day-of-month fields do not affect the returned month.
- Valid pre-epoch values are decoded correctly.
- No locale or timezone conversion occurs.

**Important usage notes**

- Despite the `...OfTheYear` name, the result is not a zero-based position and is not a count of months elapsed; January returns 1.
- Invalid or non-finite input can raise during date decoding.

**Usage notes**

Use either alias according to the naming pattern that best communicates the surrounding expression.

### Additional Technical Info
`MonthOfTheYear` returns the one-based calendar month number encoded in a `TDateTime`. It is an exact implementation alias of `MonthOf`, provided for consistency with the other `...OfTheYear` entries.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MonthOfTheYear`. The terminal consists of a direct call to `MonthOf`, which extracts the month through `DecodeDate`.

**Side effects**

None.

**Errors**

Date decode exceptions propagate unchanged from Delphi.

**Performance and concurrency**

Constant-time delegation and calendar decoding with no shared mutable state.

**Related entries**

- [`MonthOf`](MonthOf.md) is the exact implementation target.
- [`MinuteOfTheYear`](MinuteOfTheYear.md) is a zero-based position within the year, unlike this one-based component.

**External references**

- [Embarcadero `System.DateUtils.MonthOfTheYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MonthOfTheYear)
- [Free Pascal `MonthOfTheYear`](https://www.freepascal.org/docs-html/rtl/dateutils/monthoftheyear.html)

<small>Created 2026-07-15</small>
