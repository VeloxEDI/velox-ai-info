---
title: "SecondOf"
description: "Returns the encoded second-within-minute component from 0 through 59."
sidebar_position: 124
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - second
  - component
---

```Delphi
Function SecondOf( const AValue : TDateTime) : Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 9, 42, 56, 250);
  Value := SecondOf(InputValue); // 56
end;
```

### Usage

`SecondOf` returns the encoded second-within-minute component from 0 through 59.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose second field is required. |

**Behaviour**

- Milliseconds do not round or change the result.
- Date fields are ignored.
- Valid pre-epoch values are handled by Velox's sign-aware time decoder.
- No timezone or locale conversion occurs.

**Errors**

Velox adds no validation or exception translation. Decode errors propagate.

**Usage notes**

Use `SecondOfTheMinute` for the exact alias, or `SecondOfTheDay` for a zero-based day index.

### Additional Technical Info
`SecondOf` extracts the encoded second-within-minute field from a `TDateTime`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import calls Delphi 37.0 `System.DateUtils.SecondOf`. The routine delegates to `DecodeTime`, discards the decoded hour, minute and millisecond, and returns the second field.

**Edge cases and quirks**

- This is a component, not a count of seconds since midnight or an elapsed duration.
- Leap-second value 60 is not representable by Delphi's encoder.
- Invalid or non-finite raw input can raise during decoding rather than returning a sentinel.
- Free Pascal exposes the same component range; installed Delphi remains authoritative for Velox.

**Side effects**

None.

**Performance and concurrency**

Constant-time field decoding with no I/O or shared mutable state.

**Related entries**

- [`SecondOfTheMinute`](SecondOfTheMinute.md) is an exact alias.
- [`MilliSecondOf`](MilliSecondOf.md) extracts the smaller millisecond field.

**External references**

- [Embarcadero `System.DateUtils.SecondOf`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SecondOf)
- [Free Pascal `SecondOf`](https://www.freepascal.org/docs-html/rtl/dateutils/secondof.html)

<small>Created 2026-07-15</small>
