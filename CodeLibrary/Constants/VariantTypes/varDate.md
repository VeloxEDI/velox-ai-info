---
title: varDate
description: Identifies an OLE Automation date/time Variant stored as a floating day count compatible with Delphi TDateTime.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, date, tdatetime]
---

```Delphi
varDate = 7
```

### Example

```Delphi
function IsVariantDate(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varDate;
end;
```

### Usage

`varDate` identifies an OLE Automation date/time Variant stored as a floating day count compatible with Velox TDateTime.

### Additional Technical Info
`varDate` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0007` for an OLE Automation date/time. Delphi stores it as `TDateTime`, a `Double`-compatible count of days relative to 30 December 1899; the fractional part represents time of day.

The tag contains no timezone, UTC offset, calendar-format text, precision guarantee or business meaning such as invoice date versus processing timestamp. A value passed between systems must carry those rules in the integration contract.

**Conversion boundaries**

- Binary floating representation limits precision, particularly far from the epoch. Repeated text/number conversions can lose sub-second detail.
- Negative day values have historical fractional-date semantics that should be handled through date routines rather than hand-written arithmetic.
- Text-to-date conversion can depend on format and locale. Prefer explicit Velox parsing/formatting functions and governed formats.
- Spreadsheet serial dates use related but not universally identical epoch/leap-year rules; do not assume direct numeric interchange.
- Null, Empty and zero are distinct. Numeric zero is a valid date value at the Delphi epoch.

[`VarAsType`](../../Functions/Variant/VarAsType.md) can request this representation and may raise for invalid or out-of-range input. [`VarType`](../../Functions/Variant/VarType.md) only reports the raw tag; mask away array/reference flags before a base-type comparison.

The example is source-reviewed only; no date was parsed or converted.

**External references**

- [Embarcadero `TDateTime`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TDateTime)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varDate`](https://www.freepascal.org/docs-html/rtl/system/vardate.html)

<small>Created 2026-07-15</small>
