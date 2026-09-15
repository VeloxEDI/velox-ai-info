---
title: "SecondOfTheHour"
description: "Returns the zero-based second index within the encoded hour."
sidebar_position: 126
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - time
  - seconds
  - hour
---

```Delphi
Function SecondOfTheHour( const AValue : TDateTime) : Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 13, 5, 7, 900);
  Value := SecondOfTheHour(InputValue); // 307
end;
```

### Usage

`SecondOfTheHour` returns the zero-based second index within the encoded hour.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Value whose minute and second fields are indexed. |

**Returns**

A `Word` from 0 through 3,599.

**Behaviour**

- The result resets at the start of every encoded hour.
- Hour, date and millisecond fields do not contribute.
- Milliseconds are discarded rather than rounded.
- No timezone conversion is performed.

**Errors**

Core decode errors propagate; no sentinel is returned.

**Usage notes**

Use `SecondOf` when only the 0-59 second component is required.

### Additional Technical Info
`SecondOfTheHour` returns the zero-based whole-second position within the encoded hour.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The installed `System.DateUtils.SecondOfTheHour` routine decodes all time fields and returns `second + minute * 60`. The DateUtils script import exposes that routine directly.

**Edge cases and quirks**

- This is an encoded field index, not a duration since a real timezone-aware hour boundary.
- Valid pre-epoch time fields decode normally.
- Invalid raw values can raise during `DecodeTime`.
- Free Pascal documents the same range and purpose.

**Side effects**

None.

**Performance and concurrency**

Constant-time decode and integer arithmetic with no shared mutable state.

**Related entries**

- [`SecondOf`](SecondOf.md) returns the second component.
- [`SecondOfTheDay`](SecondOfTheDay.md) includes the hour.

**External references**

- [Embarcadero `System.DateUtils.SecondOfTheHour`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SecondOfTheHour)
- [Free Pascal `SecondOfTheHour`](https://www.freepascal.org/docs-html/rtl/dateutils/secondofthehour.html)

<small>Created 2026-07-15</small>
