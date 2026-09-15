---
title: "RecodeTime"
description: "Replaces all clock fields while preserving the encoded calendar date."
sidebar_position: 119
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
Function RecodeTime( const AValue : TDateTime; const AHour, AMinute, ASecond, AMilliSecond : Word) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 9, 42, 15, 250);
  Value := RecodeTime(InputValue, 14, 30, 5, 125);
  // 16 July 2026 14:30:05.125
end;
```

### Usage

`RecodeTime` replaces all clock fields while preserving the encoded calendar date.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base value whose calendar date and any sentinel-selected fields are retained. |
| `AHour` | `Word`, `const` | Replacement hour from 0 through 23, or 65535 to preserve it. |
| `AMinute` | `Word`, `const` | Replacement minute from 0 through 59, or 65535 to preserve it. |
| `ASecond` | `Word`, `const` | Replacement second from 0 through 59, or 65535 to preserve it. |
| `AMilliSecond` | `Word`, `const` | Replacement millisecond from 0 through 999, or 65535 to preserve it. |

**Returns**

A newly encoded `TDateTime` containing the retained date and the requested or preserved time fields.

**Behaviour**

- Each time field is independently replaceable or preservable.
- Validation is performed on the final combination, after sentinel resolution.
- The calendar date is preserved, including for valid pre-epoch values.
- The operation is field replacement, not duration arithmetic or timezone conversion.

**Errors**

Invalid final fields or invalid base input raise `EConvertError`. Velox performs no exception translation. Error text is locale-dependent and should not control flow.

**Usage notes**

Use `EncodeDateTime` when every date and time field is new. Use `RecodeDateTime` when date fields must also be selectively replaced.

### Additional Technical Info
`RecodeTime` selectively replaces hour, minute, second and millisecond fields in one operation while retaining the calendar date from `AValue`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.RecodeTime`. The wrapper calls `RecodeDateTime`, supplies internal leave-as-is values for year/month/day and forwards all four time arguments. The shared routine decodes the base, resolves every 65535 sentinel, then calls `TryEncodeDateTime`; failure is converted to the DateUtils invalid-date/time exception.

**Edge cases and quirks**

- Although the Embarcadero page says hour 24 is permitted when the smaller fields are zero, the installed Delphi path ultimately calls SysUtils `TryEncodeTime`, which accepts only hours 0 through 23. In Velox, exact 24:00:00.000 therefore raises.
- Literal 65535 is the only leave-as-is sentinel. Other out-of-range values are not normalised.
- A sentinel can preserve an existing value while another field is replaced. All retained/replacement fields must still form an encodable result.
- Leap seconds are not supported.
- Free Pascal documents the same field replacement shape, but its implementation does not establish the installed Delphi terminal's exact 24:00 behaviour.

**Side effects**

None.

**Performance and concurrency**

Constant-time decode and encode with no external I/O. Successful calls are independent; only error formatting can consult shared process format settings.

**Related entries**

- [`RecodeDateTime`](RecodeDateTime.md) replaces any date or time field.
- [`IsValidTime`](IsValidTime.md) has the documented 24:00 validation/encoding mismatch.

**External references**

- [Embarcadero `System.DateUtils.RecodeTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeTime)
- [Free Pascal `RecodeTime`](https://www.freepascal.org/docs-html/rtl/dateutils/recodetime.html)

<small>Created 2026-07-15</small>
