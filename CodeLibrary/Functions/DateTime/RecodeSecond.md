---
title: "RecodeSecond"
description: "Replaces the second field while preserving all other encoded date/time components."
sidebar_position: 118
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - recode
  - second
---

```Delphi
Function RecodeSecond( const AValue : TDateTime; const ASecond : Word) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 9, 42, 15, 250);
  Value := RecodeSecond(InputValue, 7); // 16 July 2026 09:42:07.250
end;
```

### Usage

`RecodeSecond` replaces the second field while preserving all other encoded date/time components.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Base value whose other fields are preserved. |
| `ASecond` | `Word`, `const` | Replacement second from 0 through 59, or literal 65535 to retain the existing second. |

**Returns**

A newly encoded value containing the requested second and the other decoded fields from `AValue`.

**Behaviour**

- Milliseconds are preserved exactly at the encoded millisecond resolution.
- The call replaces a field; it does not round, add seconds or carry into another minute.
- Date and time fields remain untagged and timezone-neutral.

**Important usage notes**

- The ordinary valid range is 0 through 59; leap-second value 60 is rejected.
- Passing `65535` preserves the existing second value.
- Values 60 through 65534 are invalid rather than normalised.
- Invalid base input can fail during the initial decode.

**Usage notes**

Use `IncSecond` for signed elapsed-second arithmetic. Use `RecodeTime` to replace several time components atomically.

### Additional Technical Info
`RecodeSecond` replaces the second-within-minute field while preserving the encoded date, hour, minute and millisecond fields.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to `System.DateUtils.RecodeSecond`. The installed Delphi wrapper calls the shared `RecodeDateTime` implementation with `ASecond` and leave-as-is sentinels for every other field. That path decodes the base, substitutes the selected field and validates the complete result through the standard encoder.

**Side effects**

None.

**Errors**

The shared recode path raises `EConvertError` when the completed value cannot be encoded. Velox lets the exception propagate. Its human-readable message can vary by locale.

**Performance and concurrency**

Constant-time decode and encode with no I/O. Only locale-sensitive error formatting can involve shared global formatting state.

**Related entries**

- [`SecondOf`](SecondOf.md) reads the second field.
- [`RecodeMilliSecond`](RecodeMilliSecond.md) replaces the smaller millisecond field.

**External references**

- [Embarcadero `System.DateUtils.RecodeSecond`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeSecond)
- [Free Pascal `RecodeSecond`](https://www.freepascal.org/docs-html/rtl/dateutils/recodesecond.html)

<small>Created 2026-07-15</small>
