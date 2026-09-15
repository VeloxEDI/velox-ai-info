---
title: "RecodeMilliSecond"
description: "Replaces the millisecond field while preserving all other encoded components."
sidebar_position: 115
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - milliseconds
  - recode
---

```Delphi
Function RecodeMilliSecond(const AValue: TDateTime; const AMilliSecond: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 30, 15, 250);
  Value := RecodeMilliSecond(InputValue, 500); // 09:30:15.500
end;
```

### Usage

`RecodeMilliSecond` replaces the millisecond field while preserving all other encoded components.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base value whose other date/time fields are preserved. |
| `AMilliSecond` | `Word`, `const` | Replacement millisecond from 0 through 999, or `65535` to preserve the base millisecond. |

**Returns**

A newly encoded `TDateTime` with the resolved millisecond field and every other decoded field preserved.

**Behaviour**

- Zero clears the millisecond field; 999 sets its greatest valid value.
- No carry or rounding is performed. A value above 999 is invalid rather than advancing the whole second.
- The base is not modified, and all larger fields remain the same.
- Valid pre-epoch values are recomposed with sign-aware encoding.

**Important usage notes**

- `65535` preserves the field. The named Velox `RecodeLeaveFieldAsIs` constant is not exposed to scripts.
- A manually calculated input with finer-than-millisecond precision is first decoded to a millisecond field, so even a sentinel/no-op call rebuilds at Velox's millisecond resolution.
- The routine is field replacement, not an elapsed-millisecond adjustment. Use `IncMilliSecond` for arithmetic.
- No timezone conversion occurs.

**Usage notes**

Use this routine when the surrounding second must remain fixed. It is not suitable for preserving precision finer than one millisecond.

### Additional Technical Info
`RecodeMilliSecond` replaces the millisecond-within-second field and preserves the date, hour, minute and whole-second fields.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.RecodeMilliSecond`. It calls the shared `RecodeDateTime` terminal with `AMilliSecond` and the leave-as-is sentinel for all other fields. The terminal decodes the base and validates/re-encodes the complete field set.

**Side effects**

None on success. The failure path can read global locale separators for its message.

**Errors**

A replacement outside 0-999 and not equal to `65535`, or an unsuitable base value, raises `EConvertError`. Velox does not catch or translate it.

**Performance and concurrency**

Constant-time decoding and encoding with no external I/O. Concurrent locale mutation can affect only failure-message text.

**Related entries**

- [`RecodeDateTime`](RecodeDateTime.md) documents the shared sentinel and error path.
- [`IncMilliSecond`](IncMilliSecond.md) performs signed millisecond arithmetic.
- [`MilliSecondOf`](MilliSecondOf.md) reads the component without changing it.

**External references**

- [Embarcadero `System.DateUtils.RecodeMilliSecond`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeMilliSecond)
- [Free Pascal `RecodeMilliSecond`](https://www.freepascal.org/docs-html/rtl/dateutils/recodemillisecond.html)

<small>Created 2026-07-15</small>
