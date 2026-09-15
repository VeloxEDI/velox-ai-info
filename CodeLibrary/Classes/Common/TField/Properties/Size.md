---
title: Size
description: Gets or sets descendant-specific field schema size while the owning dataset is inactive; meaning varies by string, byte, BCD and fixed-size types.
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, size, schema, inactive-dataset]
---

```Delphi
property Size: Integer read write;
```

### Example

```Delphi
function DeclaredFieldSize(const Data: TvxClientDataSet; const Name: string): Integer;
begin
  Result := Data.FieldByName(Name).Size;
end;
```

### Usage

Gets or sets type-specific field schema size while the owning dataset is inactive; meaning varies by string, byte, BCD and fixed-size types.

- Configure size before opening fields/datasets, preferably through governed module/query configuration.
- Interpret units using `DataType` and the field class; do not assume bytes equal characters.
- Do not change it merely to bypass an overlength value—fix the integration/schema contract.

### Additional Technical Info
`Size` is field-definition metadata whose units and valid range are defined by the concrete field class.

#### Source-backed behaviour

The base getter returns `FSize`. The setter calls `CheckInactive`, calls virtual `CheckTypeSize`, then stores the value. Base `TField.CheckTypeSize` permits only zero for non-blob fields; descendants override it. String descendants accept non-negative character lengths, byte/varbyte and BCD descendants apply their own size/precision semantics, and fixed-size numeric/date fields conventionally use zero. Assigning while the dataset is active or opening raises.

The value is not [`DataSize`](DataSize.md), which reports native buffer bytes, and not [`DisplayWidth`](DisplayWidth.md). Changing it does not resize an already-open database column or update an external schema. A value acceptable to the Delphi class can still disagree with provider/database metadata and fail when the dataset opens or persists data.

#### Official RTL references

- [Embarcadero: TField.Size](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.Size)
- [Free Pascal: TField.Size](https://www.freepascal.org/docs-html/current/fcl/db/tfield.size.html)

<small>Created 2026-07-15</small>
