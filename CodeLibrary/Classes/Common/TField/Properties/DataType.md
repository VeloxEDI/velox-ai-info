---
title: DataType
description: Identifies the concrete field's Delphi TFieldType category for selecting safe value, conversion and serialization logic.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-10-20T23:50:34Z"
keywords: [velox, scripting, hidden-ancestor, tfield, datatype, tfieldtype, schema]
---

```Delphi
property DataType: TFieldType read;
```

### Example

```Delphi
function IsTextField(const Data: TvxClientDataSet; const Name: string): Boolean;
var
  Kind: TFieldType;
begin
  Kind := Data.FieldByName(Name).DataType;
  Result := (Kind = ftString) or (Kind = ftWideString) or
            (Kind = ftMemo) or (Kind = ftWideMemo);
end;
```

### Usage

`DataType` identifies the field's Velox TFieldType category for selecting safe value, conversion and serialisation logic.

- Branch on explicit comparisons of supported types and include an error/default branch for future or provider-specific values.
- Combine this property with [`Size`](Size.md), [`DataSize`](DataSize.md), [`Required`](Required.md) and external schema knowledge where needed.
- Do not persist raw ordinal integers across Velox versions; use the named enumeration values in scripts.

### Additional Technical Info
`DataType` is the read-only `TFieldType` assigned by the concrete field class and dataset field metadata.

#### Example compatibility

The example uses explicit enumeration comparisons as a conservative [scripting compatibility convention](../../../../../instructions/scripts/compatibility.md). This does not establish that enumeration-set membership is unsupported. No actual Velox compilation was performed for this example update.

#### Source-backed behaviour

The runtime helper returns the native `TField.DataType` without transformation. Constructors and field-definition binding set it internally; scripts cannot assign it through this property. The registered `TFieldType` enumeration includes ordinary string, numeric, date/time, blob, object, variant and newer Delphi categories through `ftSingle`.

The value is the primary discriminator for which typed `As...` conversions and serialization rules are safe, but it does not contain string encoding, numeric precision/scale, nullability, display format or database-provider type details. A concrete class may support extra conversions beyond its nominal type, and the Velox `TvxField` overlay groups several types for convenience without changing this native value.

#### Official RTL references

- [Embarcadero: TField.DataType](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.DataType)
- [Free Pascal: TField.DataType](https://www.freepascal.org/docs-html/current/fcl/db/tfield.datatype.html)

<small>Created 2026-07-15</small>
