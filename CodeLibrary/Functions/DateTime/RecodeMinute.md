---
title: "RecodeMinute"
description: "Replaces the minute field while preserving all other encoded date/time components."
sidebar_position: 116
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - recode
  - minute
---

```Delphi
Function RecodeMinute( const AValue : TDateTime; const AMinute : Word) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 9, 42, 15, 250);
  Value := RecodeMinute(InputValue, 5); // 16 July 2026 09:05:15.250
end;
```

### Usage

`RecodeMinute` replaces the minute field while preserving all other encoded date/time components.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base value whose other encoded fields are retained. |
| `AMinute` | `Word`, `const` | Replacement minute from 0 through 59. The literal value 65535 preserves the existing minute. |

**Returns**

A newly encoded `TDateTime` with the requested minute and all other fields taken from `AValue`.

**Behaviour**

- Ordinary replacement values are 0 through 59.
- Seconds and milliseconds are retained; the result is not rounded to a whole minute.
- The operation replaces a calendar field. It does not add or subtract elapsed minutes.
- No timezone or daylight-saving conversion is performed.

**Errors**

If the replacement cannot form a valid complete date/time, the shared DateUtils path raises `EConvertError`. Velox does not catch or translate that exception. Message text is locale-dependent and should not be parsed.

**Usage notes**

Use `IncMinute` for elapsed minute arithmetic. Use `RecodeTime` when several clock fields must be replaced in one validated operation.

### Additional Technical Info
`RecodeMinute` replaces the minute-within-hour field of an encoded date/time. The calendar date, hour, second and millisecond fields are preserved.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils script import binds directly to Delphi 37.0 `System.DateUtils.RecodeMinute`. That wrapper calls `RecodeDateTime`, passing `AMinute` and the internal `RecodeLeaveFieldAsIs` value for all other fields. The shared implementation decodes `AValue`, replaces fields whose supplied value is not 65535, then tries to encode the complete result.

**Edge cases and quirks**

- Velox does not expose `RecodeLeaveFieldAsIs` as a named constant in this entry. Passing the equivalent `Word` value 65535 makes the call a no-op for the minute field.
- Values from 60 through 65534 are invalid. They are not carried into the next hour.
- The entire base value is decoded and re-encoded, so invalid or non-finite input can fail before a result is returned.
- Free Pascal documents the same ordinary replacement range. Its implementation is compatibility context; the installed Delphi implementation is authoritative for Velox.

**Side effects**

None. The input is passed by value.

**Performance and concurrency**

Constant-time field decoding and encoding with no I/O. The calculation itself has no mutable state; only exception message formatting can consult process-global format settings.

**Related entries**

- [`RecodeTime`](RecodeTime.md) replaces several time fields together.
- [`RecodeDateTime`](RecodeDateTime.md) exposes all replaceable fields.

**External references**

- [Embarcadero `System.DateUtils.RecodeMinute`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeMinute)
- [Free Pascal `RecodeMinute`](https://www.freepascal.org/docs-html/rtl/dateutils/recodeminute.html)

<small>Created 2026-07-15</small>
