---
title: dwHighDateTime
description: Stores bits 32 through 63 and the major ordering component of a script TFileTime value.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, record, filetime, high, longword]
---

```Delphi
dwHighDateTime: LongWord
```

### Example

```Delphi
function SameFileTime(const A, B: TFileTime): Boolean;
begin
  Result := (A.dwHighDateTime = B.dwHighDateTime) and
            (A.dwLowDateTime = B.dwLowDateTime);
end;
```

### Usage

`dwHighDateTime` stores bits 32 through 63 and the major ordering component of a script TFileTime value.

#### Safe use

- Compare this field first when ordering two complete FILETIME values; compare the low field only when high fields match.
- Equality requires both fields to match, as in the example.
- Do not treat the high half as seconds, days, a year or a signed integer.
- Preserve unsigned semantics when moving it through a Variant, database or text representation.
- A high field of zero does not make the low field a standalone date/time, and an all-ones high field can have API-specific meaning only when that API documents it.

### Additional Technical Info
`dwHighDateTime` is the high-order unsigned 32-bit field of [`TFileTime`](../TFileTime.md). Its range is 0..4,294,967,295, matching the current public [`Cardinal`](../../DataTypes/Cardinal.md)/LongWord representation.

One increment of this field represents `2^32` FILETIME ticks, or 429.4967296 seconds, plus whatever low-order value is held in `dwLowDateTime`. It carries the most significant part of the combined unsigned 64-bit value.

**Related Code Library entries**

- [dwLowDateTime](dwLowDateTime.md) - low-order half and rollover behavior.
- [Records](../../Records.md) - record value and interchange rules.

**External references**

- [Microsoft FILETIME](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-filetime) - authoritative high/low field definition.
- [Microsoft file times](https://learn.microsoft.com/en-us/windows/win32/sysinfo/file-times) - filesystem timestamp behavior and precision.
- [Free Pascal record types](https://www.freepascal.org/docs-html/current/ref/refsu15.html) - compatible record-field semantics.

<small>Created 2026-07-15</small>
