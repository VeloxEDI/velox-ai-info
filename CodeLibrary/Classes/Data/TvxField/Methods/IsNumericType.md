---
title: IsNumericType
description: Reports whether the field DataType belongs to Velox's fixed numeric and date/time set.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, numeric, datatype, boolean, date]
---

```Delphi
function IsNumericType: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Field.IsNumericType;
end;
```

### Usage

`IsNumericType` reports whether the field DataType belongs to Velox's fixed numeric and date/time set.

### Additional Technical Info
`IsNumericType` performs a fixed `DataType in [...]` membership test.

It returns true for:

```text
ftSmallint, ftInteger, ftWord, ftBoolean, ftFloat, ftCurrency,
ftBCD, ftDate, ftTime, ftDateTime, ftAutoInc, ftLargeint,
ftFMTBcd, ftSingle, ftExtended, ftShortint, ftByte, ftLongWord,
ftTimeStamp
```

The source lists `ftLongWord` twice; set membership makes the duplicate harmless. Boolean and date/time values are deliberately included because [`IsNullZero`](IsNullZero.md) and [`SetIfZero`](SetIfZero.md) compare this group with zero. All [`IsDateType`](IsDateType.md) values are therefore also numeric by this method.

This is not a general conversion-capability test. Unlisted field types return false, including `ftTimeStampOffset` and any later/specialised numeric-like types. Check the concrete field and intended conversion separately.

**Registration quirk**

The PascalScript compiler registration string contains an extra final `)` after `boolean`. Its method parser completes the return type before that trailing token, while the runtime importer binds `TvxField.IsNumericType` under the expected name. The function is therefore available; the punctuation is a product-source cleanup item rather than a different signature.

The method is a constant-time read with no value/cursor side effect. An invalid field reference remains unsafe.

**External references**

- [Embarcadero DocWiki: `TField.DataType`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.DataType) documents the inspected field-type property.
- [Free Pascal: `TField.DataType`](https://www.freepascal.org/docs-html/fcl/db/tfield.datatype.html) provides compatible context; the exact set and Boolean/date classification are Velox-defined.

<small>Created 2026-07-15</small>
