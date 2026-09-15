---
title: ftTime
description: Identifies time-only field metadata exposed through TTimeField without a date, timezone or guaranteed duration interpretation.
sidebar_position: 127
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, time, tdatetime]
---

```Delphi
ftTime = 10
```

### Example

```Delphi
function IsTimeOnly(Field: TField): Boolean;
begin
  Result := Field.DataType = ftTime;
end;
```

### Usage

`ftTime` identifies time-only field metadata exposed through TTimeField without a date, timezone or guaranteed duration interpretation.

### Additional Technical Info
`ftTime` is declaration ordinal 10 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TTimeField`, a `TDateTimeField` descendant with a four-byte provider data size and a public `TDateTime` conversion surface.

The field contains no date or timezone. A clock time such as 09:00 is not an instant until a date and zone are supplied, and daylight-saving rules cannot be applied correctly without both. It is also not automatically a duration.

The installed string setter accepts a leading minus and stores the negative result of `StrToTime`; display adds the minus sign back. That RTL capability is unusual for a time-of-day field and provider support can differ. Do not use negative values as portable elapsed durations without an explicit schema contract.

Text parsing uses current host `FormatSettings`; display defaults to the long-time format. Empty text clears the field. Null and midnight both produce `AsDateTime = 0`, so test `IsNull` or use `AsVariant` when that distinction matters. Provider precision may round fractional seconds.

The example only inspects metadata and was source-reviewed; no clock, timezone, parsing, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType), [`TTimeField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TTimeField) and [`TDateTime`](https://docwiki.embarcadero.com/Libraries/en/System.TDateTime).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TTimeField`](https://www.freepascal.org/docs-html/fcl/db/ttimefield.html) compatibility references.

<small>Created 2026-07-15</small>
