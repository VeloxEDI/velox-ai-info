---
title: "RecodeDateTime"
description: "Replaces supplied date/time fields, resolving the DateUtils leave-as-is sentinel and raising on an invalid result."
sidebar_position: 112
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - recode
  - conversion
---

```Delphi
Function RecodeDateTime(const AValue: TDateTime; const AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 30, 15, 250);
  Value := RecodeDateTime(InputValue, 65535, 12, 31, 23, 59, 59, 999);
  // 31 December 2026 at 23:59:59.999; 65535 preserves the year
end;
```

### Usage

`RecodeDateTime` replaces supplied date/time fields, resolving the DateUtils leave-as-is sentinel and raising on an invalid result.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base value decoded before replacement. It is not modified. |
| `AYear` | `Word`, `const` | Year 1-9999, or `65535` to preserve the base year. |
| `AMonth` | `Word`, `const` | Month 1-12, or `65535` to preserve the base month. |
| `ADay` | `Word`, `const` | Day valid for the resolved year/month, or `65535` to preserve the base day. |
| `AHour` | `Word`, `const` | Hour 0-23, or `65535` to preserve the base hour. |
| `AMinute` | `Word`, `const` | Minute 0-59, or `65535` to preserve the base minute. |
| `ASecond` | `Word`, `const` | Second 0-59, or `65535` to preserve the base second. |
| `AMilliSecond` | `Word`, `const` | Millisecond 0-999, or `65535` to preserve the base millisecond. |

**Returns**

A newly encoded `TDateTime` containing all resolved fields.

**Behaviour**

- Replacement is field-based, not arithmetic: it does not add an interval or carry an overflowing field into the next field.
- All resolved fields are validated as one date/time combination.
- The base is decoded before replacements, even when every argument supplies a new field.
- Valid pre-epoch results preserve Velox's negative date/time encoding correctly.

**Errors**

Invalid input or a resolved field combination outside the encoder's ranges raises `EConvertError`. Its human-readable separators and decimal punctuation depend on global host format settings and are not a stable machine-readable contract.

**Usage notes**

Use the narrower `Recode...` helpers when only one field changes; they share this exact Velox and error behaviour with fewer arguments.

### Additional Technical Info
`RecodeDateTime` decodes a base value, replaces each supplied date/time field, and encodes the resolved combination as a new `TDateTime`. Passing `65535` for any `Word` field preserves that field from the base value.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.RecodeDateTime`. It calls `TryRecodeDateTime`, which decodes all seven base fields, replaces each field not equal to `High(Word)`, and passes the result to `TryEncodeDateTime`. That encoder validates the date and time separately, combines them with the correct sign for pre-epoch dates, and returns false on any invalid combination. `RecodeDateTime` then calls `InvalidDateTimeError`, which raises `EConvertError` with locale-formatted fields.

**Edge cases and quirks**

- The named Delphi constant `RecodeLeaveFieldAsIs` is not exposed in the Code Library. Scripts must use its numeric `Word` value `65535` when preservation is intentional.
- Exact `24:00:00.000` is rejected because the terminal uses `TryEncodeTime`, whose hour range is 0-23. This differs from the exposed `IsValidTime`, which accepts exact 24:00 as a boundary value.
- Invalid dates are rejected, not normalised. `2026, 2, 30` does not roll into March.
- Replacing the month while preserving the day can create an invalid combination, such as moving day 31 to a 30-day month.
- On an invalid recode whose base is `TDateTime(0)`, sentinel fields can be shown as missing in the exception text because the error formatter also uses zero to mean no base. The validity decision itself has already used the decoded base fields.
- The output is untagged and no timezone conversion is performed.

**Side effects**

None on success. The failure path reads process-wide `FormatSettings` to format the exception.

**Performance and concurrency**

Constant-time decode/replace/encode work with no I/O. Concurrent mutation of global `FormatSettings` can affect exception text, not successful results.

**Related entries**

- [`RecodeDate`](RecodeDate.md) replaces the date fields and preserves time.
- [`RecodeHour`](RecodeHour.md) and [`RecodeMilliSecond`](RecodeMilliSecond.md) replace one time field.
- [`InvalidDateTimeError`](InvalidDateTimeError.md) documents the shared locale-formatted failure constructor.

**External references**

- [Embarcadero `System.DateUtils.RecodeDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeDateTime)
- [Free Pascal `RecodeDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/recodedatetime.html)

<small>Created 2026-07-15</small>
