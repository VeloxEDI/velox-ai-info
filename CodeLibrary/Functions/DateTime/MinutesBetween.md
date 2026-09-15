---
title: "MinutesBetween"
description: "Returns the absolute number of complete minutes between two timestamp-normalised values."
sidebar_position: 99
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - minutes
  - interval
---

```Delphi
Function MinutesBetween(const ANow, AThen: TDateTime): Int64
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 7, 18, 9, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 7, 18, 9, 1, 30, 0);
  Value := MinutesBetween(FirstValue, SecondValue); // 1
end;
```

### Usage

`MinutesBetween` returns the absolute number of complete minutes between two timestamp-normalised values.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First encoded date/time. It need not be current or later. |
| `AThen` | `TDateTime`, `const` | Second encoded date/time. Argument order does not affect the result. |

**Returns**

The non-negative count of complete minutes as an `Int64`. Equal values and intervals shorter than one minute return zero.

**Behaviour**

- Argument order is ignored because the difference is absolute.
- Partial minutes are truncated, not rounded. A span of 1 minute 59.999 seconds returns 1.
- Timestamp normalisation supports valid timed pre-epoch and cross-epoch values correctly at millisecond resolution.
- No timezone or daylight-saving conversion is applied.

**Important usage notes**

- The function cannot indicate which input is later.
- Sub-millisecond fractions are rounded during timestamp conversion before integer division.
- The names `ANow` and `AThen` are conventional and do not impose ordering.
- Values encoded under different timezone conventions must be normalised by the caller before comparison.

**Usage notes**

Use `MinuteSpan` when a fractional-minute result is required and its raw pre-epoch limitation is acceptable.

### Additional Technical Info
`MinutesBetween` returns the absolute number of complete 60,000-millisecond periods between two encoded date/time values. The inputs are normalised through Delphi timestamps before subtraction, and any partial minute is discarded.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MinutesBetween`. Each input is converted to a chronological `Int64` millisecond value through `DateTimeToTimeStamp`; the absolute difference is then divided by 60,000 using integer division.

**Side effects**

None.

**Errors**

Invalid or non-finite input can raise during timestamp conversion. Velox does not catch or translate the exception.

**Performance and concurrency**

Constant-time timestamp conversion and 64-bit integer arithmetic with no shared mutable state.

**Related entries**

- [`MinuteSpan`](MinuteSpan.md) returns a fractional raw span.
- [`MilliSecondsBetween`](MilliSecondsBetween.md) returns the underlying whole-millisecond distance.

**External references**

- [Embarcadero `System.DateUtils.MinutesBetween`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MinutesBetween)
- [Free Pascal `MinutesBetween`](https://www.freepascal.org/docs-html/rtl/dateutils/minutesbetween.html)

<small>Created 2026-07-15</small>
