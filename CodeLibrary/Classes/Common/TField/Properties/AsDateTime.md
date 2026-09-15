---
title: AsDateTime
description: Reads or writes the concrete field as a Delphi TDateTime value without adding time-zone information or applying display formatting.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, tdatetime, date, time]
---

```Delphi
property AsDateTime: TDateTime read write;
```

### Example

```Delphi
procedure CopyCreatedTime(const Source, Target: TvxClientDataSet);
begin
  Target.FieldByName('CreatedAt').AsDateTime :=
    Source.FieldByName('CreatedAt').AsDateTime;
end;
```

### Usage

`AsDateTime` reads or writes the field as a Velox TDateTime value without adding time-zone information or applying display formatting.

- Confirm `DataType` is date/time compatible before access.
- Keep time-zone interpretation in the integration contract; this property cannot preserve an offset.
- Use [`Text`](Text.md) or [`DisplayText`](DisplayText.md) only for presentation, not lossless transfer.

### Additional Technical Info
`AsDateTime` exposes the concrete field's conversion to Delphi `TDateTime`, whose integral part is a date and fractional part is a time of day. It carries no time-zone or UTC-offset metadata.

#### Source-backed behaviour

Base `TField` raises a field-access error for both read and write. [`TDateTimeField`](../../../Data/TDateTimeField.md) and its date/time descendants implement the native buffer conversion; compatible string and timestamp descendants can also convert. A null date/time field generally reads `0.0`, which is a valid Delphi date value rather than a null marker. Check [`IsNull`](IsNull.md) before reading when absence matters.

Assignment writes the numeric Delphi value to the pending dataset record. It does not parse a mask, use `DisplayFormat`, or convert between local time and UTC. String-field conversion can use runtime locale parsing, so it should not be used as a substitute for an explicit governed parser. `TvxField.AsDateTime` is an API overlay that casts the underlying object to `TDateTimeField`; using it on a non-date field is unsafe even if the symbol is visible.

#### Official RTL references

- [Embarcadero: TField.AsDateTime](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsDateTime)
- [Free Pascal: TField.AsDateTime](https://www.freepascal.org/docs-html/current/fcl/db/tfield.asdatetime.html)

<small>Created 2026-07-15</small>
