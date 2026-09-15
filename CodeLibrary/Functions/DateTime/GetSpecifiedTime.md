---
title: "GetSpecifiedTime"
description: "Replaces a supported date/time value's clock with supplied hour, minute and second fields and zero milliseconds."
sidebar_position: 49
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - replacement
  - pre-epoch
---

```Delphi
Function GetSpecifiedTime(DateTime: TDateTime;
  aHour, aMinute, aSecond: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 15, 30, 500);
  Value := GetSpecifiedTime(InputValue, 14, 30, 0);
  // 18 July 2026, 14:30:00.000
end;
```

### Usage

`GetSpecifiedTime` replaces a supported date/time value's clock with supplied hour, minute and second fields and zero milliseconds.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `DateTime` | `TDateTime` | Input whose calendar date is retained. Its original time is discarded. |
| `aHour` | `Word` | Replacement hour `0..23`. |
| `aMinute` | `Word` | Replacement minute `0..59`. |
| `aSecond` | `Word` | Replacement second `0..59`. |

**Returns**

The input's calendar date with the specified time and millisecond `0`, for ordinary dates on or after the Velox epoch.

**Errors**

Invalid date or time fields raise `EConvertError` through `EncodeDate` or `EncodeTime`. No Velox handler catches the exception.

### Additional Technical Info
`GetSpecifiedTime` keeps the year, month and day from `DateTime`, replaces its hour/minute/second, and forces milliseconds to zero. It is a Velox wrapper and has a known defect for dates before Delphi's 30 December 1899 epoch.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The Velox date-tools terminal calls `DecodeDate(DateTime, Year, Month, Day)`, then evaluates `EncodeDate(Year, Month, Day) + EncodeTime(aHour, aMinute, aSecond, 0)`. There is no validation or correction around that direct addition beyond the two core encoders.

**Edge cases and quirks**

- Milliseconds are always discarded and become zero.
- For a date before 30 December 1899, Delphi requires a time fraction to be **subtracted** from a negative date value. This helper always adds it. A historical timed result can therefore decode as the wrong calendar date and time. Use `EncodeDateTime` after decoding the date when historical values must be supported.
- Unsupported date values can make `DecodeDate` return zero fields; the following `EncodeDate` then fails.
- The replacement is timezone-neutral. No UTC/local conversion occurs.
- `aSecond = 60` and `aHour = 24` are invalid rather than normalised.

**Side effects**

None.

**Performance and concurrency**

Constant-time field conversion with no allocation or shared state.

**Related entries**

- [`EncodeDateTime`](EncodeDateTime.md) combines the same fields with correct pre-epoch sign handling.
- [`DecodeDate`](DecodeDate.md) supplies the retained calendar fields.

**External references**

- [Embarcadero `System.SysUtils.DecodeDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DecodeDate)
- [Free Pascal `DecodeDate`](https://www.freepascal.org/docs-html/rtl/sysutils/decodedate.html)
- [Embarcadero `System.SysUtils.EncodeDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.EncodeDate)
- [Free Pascal `EncodeDate`](https://www.freepascal.org/docs-html/rtl/sysutils/encodedate.html)
- [Embarcadero `System.SysUtils.EncodeTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.EncodeTime)
- [Free Pascal `EncodeTime`](https://www.freepascal.org/docs-html/rtl/sysutils/encodetime.html)

<small>Created 2026-07-15</small>
