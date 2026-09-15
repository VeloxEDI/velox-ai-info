---
title: ftBCD
description: Identifies the Currency-compatible BCD decimal field family, distinct from binary floating point and from the wider formatted-BCD type.
sidebar_position: 88
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, bcd, decimal, precision]
---

```Delphi
ftBCD = 8
```

### Example

```Delphi
function IsCurrencyCompatibleDecimal(Field: TField): Boolean;
begin
  Result := Field.DataType = ftBCD;
end;
```

### Usage

`ftBCD` identifies the Currency-compatible BCD decimal field family, distinct from binary floating point and from the wider formatted-BCD type.

### Additional Technical Info
`ftBCD` is declaration ordinal 8 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies Delphi's conventional BCD field family, whose common value interface is compatible with `Currency` limits. It is decimal metadata, not a binary `Double`.

Inspect field/provider precision and scale rather than assuming that every database DECIMAL maps losslessly. Values outside Currency-compatible range/scale may require [`ftFMTBcd`](ftFMTBcd.md) or provider-specific handling. Conversion through Float/String can round or become locale-dependent; Null remains a separate field state.

The example only inspects metadata and was source-reviewed; no BCD conversion/dataset/database/runtime/image test ran.

**External references**

- [Embarcadero `TBCDField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TBCDField).
- [Free Pascal `TBCDField`](https://www.freepascal.org/docs-html/fcl/db/tbcdfield.html).

<small>Created 2026-07-15</small>
