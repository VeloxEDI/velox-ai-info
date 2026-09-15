---
title: "CompareDate"
description: "Compares the calendar-date portions of two TDateTime values and returns -1, 0 or 1."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - comparison
  - delphi
---

```Delphi
Function CompareDate(const A, B: TDateTime): Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  MorningValue, EveningValue: TDateTime;
begin
  MorningValue := EncodeDate(2026, 7, 18) + EncodeTime(9, 0, 0, 0);
  EveningValue := EncodeDate(2026, 7, 18) + EncodeTime(17, 30, 0, 0);
  Value := CompareDate(MorningValue, EveningValue); // 0: same date
end;
```

### Usage

`CompareDate` compares the calendar-date portions of two TDateTime values and returns -1, 0 or 1.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `TDateTime`, `const` | First date/time value. Its time component does not affect the result. |
| `B` | `TDateTime`, `const` | Second date/time value. Its time component does not affect the result. |

**Returns**

`-1` when the date in `A` is earlier, `0` when both values have the same date, or `1` when the date in `A` is later.

**Behaviour**

Two values on the same calendar day compare equal even when their hours, minutes, seconds or milliseconds differ. The operation is symmetric with respect to equality, but ordering is directional: swapping unequal arguments changes `-1` to `1` or vice versa.

**Errors**

No exception path exists for ordinary valid `TDateTime` values. Non-finite or out-of-domain floating values are not validated by this function and should not be supplied.

### Additional Technical Info
`CompareDate` orders two `TDateTime` values by calendar date while ignoring their times of day. It returns the integer form of Delphi's three-state `TValueRelationship` result.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils scripting import binds directly to the installed Delphi 37.0 `System.DateUtils.CompareDate`. The implementation compares `Trunc(A)` with `Trunc(B)` for equality. If they are different, it uses the numeric ordering of the full values to choose `LessThanValue` or `GreaterThanValue`; these enum values are exposed to the script as `Integer`.

**Edge cases and quirks**

- `Trunc` is significant for negative, pre-epoch `TDateTime` values. It follows Delphi's representation rather than treating the value as a conventional signed Unix-style day count.
- The implementation does not round a manually calculated floating value before truncation. A value infinitesimally across an integral-day boundary can therefore be classified as the adjacent date. Embarcadero gives the same warning for `DateOf`.
- This is not a duration comparison and it performs no timezone conversion. Two numerically encoded local/UTC values are compared exactly as supplied.
- Free Pascal exposes the same three-way concept, but its documentation describes a negative/zero/positive result. Velox's Delphi terminal returns the specific values `-1`, `0` and `1`.

**Side effects**

None. The function reads only its arguments.

**Performance and concurrency**

Constant-time scalar arithmetic with no allocation or shared state. It is safe to use concurrently with independent values.

**Related entries**

- [`CompareDateTime`](CompareDateTime.md) includes both date and time to millisecond precision.
- [`CompareTime`](CompareTime.md) ignores the calendar date.
- [`DateOf`](DateOf.md) returns the truncated date value rather than a relationship.

**External references**

- [Embarcadero `System.DateUtils.CompareDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.CompareDate) - documents the exact Delphi routine bound by Velox.
- [Free Pascal `CompareDate`](https://www.freepascal.org/docs-html/rtl/dateutils/comparedate.html) - documents the compatible Free Pascal routine for dialect comparison.

<small>Created 2026-07-15</small>
