---
title: TFileTime
description: Represents a Windows UTC file-time interval count as low-order and high-order unsigned 32-bit fields.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, record, filetime, windows, utc]
---

```Delphi
TFileTime = record
  dwLowDateTime: LongWord;
  dwHighDateTime: LongWord;
end
```

### Example

```Delphi
function CompareFileTime(const A, B: TFileTime): Integer;
begin
  if A.dwHighDateTime < B.dwHighDateTime then
    Result := -1
  else if A.dwHighDateTime > B.dwHighDateTime then
    Result := 1
  else if A.dwLowDateTime < B.dwLowDateTime then
    Result := -1
  else if A.dwLowDateTime > B.dwLowDateTime then
    Result := 1
  else
    Result := 0;
end;
```

### Usage

`TFileTime` represents a Windows UTC file-time interval count as low-order and high-order unsigned 32-bit fields.

#### Interpretation and comparison

- Neither field is a standalone time value. The low half rolls over about every 429.4967296 seconds and increments the high half.
- Compare the unsigned high field first, then the unsigned low field, as in the example.
- A FILETIME is not a Velox [`TDateTime`](../DataTypes/TDateTime.md), Unix timestamp, DOS file date or local calendar time.
- The epoch is UTC, but a filesystem or API can have lower precision, delayed timestamp updates or context-specific sentinel values. Interpret it using the producing API's contract.
- Calendar formatting, timezone conversion and duration arithmetic require an appropriate conversion layer. The current public Code Library index exposes no function/property that accepts or returns this record.

#### Script behaviour

Record assignment copies both fields. Velox provides no methods, operators, validation or formatting for this record. Do not reinterpret it as a 64-bit value through a pointer. Use a documented conversion operation that combines the two unsigned fields safely.

### Additional Technical Info
`TFileTime` is a plain PascalScript record registered by `SysUtilsTypesImport`. Its layout matches the current Delphi/Windows FILETIME structure: [`dwLowDateTime`](TFileTime/dwLowDateTime.md) contains bits 0..31 and [`dwHighDateTime`](TFileTime/dwHighDateTime.md) contains bits 32..63 of one unsigned 64-bit value.

For ordinary Windows file timestamps, that combined value counts 100-nanosecond intervals since 1601-01-01 00:00:00 UTC:

```text
ticks = (dwHighDateTime * 4294967296) + dwLowDateTime
```

This mathematical relationship explains layout; it is not a recommendation to perform date conversion with floating-point arithmetic. Preserve all 64 integer bits and use a documented conversion API at an actual Windows boundary.

**Related Code Library entries**

- [Cardinal](../DataTypes/Cardinal.md) - public unsigned 32-bit alias corresponding to each LongWord field.
- [Records](../Records.md) - value-copy and interchange rules.

**External references**

- [Microsoft FILETIME](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-filetime) - layout, 1601 UTC epoch and alignment warning.
- [Microsoft file times](https://learn.microsoft.com/en-us/windows/win32/sysinfo/file-times) - filesystem precision, UTC/local behavior and update timing.
- [Embarcadero structured types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_%28Delphi%29) - Delphi record semantics.
- [Free Pascal record types](https://www.freepascal.org/docs-html/current/ref/refsu15.html) - compatible record declaration concepts.

<small>Created 2026-07-15</small>
