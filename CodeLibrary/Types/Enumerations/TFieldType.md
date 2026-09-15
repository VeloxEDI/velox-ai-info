---
title: TFieldType
description: Identifies the imported Delphi field, field-definition and parameter data kinds available to Velox scripts.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, dataset, field, datatype, parameter]
---

```Delphi
TFieldType = (ftUnknown, ftString, ftSmallint, ftInteger, ftWord, ftBoolean, ftFloat, ftCurrency, ftBCD, ftDate, ftTime, ftDateTime, ftBytes, ftVarBytes, ftAutoInc, ftBlob, ftMemo, ftGraphic, ftFmtMemo, ftParadoxOle, ftDBaseOle, ftTypedBinary, ftCursor, ftFixedChar, ftWideString, ftLargeint, ftADT, ftArray, ftReference, ftDataSet, ftOraBlob, ftOraClob, ftVariant, ftInterface, ftIDispatch, ftGuid, ftTimeStamp, ftFMTBcd, ftFixedWideChar, ftWideMemo, ftOraTimeStamp, ftOraInterval, ftLongWord, ftShortint, ftByte, ftExtended, ftConnection, ftParams, ftStream, ftTimeStampOffset, ftObject, ftSingle)
```

### Example

```Delphi
procedure DescribeFieldType(AType: TFieldType; var Value: Variant);
begin
  case AType of
    ftString, ftWideString, ftFixedChar, ftFixedWideChar, ftMemo, ftWideMemo:
      Value := 'text';
    ftSmallint, ftInteger, ftWord, ftLargeint, ftLongWord, ftShortint, ftByte:
      Value := 'integer';
    ftFloat, ftCurrency, ftBCD, ftFMTBcd, ftExtended, ftSingle:
      Value := 'numeric';
  else
    Value := 'other';
  end;
end;
```

### Usage

`TFieldType` identifies the field, field-definition and parameter data types available to Velox scripts.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| `ftUnknown` | 0 | Unknown or not-yet-resolved field type. |
| `ftString` | 1 | Variable-length narrow/ANSI string field. |
| `ftSmallint` | 2 | Signed 16-bit integer field. |
| `ftInteger` | 3 | Signed 32-bit integer field. |
| `ftWord` | 4 | Unsigned 16-bit integer field. |
| `ftBoolean` | 5 | Boolean field. |
| `ftFloat` | 6 | Double-precision floating field. |
| `ftCurrency` | 7 | Four-decimal Currency field. |
| `ftBCD` | 8 | BCD/decimal field compatible with Currency limits. |
| `ftDate` | 9 | Date-only field. |
| `ftTime` | 10 | Time-only field. |
| `ftDateTime` | 11 | Combined Velox date/time field. |
| `ftBytes` | 12 | Fixed-length byte field. |
| `ftVarBytes` | 13 | Variable-length byte field. |
| `ftAutoInc` | 14 | Auto-incrementing signed 32-bit field. |
| `ftBlob` | 15 | Unstructured binary large object. |
| `ftMemo` | 16 | Narrow/ANSI text large object. |
| `ftGraphic` | 17 | Graphic/blob field. |
| `ftFmtMemo` | 18 | Formatted memo field. |
| `ftParadoxOle` | 19 | Legacy Paradox OLE field. |
| `ftDBaseOle` | 20 | Legacy dBase OLE field. |
| `ftTypedBinary` | 21 | Typed binary field. |
| `ftCursor` | 22 | Cursor/result-set field. |
| `ftFixedChar` | 23 | Fixed-length narrow/ANSI character field. |
| `ftWideString` | 24 | Variable-length Unicode string field. |
| `ftLargeint` | 25 | Signed 64-bit integer field. |
| `ftADT` | 26 | Abstract data type field. |
| `ftArray` | 27 | Database array field. |
| `ftReference` | 28 | Database reference field. |
| `ftDataSet` | 29 | Nested dataset field. |
| `ftOraBlob` | 30 | Oracle-specific BLOB field. |
| `ftOraClob` | 31 | Oracle-specific CLOB field. |
| `ftVariant` | 32 | Variant-valued field. |
| `ftInterface` | 33 | Interface-valued field. |
| `ftIDispatch` | 34 | Automation `IDispatch` field. |
| `ftGuid` | 35 | GUID field. |
| `ftTimeStamp` | 36 | Timestamp record field. |
| `ftFMTBcd` | 37 | Formatted BCD field with explicit precision/scale support. |
| `ftFixedWideChar` | 38 | Fixed-length Unicode character field. |
| `ftWideMemo` | 39 | Unicode text large object. |
| `ftOraTimeStamp` | 40 | Oracle-specific timestamp field. |
| `ftOraInterval` | 41 | Oracle-specific interval field. |
| `ftLongWord` | 42 | Unsigned 32-bit integer field. |
| `ftShortint` | 43 | Signed 8-bit integer field. |
| `ftByte` | 44 | Unsigned 8-bit integer field. |
| `ftExtended` | 45 | Extended floating-point field. |
| `ftConnection` | 46 | Database connection-valued field. |
| `ftParams` | 47 | Parameter-collection field. |
| `ftStream` | 48 | Stream-valued field. |
| `ftTimeStampOffset` | 49 | Timestamp with UTC-offset data. |
| `ftObject` | 50 | Object-valued field. |
| `ftSingle` | 51 | Single-precision floating field. |

#### Behavior and boundaries

- Scripts can use the listed values through `ftSingle`; `ftLargeUint` is not available in Velox scripting.
- Do not store the numeric ordinals in configuration or external protocols. Store the member name because available values can change between Velox versions.
- `ftString`/`ftFixedChar` and `ftWideString`/`ftFixedWideChar` differ in character representation. Inspect actual field class, size and provider behavior before assuming an encoding.
- `ftBCD`, `ftFMTBcd`, `ftCurrency`, `ftFloat`, `ftExtended` and `ftSingle` have different precision/range models. Preserve precision and scale separately.
- Provider-specific and structured values may not support every `As...` conversion. Null state is separate from `TFieldType`.

### Additional Technical Info
`TFieldType` describes the logical data type of Delphi dataset fields, field definitions and parameters. It is metadata: it does not itself convert a value, guarantee a database server type, or describe nullability, size, precision, scale or encoding.

The Code Library index shows only the first 300 characters of this declaration and stops after `ftADT`. The complete current script registration continues through `ftSingle`, as shown above.

**Related Code Library entries**

- [TvxClientDataSet](../../Classes/Data/TvxClientDataSet.md) - script-visible dataset operations and field access.

**External references**

- [Embarcadero TFieldType](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) - current Delphi values and field meanings.
- [Free Pascal TFieldType](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) - compatible dataset field-kind reference.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal and enumeration semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration and ordinal concepts.

<small>Created 2026-07-15</small>
