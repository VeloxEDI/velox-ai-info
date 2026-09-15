---
title: "MilliSecondOfTheSecond"
description: "Returns the encoded millisecond-within-second component as an exact alias of `MilliSecondOf`."
sidebar_position: 88
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
Function MilliSecondOfTheSecond(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 10, 11, 250);
  Value := MilliSecondOfTheSecond(InputValue); // 250
end;
```

### Usage

`MilliSecondOfTheSecond` returns the encoded millisecond-within-second component as an exact alias of `MilliSecondOf`.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose millisecond-within-second field is required. |

**Returns**

A `Word` in the inclusive range 0 through 999.

**Behaviour**

- The result is identical to calling `MilliSecondOf` with the same value.
- Date, hour, minute and whole-second fields do not affect the returned component.
- The component resets to zero at the next encoded second.
- The routine does not interpret a timezone.

**Important usage notes**

- This function does not round to a whole second; it returns the decoded millisecond field.
- Any finer binary fraction in a manually calculated `TDateTime` is subject to Velox's timestamp rounding during decoding.
- The value is a component, not an elapsed-millisecond count.
- Invalid or non-finite input can raise during decoding rather than returning a sentinel.

**Usage notes**

Choose either this entry or `MilliSecondOf` according to which name makes the surrounding expression clearer; their current results are identical.

### Additional Technical Info
`MilliSecondOfTheSecond` returns the encoded millisecond-within-second component from 0 through 999. It is an exact implementation alias of `MilliSecondOf`, provided to complete the DateUtils `...OfThe...` naming family.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MilliSecondOfTheSecond`. That function returns `MilliSecondOf(AValue)` without applying further arithmetic or conversion; `MilliSecondOf` obtains the field through `DecodeTime`.

**Side effects**

None.

**Errors**

Velox does not catch or translate date/time decode exceptions.

**Performance and concurrency**

Constant-time delegation and component decoding with no external I/O or shared mutable state.

**Related entries**

- [`MilliSecondOf`](MilliSecondOf.md) is the exact implementation target.
- [`MilliSecondOfTheMinute`](MilliSecondOfTheMinute.md) includes the whole-second position within the minute.

**External references**

- [Embarcadero `System.DateUtils.MilliSecondOfTheSecond`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MilliSecondOfTheSecond)
- [Free Pascal `MilliSecondOfTheSecond`](https://www.freepascal.org/docs-html/rtl/dateutils/millisecondofthesecond.html)

<small>Created 2026-07-15</small>
