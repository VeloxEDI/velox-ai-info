---
title: "MinuteOf"
description: "Returns the encoded minute-within-hour component from 0 through 59."
sidebar_position: 93
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - minutes
  - component
---

```Delphi
Function MinuteOf(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 42, 30, 0);
  Value := MinuteOf(InputValue); // 42
end;
```

### Usage

`MinuteOf` returns the encoded minute-within-hour component from 0 through 59.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose minute component is required. |

**Returns**

A `Word` in the inclusive range 0 through 59.

**Behaviour**

- Date, hour, second and millisecond fields do not change the returned component.
- The value resets to zero at the next encoded hour.
- Decoding is sign-aware for valid pre-epoch values.
- No timezone conversion or locale setting is involved.

**Important usage notes**

- Smaller fields are discarded, not rounded. For example, `09:42:59.999` still returns 42.
- The result is not a total number of minutes since midnight or since another value.
- Invalid or non-finite encoded input can raise during decoding instead of returning a sentinel.

**Usage notes**

Use `MinuteOfTheDay`, `MinuteOfTheWeek`, `MinuteOfTheMonth` or `MinuteOfTheYear` when a larger calendar-relative index is required.

### Additional Technical Info
`MinuteOf` returns the minute-within-hour component encoded in a `TDateTime`. It extracts a field from one value; it does not calculate elapsed minutes.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MinuteOf`. It calls `DecodeTime`, retains the minute output and discards the decoded hour, second and millisecond fields.

**Side effects**

None.

**Errors**

Velox does not catch or translate date/time decode exceptions.

**Performance and concurrency**

Constant-time component decoding with no external I/O or shared mutable state.

**Related entries**

- [`MinuteOfTheHour`](MinuteOfTheHour.md) is an exact alias.
- [`MinuteOfTheDay`](MinuteOfTheDay.md) includes the encoded hour position.

**External references**

- [Embarcadero `System.DateUtils.MinuteOf`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MinuteOf)
- [Free Pascal `MinuteOf`](https://www.freepascal.org/docs-html/rtl/dateutils/minuteof.html)

<small>Created 2026-07-15</small>
