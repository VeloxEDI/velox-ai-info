---
title: MSecPerDay
description: "Defines a nominal 24-hour day as 86,400,000 milliseconds, with important signed 32-bit scaling limits."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, milliseconds, day, overflow]
---

```Delphi
MSecPerDay = 86400000
```

### Example

```Delphi
function DaysToMilliseconds(const Days: Integer): Int64;
begin
  Result := Int64(Days) * MSecPerDay;
end;
```

### Usage

`MSecPerDay` defines a nominal 24-hour day as 86,400,000 milliseconds, with important signed 32-bit scaling limits.

#### Overflow boundary

The constant itself fits signed 32-bit Integer. Multiplication by 24 produces 2,073,600,000 and still fits; multiplication by 25 produces 2,160,000,000 and exceeds `2,147,483,647`. Ensure an operand is Int64 before multiplication, as in the example. Casting only after a LongInt multiplication is too late.

A local civil day can contain 23 or 25 elapsed hours across daylight-saving transitions. Leap seconds are also outside ordinary Velox `TDateTime` arithmetic. Use calendar functions for civil dates and a defined UTC/elapsed-time contract for instants.

### Additional Technical Info
The modified PascalScript Classes compiler registers `MSecPerDay` from Delphi SysUtils as a signed `LongInt`. It is exactly `24 * 60 * 60 * 1000` nominal milliseconds. The published spelling is singular `MSec`, while Delphi source also describes the underlying RTL name as `MSecsPerDay`.

The value is useful for unit conversion of elapsed durations and timestamp fields whose contract explicitly uses nominal milliseconds. It is not a `TDateTime` day value and must not be added directly to one.

**Related Code Library entries**

- [SecsPerDay](SecsPerDay.md) - nominal seconds per day.
- [EIGHT_HOUR_MILL](EIGHT_HOUR_MILL.md) - nominal eight-hour millisecond interval.
- [Int64](../../Types/DataTypes/Int64.md) - safe storage for scaled durations.

**External references**

- [Embarcadero System.SysUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils) - declaring Delphi unit.
- [Free Pascal MSecsPerDay](https://www.freepascal.org/docs-html/rtl/sysutils/msecsperday.html) - compatible constant and formula.

<small>Created 2026-07-15</small>
