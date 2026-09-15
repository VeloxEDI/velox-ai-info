---
title: ftCurrency
description: Identifies Delphi's signed fixed-point Currency field with four decimal places and scaled-Int64 range and rounding boundaries.
sidebar_position: 94
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, currency, fixed-point, decimal]
---

```Delphi
ftCurrency = 7
```

### Example

```Delphi
function IsFourDecimalCurrency(Field: TField): Boolean;
begin
  Result := Field.DataType = ftCurrency;
end;
```

### Usage

`ftCurrency` identifies Velox's signed fixed-point Currency field with four decimal places and scaled-Int64 range and rounding boundaries.

### Additional Technical Info
`ftCurrency` is declaration ordinal 7 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi Currency is a signed fixed-point value stored as an Int64 scaled by 10,000, giving four decimal places and an approximate range of -922,337,203,685,477.5808 through 922,337,203,685,477.5807.

It provides exact four-decimal arithmetic within range, but does not carry an ISO currency code. Values with more than four fractional digits require an explicit rounding rule; wider precision requires formatted BCD/provider decimal handling. Avoid routing amounts through binary Float or locale-formatted text.

The example only inspects metadata and was source-reviewed; no monetary calculation/dataset/database/runtime/image test ran.

**External references**

- [Embarcadero Currency type](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)#Real_Types).

<small>Created 2026-07-15</small>
