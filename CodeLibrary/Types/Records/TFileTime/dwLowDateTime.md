---
title: dwLowDateTime
description: Stores bits 0 through 31 of the unsigned 64-bit interval count in a script TFileTime record.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, record, filetime, low, longword]
---

```Delphi
dwLowDateTime: LongWord
```

### Example

```Delphi
procedure ClearFileTime(var Value: TFileTime);
begin
  Value.dwLowDateTime := 0;
  Value.dwHighDateTime := 0;
end;
```

### Usage

`dwLowDateTime` stores bits 0 through 31 of the unsigned 64-bit interval count in a script TFileTime record.

#### Safe use

- Read or write it only as one half of a complete `TFileTime` contract.
- For ordering, compare `dwHighDateTime` first and use this field only when the high halves are equal.
- Do not convert this value alone to `TDateTime`, Unix seconds or a formatted date.
- When constructing a value, initialize both fields. A zero low field does not imply an empty, midnight or whole-second time.
- Preserve unsigned semantics at database/JSON boundaries. A signed 32-bit container will display values above `$7FFFFFFF` as negative.

Its all-zero value is a bit-pattern example, not a universal API-specific "missing timestamp" marker.

### Additional Technical Info
`dwLowDateTime` is the low-order unsigned 32-bit field of [`TFileTime`](../TFileTime.md). Its range is 0..4,294,967,295, matching the current public [`Cardinal`](../../DataTypes/Cardinal.md)/LongWord representation.

The field holds bits 0..31 of the combined interval count. It advances on every 100-nanosecond tick and wraps from `$FFFFFFFF` to 0 with a carry into `dwHighDateTime`. It therefore repeats roughly every 429.4967296 seconds and is not independently chronological.

**Related Code Library entries**

- [dwHighDateTime](dwHighDateTime.md) - high-order half used first for comparison.
- [Records](../../Records.md) - record value and interchange rules.

**External references**

- [Microsoft FILETIME](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-filetime) - authoritative low/high field definition.
- [Free Pascal record types](https://www.freepascal.org/docs-html/current/ref/refsu15.html) - compatible record-field semantics.

<small>Created 2026-07-15</small>
