---
title: "RecodeDate"
description: "Replaces selected calendar date fields in a `TDateTime` while preserving its encoded time."
sidebar_position: 111
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
Function RecodeDate(const AValue: TDateTime; const AYear, AMonth, ADay: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 1, 31, 9, 30, 15, 250);
  Value := RecodeDate(InputValue, 2026, 2, 28); // 28 February at 09:30:15.250
end;
```

### Usage

`RecodeDate` replaces selected calendar date fields in a `TDateTime` while preserving its encoded time.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base value whose date fields are decoded and whose time fields are preserved. |
| `AYear` | `Word`, `const` | Replacement year from 1 through 9999, or `65535` to preserve the base year. |
| `AMonth` | `Word`, `const` | Replacement month from 1 through 12, or `65535` to preserve the base month. |
| `ADay` | `Word`, `const` | Replacement day valid for the resulting year/month, or `65535` to preserve the base day. |

**Returns**

A newly encoded `TDateTime` containing the resolved date and the original encoded time fields.

**Behaviour**

- All three date fields are validated together after sentinel resolution.
- The encoded time is preserved to millisecond resolution.
- The function creates a new value and does not modify `AValue`.
- Valid pre-epoch results use sign-aware date/time composition.

**Errors**

An invalid resolved date or time raises `EConvertError`. The message uses process-wide `FormatSettings`, so punctuation is locale-dependent. Velox does not catch or translate the exception.

**Usage notes**

Validate or catch the conversion when replacement fields come from external data. Use `IncMonth` when the business rule is a calendar offset rather than explicit field replacement.

### Additional Technical Info
`RecodeDate` replaces the year, month and day fields of an encoded value and preserves its hour, minute, second and millisecond fields. Each supplied date field can also use DateUtils' numeric leave-as-is sentinel.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.RecodeDate`. It delegates to `RecodeDateTime`, supplying the three arguments for date fields and the internal `RecodeLeaveFieldAsIs` value for all four time fields. The shared terminal decodes the base, replaces non-sentinel fields, calls `TryEncodeDateTime`, and raises `InvalidDateTimeError` when the resolved combination cannot be encoded.

**Edge cases and quirks**

- DateUtils' `RecodeLeaveFieldAsIs` constant is not exposed as a Code Library entry. Its `Word` value is `65535`, so that literal is the available scripting convention when a field must remain unchanged.
- Invalid combinations are rejected rather than normalised or clamped. For example, replacing the month with February while preserving a base day of 31 raises.
- Unlike `IncMonth`, recoding does not implement end-of-month clamping.
- Passing `65535` for all three replacement fields rebuilds the same decoded fields; it is a logical no-op, not a bypass of decoding and validation.
- The result remains an untagged encoded value and no timezone rules are applied.

**Side effects**

None on success. The failure path reads global locale separators when formatting its exception message.

**Performance and concurrency**

Constant-time decoding, field replacement and encoding. Successful calls use no shared mutable state; concurrent changes to global `FormatSettings` can affect failure-message text.

**Related entries**

- [`RecodeDateTime`](RecodeDateTime.md) exposes all seven replacement fields.
- [`RecodeDay`](RecodeDay.md) changes only the day-of-month field.
- [`IncMonth`](IncMonth.md) performs calendar movement with month-end clamping.

**External references**

- [Embarcadero `System.DateUtils.RecodeDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeDate)
- [Free Pascal `RecodeDate`](https://www.freepascal.org/docs-html/rtl/dateutils/recodedate.html)

<small>Created 2026-07-15</small>
