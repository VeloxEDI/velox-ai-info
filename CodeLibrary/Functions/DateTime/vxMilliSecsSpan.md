---
title: "vxMilliSecsSpan"
description: "Returns the signed millisecond-of-day difference from the first encoded time to the second, ignoring both dates."
sidebar_position: 159
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
  - signed
---

```Delphi
Function vxMilliSecsSpan(const ANow, AThen: TDateTime): Int64
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstTime, SecondTime: TDateTime;
begin
  FirstTime := EncodeTime(9, 0, 0, 0);
  SecondTime := EncodeTime(9, 0, 1, 250);
  Value := vxMilliSecsSpan(FirstTime, SecondTime); // 1250
end;
```

### Usage

`vxMilliSecsSpan` returns the signed millisecond-of-day difference from the first encoded time to the second, ignoring both dates.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First value; only its decoded time-of-day is used. |
| `AThen` | `TDateTime`, `const` | Second value; only its decoded time-of-day is used. |

**Returns**

`millisecondsOfDay(AThen) - millisecondsOfDay(ANow)` as an `Int64`. The practical result range for valid times is `-86,399,999..86,399,999`.

**Behaviour**

- Argument order matters; reversing the inputs negates the result.
- Dates are ignored even when the values are on different calendar days.
- Resolution is one decoded millisecond.

**Errors**

No Velox exception handling surrounds decoding. Invalid or non-finite `TDateTime` input can fail in the RTL.

### Additional Technical Info
`vxMilliSecsSpan` subtracts the first input's millisecond-of-day index from the second input's index. It is signed and deliberately ignores the calendar date portion of both values.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The Velox date-tools import binds to `vxDateTools.vxMilliSecsSpan`. It calls `System.SysUtils.DecodeTime` for each input, calculates `hour*3,600,000 + minute*60,000 + second*1,000 + millisecond`, and subtracts the two `Int64` totals.

**Edge cases and quirks**

- This is not equivalent to `MilliSecondsBetween`. The latter is absolute, date-aware and timestamp-normalised.
- A normal midnight crossing is not inferred. From 23:59 to 00:01 the function returns a large negative value, not positive two minutes.
- `ANow` and `AThen` are conventional names only; no clock is read and no ordering is enforced.
- `DecodeTime` normalises valid pre-epoch representations before extracting fields, but the date is then discarded.
- Inputs with different timezone conventions are compared only as displayed clock fields.

**Side effects**

None.

**Performance and concurrency**

Constant-time decoding and integer arithmetic with no allocation or shared state.

**Related entries**

- [`MilliSecondsBetween`](MilliSecondsBetween.md) returns an absolute chronological interval including dates.
- [`MilliSecondSpan`](MilliSecondSpan.md) returns a fractional absolute raw span.
- [`MilliSecondOfTheDay`](MilliSecondOfTheDay.md) returns one unsigned millisecond-of-day index.

**External references**

The Velox algorithm is custom; these pages document the terminal time decoder used by it:

- [Embarcadero `System.SysUtils.DecodeTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DecodeTime)
- [Free Pascal `DecodeTime`](https://www.freepascal.org/docs-html/rtl/sysutils/decodetime.html)

<small>Created 2026-07-15</small>
