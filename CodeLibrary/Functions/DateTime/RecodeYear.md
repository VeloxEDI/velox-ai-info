---
title: "RecodeYear"
description: "Replaces the calendar year while preserving the encoded month, day and time."
sidebar_position: 120
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - recode
  - year
  - leap-year
---

```Delphi
Function RecodeYear( const AValue : TDateTime; const AYear : Word) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2024, 6, 12, 8, 15, 0, 0);
  Value := RecodeYear(InputValue, 2027); // 12 June 2027 08:15
end;
```

### Usage

`RecodeYear` replaces the calendar year while preserving the encoded month, day and time.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base date/time whose month, day and clock fields are retained. |
| `AYear` | `Word`, `const` | Replacement year from 1 through 9999, or literal 65535 to preserve the current year. |

**Returns**

A newly encoded `TDateTime` in the requested year when the retained fields form a valid date/time.

**Behaviour**

- Month, day, hour, minute, second and millisecond are preserved.
- The operation replaces the year field; it does not add a calendar year.
- Valid pre-epoch inputs are recomposed using Velox's sign-aware encoder.
- No timezone or calendar-system conversion is performed; Velox uses its proleptic Gregorian range.

**Errors**

Invalid year/date combinations, invalid base input or encoding failure raise `EConvertError`. Velox does not catch it. Human-readable error formatting can vary by process locale.

**Usage notes**

Check leap-day input before changing to a non-leap year if failure is not acceptable. Use `IncYear` when calendar shifting with Velox's clamping rule is intended.

### Additional Technical Info
`RecodeYear` replaces the calendar year while retaining the month, day-of-month and time fields. The retained month/day must exist in the requested year.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to `System.DateUtils.RecodeYear`. The installed wrapper delegates to `RecodeDateTime`, forwarding `AYear` and using the internal leave-as-is sentinel for all other fields. The shared path decodes the base and validates the complete replacement through `TryEncodeDateTime`.

**Edge cases and quirks**

- Replacing the year in 29 February with a non-leap year raises. The date is not clamped to 28 February.
- Literal 65535 preserves the current year. It is a sentinel rather than a valid encodable year.
- Year zero and years above 9999 (other than the sentinel) are rejected.
- `IncYear` differs: it delegates to calendar-month arithmetic and clamps a leap-day result where necessary.
- Free Pascal documents the same ordinary range; current Velox behaviour follows the installed Delphi implementation.

**Side effects**

None.

**Performance and concurrency**

Constant-time decode and encode with no I/O. Successful calculation uses no mutable global state; exception text may use global format settings.

**Related entries**

- [`IncYear`](IncYear.md) shifts by calendar years through month arithmetic.
- [`IsInLeapYear`](IsInLeapYear.md) tests the base value's year.

**External references**

- [Embarcadero `System.DateUtils.RecodeYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeYear)
- [Free Pascal `RecodeYear`](https://www.freepascal.org/docs-html/rtl/dateutils/recodeyear.html)

<small>Created 2026-07-15</small>
