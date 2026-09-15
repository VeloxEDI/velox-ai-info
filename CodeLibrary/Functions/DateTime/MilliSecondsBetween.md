---
title: "MilliSecondsBetween"
description: "Returns the absolute complete-millisecond distance between two values after Delphi timestamp normalisation."
sidebar_position: 91
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - milliseconds
  - interval
---

```Delphi
Function MilliSecondsBetween(const ANow, AThen: TDateTime): Int64
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 7, 18, 9, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 7, 18, 9, 0, 1, 250);
  Value := MilliSecondsBetween(FirstValue, SecondValue); // 1250
end;
```

### Usage

`MilliSecondsBetween` returns the absolute complete-millisecond distance between two values after Velox timestamp normalisation.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First encoded date/time. The name does not require it to be the current or later value. |
| `AThen` | `TDateTime`, `const` | Second encoded date/time. Argument order does not affect the result. |

**Returns**

The non-negative absolute distance in complete milliseconds as an `Int64`. Equal values return zero.

**Behaviour**

- Reversing the arguments produces the same result; direction is discarded.
- Timestamp normalisation makes valid pre-epoch and cross-epoch comparisons chronological rather than relying on raw `Double` subtraction.
- The result has millisecond resolution. It does not preserve a sub-millisecond fraction.
- The calculation does not consult a timezone, daylight-saving rule or leap-second table.

**Important usage notes**

- A manually calculated input with finer-than-millisecond precision is rounded according to Velox's `DateTimeToTimeStamp` conversion before subtraction.
- `ANow` and `AThen` are conventional names only. The function does not check which value is later.
- The result is an absolute interval and cannot be used to determine ordering.
- It measures differences between untagged encoded values. If two values represent different timezone conventions, the caller must normalise them first.

**Usage notes**

Use `MilliSecondsBetween` for whole-millisecond chronology, especially when pre-epoch dates are possible. Use `MilliSecondSpan` only when its raw floating-point span semantics are specifically acceptable.

### Additional Technical Info
`MilliSecondsBetween` returns the absolute chronological distance between two encoded date/time values as a whole number of milliseconds. Both inputs are normalised through Delphi's timestamp representation before subtraction, which is important for dates before the `TDateTime` epoch.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MilliSecondsBetween`. Each input passes through `DateTimeToTimeStamp`; the timestamp date and time fields are combined into a chronological `Int64` millisecond value, subtracted, and wrapped in `Abs`.

**Side effects**

None.

**Errors**

Invalid or non-finite encoded input can raise during timestamp conversion. Velox does not catch or translate the exception.

**Performance and concurrency**

Constant-time timestamp conversion and 64-bit arithmetic with no external I/O or shared mutable state.

**Related entries**

- [`MilliSecondSpan`](MilliSecondSpan.md) returns a fractional result but uses raw `TDateTime` subtraction.
- [`MinutesBetween`](MinutesBetween.md) truncates the same timestamp-normalised distance to complete minutes.

**External references**

- [Embarcadero `System.DateUtils.MilliSecondsBetween`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MilliSecondsBetween)
- [Free Pascal `MilliSecondsBetween`](https://www.freepascal.org/docs-html/rtl/dateutils/millisecondsbetween.html)

<small>Created 2026-07-15</small>
