---
title: ftFMTBcd
description: Identifies formatted BCD decimal fields that retain explicit precision and scale beyond the conventional Currency-compatible BCD family.
sidebar_position: 104
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, fmtbcd, decimal, precision, scale]
---

```Delphi
ftFMTBcd = 37
```

### Example

```Delphi
function IsFormattedBCD(Field: TField): Boolean;
begin
  Result := Field.DataType = ftFMTBcd;
end;
```

### Usage

`ftFMTBcd` identifies formatted BCD decimal fields that retain explicit precision and scale beyond the conventional Currency-compatible BCD family.

### Additional Technical Info
`ftFMTBcd` is declaration ordinal 37 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies formatted BCD decimal fields, for which precision and scale are separate, material schema properties.

The enum alone does not state either value. Inspect the actual field definition/provider and keep arithmetic/serialization in a decimal-capable representation. Converting to Currency can lose range/scale; converting to Float can lose decimal exactness. Define rounding explicitly whenever a destination has narrower scale.

The example only inspects metadata and was source-reviewed; no BCD conversion/dataset/database/runtime/image test ran.

**External references**

- [Embarcadero `TFMTBCDField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFMTBCDField).
- [Free Pascal `TFmtBCDField`](https://www.freepascal.org/docs-html/fcl/db/tfmtbcdfield.html).

<small>Created 2026-07-15</small>
