---
title: "RecodeHour"
description: "Replaces the hour field while preserving all other encoded components."
sidebar_position: 114
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - hour
  - recode
---

```Delphi
Function RecodeHour(const AValue: TDateTime; const AHour: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 30, 15, 250);
  Value := RecodeHour(InputValue, 17); // 18 July 2026 at 17:30:15.250
end;
```

### Usage

`RecodeHour` replaces the hour field while preserving all other encoded components.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base value whose date and smaller time fields are preserved. |
| `AHour` | `Word`, `const` | Replacement hour from 0 through 23, or `65535` to preserve the base hour. |

**Returns**

A newly encoded `TDateTime` with the resolved hour and all other decoded fields preserved.

**Behaviour**

- Minutes, seconds and milliseconds are retained exactly at the encoder's millisecond resolution.
- The calendar date does not roll when the hour is replaced.
- The base argument is not modified.
- Pre-epoch values are recomposed with the correct negative date/time sign.

**Errors**

An hour outside 0-23 and not equal to `65535`, or an unsuitable base value, raises `EConvertError`. Velox does not translate it.

**Usage notes**

Use `IncHour` when the requirement is to move an instant by a fixed number of hours; use `RecodeHour` when the date and smaller fields must stay unchanged.

### Additional Technical Info
`RecodeHour` replaces the encoded hour field and preserves the date, minute, second and millisecond fields.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.RecodeHour`. It delegates to `RecodeDateTime`, supplying `AHour` and the leave-as-is sentinel for every other field. The shared terminal decodes, resolves and validates through Delphi `TryEncodeDateTime`/`TryEncodeTime`.

**Edge cases and quirks**

- The accepted hour range is 0-23. Exact hour 24 is rejected by the encoder even when minute, second and millisecond are all zero.
- This differs from `IsValidTime`, which accepts the boundary combination 24:00:00.000. A value that passes that predicate can therefore still fail here.
- `65535` preserves the field; the named `RecodeLeaveFieldAsIs` constant is not exposed in the Code Library.
- The function replaces a field rather than adding hours. It does not apply timezone or daylight-saving transition rules.

**Side effects**

None on success. Global locale separators are read only on the exception path.

**Performance and concurrency**

Constant-time decoding and encoding with no I/O. Concurrent locale changes can affect only failure-message formatting.

**Related entries**

- [`RecodeDateTime`](RecodeDateTime.md) documents the shared validation path.
- [`IncHour`](IncHour.md) performs fixed-duration arithmetic.
- [`IsValidTime`](IsValidTime.md) has the documented 24:00 validation mismatch.

**External references**

- [Embarcadero `System.DateUtils.RecodeHour`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeHour)
- [Free Pascal `RecodeHour`](https://www.freepascal.org/docs-html/rtl/dateutils/recodehour.html)

<small>Created 2026-07-15</small>
