---
title: AsCurrency
description: Reads or writes a field as Delphi Currency while preserving only the precision and range supported by the concrete field conversion path.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, currency, fixed-point, conversion]
---

```Delphi
property AsCurrency: Currency read write;
```

### Example

```Delphi
function ExtendedPrice(const Data: TvxClientDataSet): Currency;
begin
  Result := Data.FieldByName('UnitPrice').AsCurrency *
    Data.FieldByName('Quantity').AsInteger;
end;
```

### Usage

`AsCurrency` reads or writes a field as Velox Currency while preserving only the precision and range supported by the field conversion path.

- Inspect [`DataType`](DataType.md) and the database column precision before monetary calculations.
- Avoid round-tripping high-scale BCD values through this property when more than four fractional digits matter.
- Enter edit/insert state before assignment and treat `Post` as a client-buffer operation unless the surrounding flow explicitly persists it.

### Additional Technical Info
`AsCurrency` requests the current field value as Delphi's fixed-point `Currency` type or assigns such a value through the actual field descendant.

#### Source-backed behaviour

The PascalScript helper is a direct native-property call. Base `TField.GetAsCurrency` returns `GetAsFloat`, and base `SetAsCurrency` calls `SetAsFloat`. Consequently a descendant that implements only the floating conversion can route Currency through `Double`, even though Delphi `Currency` itself is a signed scaled integer with four decimal places. Currency, BCD/FMTBcd and numeric descendants can override this path and impose their own precision, scale and range.

A null numeric field commonly reads zero through its concrete getter, so use [`IsNull`](IsNull.md) when null and monetary zero have different meanings. Writing follows the client dataset edit/validation/DSBase verification path and can round, reject overflow, or lose precision according to the destination field class. It does not format a culture-specific monetary string; [`DisplayText`](DisplayText.md) is the presentation path.

#### Official RTL references

- [Embarcadero: TField.AsCurrency](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsCurrency)
- [Free Pascal: TField.AsCurrency](https://www.freepascal.org/docs-html/current/fcl/db/tfield.ascurrency.html)

<small>Created 2026-07-15</small>
