---
title: DateDelta
description: "Defines Delphi's 693,594-day offset between TDateTime serial dates and the internal TTimeStamp date ordinal."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, datedelta, tdatetime, timestamp, ordinal]
---

```Delphi
DateDelta = 693594
```

### Example

```Delphi
function IsDelphiZeroTimestampDate(const TimestampDate: Integer): Boolean;
begin
  Result := TimestampDate = DateDelta;
end;
```

### Usage

`DateDelta` defines Velox's 693,594-day offset between `TDateTime` serial dates and `TTimeStamp` day numbering.

### Additional Technical Info
`DateDelta` is registered by the modified PascalScript Classes compiler and matches Delphi `System.SysUtils.DateDelta`. It is an internal ordinal offset used when converting between a floating [`TDateTime`](../../Types/DataTypes/TDateTime.md) and the `Date` member of Delphi's millisecond `TTimeStamp` record.

For an ordinary nonnegative value, current Delphi `DateTimeToTimeStamp` stores `DateDelta + Trunc(DateTime)`. Therefore `TDateTime(0)`, whose civil date is 30 December 1899, maps to timestamp `Date = 693594`. The reverse routine subtracts `DateDelta` before rebuilding the floating serial.

This is not a duration constant for application scheduling, and it is not the Unix epoch offset. In particular:

- adding it to a normal `TDateTime` does not convert local time to UTC;
- it does not convert seconds or milliseconds;
- Unix conversion uses a separate 25,569-day basis plus UTC/local handling; and
- negative Delphi serials require the RTL's sign-aware conversion rather than a simple `Trunc(Value) + DateDelta` formula.

The installed SysUtils source contains historically awkward comments: the public declaration describes days through 31 December 1899, while the conversion code identifies `DateDelta` as the timestamp date corresponding to Delphi's zero day, 30 December 1899. Rely on the value and traced conversion routines, not an inferred inclusive/exclusive calendar count.

Use the public date/time conversion functions unless an external binary/API contract explicitly requires a Delphi `TTimeStamp.Date` ordinal. The example only identifies that internal zero-day ordinal; it does not convert a complete timestamp and was not executed.

**Related Code Library entries**

- [TDateTime](../../Types/DataTypes/TDateTime.md) - Delphi floating date/time representation.
- [Date & Time constants](../DateTime.md) - unit and calendar constants; none substitutes for this offset.

**External references**

- [Embarcadero System.SysUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils) - declaring RTL unit and timestamp routines.
- [Free Pascal DateDelta](https://www.freepascal.org/docs-html/rtl/sysutils/datedelta.html) - compatible value and epoch-offset description.

<small>Created 2026-07-15</small>
