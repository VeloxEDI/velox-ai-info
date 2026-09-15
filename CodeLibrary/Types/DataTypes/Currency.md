---
title: Currency
description: Stores a signed 64-bit fixed-point monetary-style value scaled to exactly four decimal places.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, currency, fixed-point, decimal, money]
---

```Delphi
Currency
```

### Example

```Delphi
procedure AddTax(Net, Tax: Currency; var Gross: Currency);
begin
  Gross := Net + Tax;
end;
```

### Usage

`Currency` stores a signed 64-bit fixed-point monetary-style value scaled to exactly four decimal places.

### Additional Technical Info
`Currency` uses Delphi's signed 64-bit fixed-point representation scaled by 10,000. It provides four decimal places over approximately `-922,337,203,685,477.5808` through `922,337,203,685,477.5807`.

Use Currency when exactly four fractional decimal digits are sufficient, especially for amounts that should not accumulate binary floating-point representation error. It is not arbitrary-precision decimal: values with more than four decimal places must be rounded, and large arithmetic can overflow the 64-bit scaled range.

Define the business rounding rule before converting from Double, database decimal or text. Formatting/parsing can use the server's locale unless an invariant function/format is chosen. The Currency value itself contains no currency code, scale metadata or locale.

Database money/decimal types can have different ranges and scales. Validate both before binding. For interchange, send a documented decimal string or numeric schema rather than the in-memory scaled Int64 layout.

The example is source-reviewed only; no arithmetic was executed.

**External references**

- [Embarcadero real types](https://docwiki.embarcadero.com/RADStudio/en/Real_Types_(Delphi)) - Delphi Currency representation and range.
- [Free Pascal Currency](https://www.freepascal.org/docs-html/ref/refsu7.html) - compatible fixed-point type reference.

<small>Created 2026-07-15</small>
