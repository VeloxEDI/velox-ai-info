---
title: "IsValidTime"
description: "Validates hour, minute, second and millisecond fields, including DateUtils' exact 24:00 special case."
sidebar_position: 80
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - validation
  - boolean
---

```Delphi
Function IsValidTime(const AHour, AMinute, ASecond, AMilliSecond: Word): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsValidTime(24, 0, 0, 0); // True
end;
```

### Usage

`IsValidTime` validates hour, minute, second and millisecond fields, including DateUtils' exact 24:00 special case.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AHour` | `Word`, `const` | Hour to validate. |
| `AMinute` | `Word`, `const` | Minute to validate. |
| `ASecond` | `Word`, `const` | Second to validate. |
| `AMilliSecond` | `Word`, `const` | Millisecond to validate. |

**Returns**

`True` for 00:00:00.000 through 23:59:59.999, and also for exactly 24:00:00.000.

**Behaviour**

- Midnight can be expressed as ordinary `00:00:00.000`.
- Exactly `24:00:00.000` is additionally valid as an end-of-day notation.
- `24:00:00.001`, `24:00:01.000` and every hour above 24 are invalid.

**Important usage notes**

- `EncodeTime` and `EncodeDateTime` do not accept hour 24. Normalise the special end-of-day tuple to midnight on the following date before passing it to those encoders.
- Second 60 is rejected; there is no leap-second special case.
- This is field validation only and has no timezone or daylight-saving interpretation.

**Usage notes**

Use the result as the documented field or date predicate only. It does not establish a timezone, business calendar or input provenance.

### Additional Technical Info
`IsValidTime` validates hour, minute, second and millisecond fields, including DateUtils' exact 24:00 special case.

The example is fictional and source-reviewed. It is deterministic for the supplied fields. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IsValidTime`. It accepts the ordinary ranges hour 0–23, minute 0–59, second 0–59 and millisecond 0–999. A second branch accepts hour 24 only when every smaller field is zero.

**Side effects**

None.

**Errors**

There is no wrapper exception handling. Ordinary out-of-range `Word` fields return `False` rather than raising.

**Performance and concurrency**

Constant-time field decoding or comparison with no external I/O. The routine uses no shared mutable state.

**Related entries**

- [`IsValidDateTime`](IsValidDateTime.md) combines this result with Gregorian date validation.
- [`EncodeTime`](EncodeTime.md) constructs ordinary time values but does not accept the 24:00 validation special case.

**External references**

- [Embarcadero `System.DateUtils.IsValidTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IsValidTime)
- [Free Pascal `IsValidTime`](https://www.freepascal.org/docs-html/rtl/dateutils/isvalidtime.html)

<small>Created 2026-07-15</small>
