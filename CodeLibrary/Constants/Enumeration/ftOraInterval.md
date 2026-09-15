---
title: ftOraInterval
description: Identifies an Oracle interval value that the installed Delphi field table exposes through provider-formatted string data.
sidebar_position: 117
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, oracle, interval, duration]
---

```Delphi
ftOraInterval = 41
```

### Example

```Delphi
function IsOracleInterval(Field: TField): Boolean;
begin
  Result := Field.DataType = ftOraInterval;
end;
```

### Usage

`ftOraInterval` identifies an Oracle interval value that the Velox field table exposes through provider-formatted string data.

### Additional Technical Info
`ftOraInterval` is declaration ordinal 41 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It marks an Oracle interval, not a timestamp or a Delphi `TDateTime` instant.

The installed RTL's default field-class table maps this member to `TStringField`. Therefore the concrete Oracle/provider layer supplies the interval grammar, precision and sign, and script code normally receives provider-formatted text. Do not assume that every driver emits the same representation or that Delphi date parsing can consume it.

Oracle distinguishes year-to-month intervals from day-to-second intervals. Months are calendar units rather than fixed day counts; elapsed seconds cannot preserve a year/month interval without a reference date. Conversely, converting a day/second interval to a `TDateTime` obscures its duration semantics and can introduce epoch/timezone mistakes.

Parse only against the exact column/provider contract, preserve sign and fractional precision, and define overflow/range handling. When moving the value to another system, transmit structured components or a mutually agreed standard representation rather than field display text. Null remains distinct from a textual zero interval.

The example only inspects metadata and was source-reviewed; no Oracle connection, interval parser, clock, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TStringField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TStringField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; Oracle interval grammar/provider parity is not implied.

<small>Created 2026-07-15</small>
