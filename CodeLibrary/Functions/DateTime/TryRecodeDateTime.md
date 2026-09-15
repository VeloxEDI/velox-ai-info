---
title: "TryRecodeDateTime"
description: "Tries to replace selected date/time fields while retaining each field marked with the recode sentinel."
sidebar_position: 155
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - recode
  - validation
---

```Delphi
Function TryRecodeDateTime(const AValue: TDateTime; const AYear, AMonth,
  ADay, AHour, AMinute, ASecond, AMilliSecond: Word;
  var AResult: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue, ResultValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 30, 15, 250);
  if TryRecodeDateTime(InputValue, 65535, 12, 31, 23, 59, 59, 999,
    ResultValue) then
    Value := ResultValue;
end;
```

### Usage

`TryRecodeDateTime` tries to replace selected date/time fields while retaining each field marked with the recode sentinel.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base value decoded into seven fields. |
| `AYear` | `Word`, `const` | Year `1..9999`, or `65535` to preserve it. |
| `AMonth` | `Word`, `const` | Month `1..12`, or `65535`. |
| `ADay` | `Word`, `const` | Valid resolved day, or `65535`. |
| `AHour` | `Word`, `const` | Hour `0..23`, or `65535`. |
| `AMinute` | `Word`, `const` | Minute `0..59`, or `65535`. |
| `ASecond` | `Word`, `const` | Second `0..59`, or `65535`. |
| `AMilliSecond` | `Word`, `const` | Millisecond `0..999`, or `65535`. |
| `AResult` | `TDateTime`, `var` | Receives the complete result on success; can receive a date-only partial result on failure. |

**Returns**

The Boolean result of encoding the resolved fields.

**Errors**

Expected invalid resolved fields return `False`. Unexpected decoding or numeric faults are not translated.

### Additional Technical Info
`TryRecodeDateTime` decodes a base value, substitutes each supplied field and attempts to encode the resolved combination. Passing `65535` (`High(Word)`) preserves the corresponding base field. Invalid combinations return `False` instead of invoking DateUtils' recode error constructor.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.TryRecodeDateTime`. It calls `DecodeDateTime`, replaces each local field not equal to `RecodeLeaveFieldAsIs`, then delegates to `TryEncodeDateTime`, including its sign-aware pre-epoch composition and output behaviour.

**Edge cases and quirks**

- The symbolic sentinel is not exposed as a Code Library constant; scripts use numeric `65535` deliberately.
- Fields are validated as one combination. Preserving day 31 while changing to a 30-day month returns `False`; nothing is clamped.
- Exact `24:00:00.000` returns `False` because the installed terminal rejects hour 24.
- When the resolved date is valid but resolved time is invalid, delegated `TryEncodeDateTime` writes the date at midnight to `AResult` before returning `False`. Ignore all output after failure.
- An invalid/out-of-range base can decode zero fields; preservation sentinels then retain those invalid zeros and the final encode fails.
- No timezone conversion occurs.

**Side effects**

May write a complete or partial value to `AResult`; no external state changes.

**Performance and concurrency**

Constant-time decode, substitution and encode work with no I/O or shared state.

**Related entries**

- [`RecodeDateTime`](RecodeDateTime.md) raises when this routine returns `False`.
- [`RecodeDate`](RecodeDate.md) changes only date fields and raises on failure.
- [`TryEncodeDateTime`](TryEncodeDateTime.md) supplies the final encoding semantics.

**External references**

- [Embarcadero `System.DateUtils.TryRecodeDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TryRecodeDateTime)
- [Free Pascal `TryRecodeDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/tryrecodedatetime.html)

<small>Created 2026-07-15</small>
