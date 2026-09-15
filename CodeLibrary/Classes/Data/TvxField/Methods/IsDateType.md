---
title: IsDateType
description: Reports whether the field DataType belongs to Velox's fixed four-member date/time set.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, date, time, datatype]
---

```Delphi
function IsDateType: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Field.IsDateType;
end;
```

### Usage

`IsDateType` reports whether the field DataType belongs to Velox's fixed four-member date/time set.

### Additional Technical Info
`IsDateType` compares the live field's inherited `DataType` with a hard-coded set.

It returns true only for:

| `TFieldType` | Meaning |
|---|---|
| `ftDate` | date |
| `ftTime` | time |
| `ftDateTime` | combined Delphi date/time |
| `ftTimeStamp` | SQL timestamp |

It returns false for every other value, including `ftTimeStampOffset`. This is an exact implementation list, not a test of whether the concrete field can convert through `AsDateTime`.

All four date types also occur in Velox [`IsNumericType`](IsNumericType.md), so callers should not treat the two predicates as mutually exclusive. The overlap is intentional in zero-sentinel helpers because Delphi dates/times are represented numerically and zero is a meaningful sentinel.

The read is constant-time, has no side effects and normally cannot raise while the field reference is valid. The field/dataset remains externally owned and unsynchronised.

**External references**

- [Embarcadero DocWiki: `TField.DataType`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.DataType) documents the property inspected by Velox.
- [Free Pascal: `TField.DataType`](https://www.freepascal.org/docs-html/fcl/db/tfield.datatype.html) supplies compatible field-type context; exact membership above is Velox-defined.

<small>Created 2026-07-15</small>
