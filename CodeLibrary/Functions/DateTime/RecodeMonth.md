---
title: "RecodeMonth"
description: "Replaces the calendar month while preserving the encoded day and time, raising when the combined date is invalid."
sidebar_position: 117
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - recode
  - month
  - validation
---

```Delphi
Function RecodeMonth( const AValue : TDateTime; const AMonth : Word) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 1, 15, 9, 30, 0, 0);
  Value := RecodeMonth(InputValue, 4); // 15 April 2026 09:30
end;
```

### Usage

`RecodeMonth` replaces the calendar month while preserving the encoded day and time, raising when the combined date is invalid.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base date/time whose year, day and time are retained. |
| `AMonth` | `Word`, `const` | Replacement month from 1 through 12. The literal value 65535 preserves the existing month. |

**Returns**

A newly encoded `TDateTime` containing the requested month when the retained fields form a valid date.

**Behaviour**

- The calendar year, day-of-month, hour, minute, second and millisecond are preserved.
- Month replacement is a field operation, not a calendar increment.
- A valid pre-epoch value is decoded and recomposed with Velox's sign-aware date/time encoding.
- The result remains an untagged value; no timezone rules are applied.

**Errors**

An invalid month, an impossible retained day/month/year combination, or invalid base input propagates `EConvertError`. Error text uses runtime resources and process formatting and is not a stable interface.

**Usage notes**

Validate the intended combined date in advance when month input is user-controlled. Use `IncMonth` when end-of-month clamping is wanted.

### Additional Technical Info
`RecodeMonth` replaces the calendar month while retaining the encoded year, day-of-month and time fields. The retained day must exist in the replacement month.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import calls Delphi 37.0 `System.DateUtils.RecodeMonth`. It delegates to `RecodeDateTime` with the internal leave-as-is sentinel for every field except month. The shared path decodes all fields from `AValue`, substitutes `AMonth`, then uses the combined DateUtils/SysUtils try-encode path.

**Edge cases and quirks**

- The routine does not clamp the day to the end of a shorter month. Replacing January in 31 January with February raises instead of returning 28 or 29 February.
- The literal `Word` value 65535 is a no-op sentinel even though Velox does not expose its Delphi constant name here.
- Values 0 and 13 through 65534 are invalid and are not normalised into another year.
- This differs from `IncMonth`, which performs calendar-month arithmetic and deliberately clamps end-of-month values.
- Free Pascal describes the same broad operation; Velox behaviour follows the exact installed Delphi source and exposed overload.

**Side effects**

None.

**Performance and concurrency**

Constant-time decode/validate/encode work with no I/O. Successful calls use no shared mutable state; failure message formatting can depend on global locale settings.

**Related entries**

- [`IncMonth`](IncMonth.md) shifts by calendar months and clamps invalid month-end days.
- [`RecodeYear`](RecodeYear.md) replaces the year with the same combined-date rule.

**External references**

- [Embarcadero `System.DateUtils.RecodeMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeMonth)
- [Free Pascal `RecodeMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/recodemonth.html)

<small>Created 2026-07-15</small>
