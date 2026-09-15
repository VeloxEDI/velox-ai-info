---
title: "MinuteOfTheHour"
description: "Returns the minute-within-hour component as an exact alias of `MinuteOf`."
sidebar_position: 95
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
Function MinuteOfTheHour(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 42, 30, 0);
  Value := MinuteOfTheHour(InputValue); // 42
end;
```

### Usage

`MinuteOfTheHour` returns the minute-within-hour component as an exact alias of `MinuteOf`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose minute-within-hour field is required. |

**Returns**

A `Word` in the inclusive range 0 through 59.

**Behaviour**

- Results are identical to `MinuteOf` for every input.
- Seconds and milliseconds are ignored rather than rounded into the next minute.
- Date and hour values do not affect the returned component.
- No timezone conversion occurs.

**Important usage notes**

- This name does not mean minutes elapsed since a particular hour boundary in real time; it exposes an encoded field.
- Invalid or non-finite input can raise during decoding.

**Usage notes**

Use this alias where the `...OfTheHour` naming makes a family of field expressions easier to read.

### Additional Technical Info
`MinuteOfTheHour` returns the encoded minute-within-hour field from 0 through 59. It is an exact implementation alias of `MinuteOf`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MinuteOfTheHour`. That routine returns `MinuteOf(AValue)` without further calculation; `MinuteOf` obtains the field through `DecodeTime`.

**Side effects**

None.

**Errors**

Velox does not catch or translate decode exceptions.

**Performance and concurrency**

Constant-time delegation and decoding with no external I/O or shared mutable state.

**Related entries**

- [`MinuteOf`](MinuteOf.md) is the exact implementation target.
- [`MinuteOfTheDay`](MinuteOfTheDay.md) includes the hour position within the day.

**External references**

- [Embarcadero `System.DateUtils.MinuteOfTheHour`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MinuteOfTheHour)
- [Free Pascal `MinuteOfTheHour`](https://www.freepascal.org/docs-html/rtl/dateutils/minuteofthehour.html)

<small>Created 2026-07-15</small>
