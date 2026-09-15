---
title: "SecondOfTheMinute"
description: "Returns the second-within-minute component as an exact alias of `SecondOf`."
sidebar_position: 127
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - time
  - second
  - minute
  - alias
---

```Delphi
Function SecondOfTheMinute( const AValue : TDateTime) : Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 13, 5, 7, 900);
  Value := SecondOfTheMinute(InputValue); // 7
end;
```

### Usage

`SecondOfTheMinute` returns the second-within-minute component as an exact alias of `SecondOf`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose second field is required. |

**Returns**

A `Word` from 0 through 59.

**Behaviour**

- Results are identical to `SecondOf` for every valid input.
- Milliseconds are discarded rather than rounded.
- Date, hour and minute fields do not change the returned component.
- No timezone or locale processing occurs.

**Errors**

Invalid encoded date/time input can raise an error.

**Usage notes**

Prefer whichever name makes the script clearest; there is no semantic difference between this function and `SecondOf`.

### Additional Technical Info
`SecondOfTheMinute` returns the second-within-minute field. In the installed Delphi implementation it is an exact alias of `SecondOf`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to `System.DateUtils.SecondOfTheMinute`. That function immediately returns `SecondOf(AValue)`, which decodes the time and selects the second field.

**Edge cases and quirks**

- The name describes the component boundary; it does not calculate elapsed seconds.
- Leap seconds are unsupported.
- Decode failures propagate.
- Free Pascal provides the same-name routine with the same component meaning.

**Side effects**

None.

**Performance and concurrency**

Constant-time alias call and decode with no shared state.

**Related entries**

- [`SecondOf`](SecondOf.md) is the delegated target.
- [`SecondOfTheHour`](SecondOfTheHour.md) returns a wider index.

**External references**

- [Embarcadero `System.DateUtils.SecondOfTheMinute`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SecondOfTheMinute)
- [Free Pascal `SecondOfTheMinute`](https://www.freepascal.org/docs-html/rtl/dateutils/secondoftheminute.html)

<small>Created 2026-07-15</small>
