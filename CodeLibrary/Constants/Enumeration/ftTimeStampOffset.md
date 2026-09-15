---
title: ftTimeStampOffset
description: Identifies a structured SQL timestamp that retains separate timezone-hour and timezone-minute offset components.
sidebar_position: 129
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, timestamp, timezone, offset, sqltimestamp]
---

```Delphi
ftTimeStampOffset = 49
```

### Example

```Delphi
function HasTimestampOffset(Field: TField): Boolean;
begin
  Result := Field.DataType = ftTimeStampOffset;
end;
```

### Usage

`ftTimeStampOffset` identifies a structured SQL timestamp that retains separate timezone-hour and timezone-minute offset components.

### Additional Technical Info
`ftTimeStampOffset` is declaration ordinal 49 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TSQLTimeStampOffsetField`. Its structured value extends the calendar/clock/millisecond components with signed `TimeZoneHour` and `TimeZoneMinute` fields.

Preserve the structured value or its custom Variant when the original offset matters. `AsDateTime` converts the represented instant into the current host's local civil time and discards the original offset components. The same stored row can therefore yield a different wall-clock `TDateTime` on hosts in different zones. Conversely, assigning a plain `TDateTime` attaches the host-local UTC offset for that date. A plain `TDateTime` has no zone flag, so this inference can be wrong for values intended as UTC or another locality.

Current Delphi paths use inconsistent minute-sign conventions for west-of-UTC fractional-hour offsets. Text parsing of `-03:30` stores hour `-3` and minute `+30`; formatting reproduces `-03:30`, but instant conversion combines those as `-150` rather than `-210` minutes. `-00:30` loses its negative sign entirely. In the other direction, host-local offset inference obtains both negative hour and negative minute components from a negative `TTimeSpan`; the formatter passes that negative minute to `EncodeTime`, which can raise instead of formatting it. Avoid the affected text/`AsDateTime` round trips, retain and validate the structured/original value, and test the actual provider for any west-of-UTC fractional-hour zone.

Null is separate from the all-zero record. Fractional precision can be rounded by provider conversions. An offset identifies an instant but not a named timezone or its daylight-saving history; store a zone identifier separately when future civil-time rules matter.

The example only inspects metadata and was source-reviewed; no clock, timezone, timestamp conversion, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType), [`TSQLTimeStampOffsetField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TSQLTimeStampOffsetField) and [`TSQLTimeStampOffset`](https://docwiki.embarcadero.com/Libraries/en/API:Data.SqlTimSt.TSQLTimeStampOffset).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; offset-record behavior is not assumed identical.

<small>Created 2026-07-15</small>
