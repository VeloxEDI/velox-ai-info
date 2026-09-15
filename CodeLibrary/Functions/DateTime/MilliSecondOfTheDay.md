---
title: "MilliSecondOfTheDay"
description: "Returns the zero-based millisecond index within the encoded day."
sidebar_position: 84
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - milliseconds
  - component
---

```Delphi
Function MilliSecondOfTheDay(const AValue: TDateTime): LongWord
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 1, 2, 3, 4);
  Value := MilliSecondOfTheDay(InputValue); // 3723004
end;
```

### Usage

`MilliSecondOfTheDay` returns the zero-based millisecond index within the encoded day.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose time-of-day fields are inspected. |

**Returns**

A `LongWord` in the inclusive range 0 through 86,399,999.

**Behaviour**

- The date component does not affect the result.
- The value resets to zero at the next encoded midnight.
- Decoding is sign-aware for valid pre-epoch `TDateTime` values, so the returned field position remains non-negative.
- The routine extracts encoded wall-clock fields; it does not consult or convert a timezone.

**Important usage notes**

- Velox decodes to millisecond resolution. Any finer binary fraction in a manually calculated `TDateTime` is subject to the runtime's timestamp rounding.
- The result is not “milliseconds elapsed since” another instant and does not account for daylight-saving gaps, repeats or leap seconds.
- Invalid or non-finite encoded input can raise during decoding rather than returning a sentinel.
- Use an interval routine when the requirement is a duration; component indices wrap at their documented boundary.

**Errors**

Velox performs no validation or exception translation. Date/time decode exceptions propagate to the script.

### Additional Technical Info
`MilliSecondOfTheDay` returns the zero-based millisecond index within the encoded day. It is a position within the encoded day, not an elapsed-duration measurement between two values.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MilliSecondOfTheDay`. It decodes the time fields and returns `millisecond + 1,000 * (second + 60 * (minute + 60 * hour))`.

**Side effects**

None.

**Performance and concurrency**

Constant-time component decoding and integer arithmetic with no external I/O or shared mutable state.

**Remarks**

This function is suitable for sorting, bucketing or formatting by encoded day position. Preserve the surrounding date/time fields when the value must identify an instant.

**Related entries**

- [`MilliSecondOf`](MilliSecondOf.md) returns only the 0–999 field within a second.
- [`IncMilliSecond`](IncMilliSecond.md) adjusts an encoded value by a signed millisecond count.

**External references**

- [Embarcadero `System.DateUtils.MilliSecondOfTheDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MilliSecondOfTheDay)
- [Free Pascal `MilliSecondOfTheDay`](https://www.freepascal.org/docs-html/rtl/dateutils/millisecondoftheday.html)

<small>Created 2026-07-15</small>
