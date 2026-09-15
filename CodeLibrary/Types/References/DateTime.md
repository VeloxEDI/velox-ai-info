---
title: DateTime
description: "Aliases TDateTime's timezone-free Double serial value without conversion, validation, formatting, or added precision."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, reference, alias, datetime, double, timezone]
---

```Delphi
DateTime = TDateTime
```

### Example

```Delphi
procedure BuildDate(var Value: DateTime);
begin
  Value := EncodeDate(2026, 7, 20) + EncodeTime(14, 30, 0, 0);
end;
```

### Usage

Aliases TDateTime's timezone-free Double serial value without conversion, validation, formatting, or added precision.

#### Information the alias does not carry

A `DateTime` value contains no timezone, UTC/local flag, offset, locale, text format or daylight-saving rule. `Now` produces server-local clock time, while UTC helpers can produce a UTC clock encoded in the same undifferentiated numeric type. The consumer must know which basis applies.

The alias adds no validity range or precision guarantee. Raw day fractions are binary floating-point values; calendar operations, negative serials and sub-millisecond boundaries require the documented date functions rather than casual `Trunc`/`Frac` logic. Database, JSON and partner-system boundaries need an explicit format and timezone contract.

Text conversion remains function- and locale-dependent. Assigning a string to the alias is not a documented parse operation; use the appropriate conversion function and handle its error/success contract. Likewise, assignment between `DateTime`, `TDateTime` and `Double` does not transform local time into UTC.

### Additional Technical Info
`DateTime` is installed during every Velox script compilation with `AddTypeCopyN('DateTime', 'TDateTime')`. It is compile-time-equivalent to [`TDateTime`](../DataTypes/TDateTime.md), not a parser, formatter, timezone-aware record or conversion function.

The target is stored as a Delphi/PascalScript `Double`: its integral portion represents days relative to 30 December 1899 and its fractional magnitude represents time of day. Assignment copies that floating value. Parameters declared with either spelling accept the same representation, and arithmetic and comparison have exactly the target type's behavior.

**Related Code Library entries**

- [TDateTime](../DataTypes/TDateTime.md) - full representation, epoch, precision and boundary guidance.
- [Date & Time functions](../../Functions/DateTime.md) - supported construction, extraction, comparison and arithmetic.

**External references**

- [Embarcadero TDateTime](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TDateTime) - Delphi representation and epoch.
- [Free Pascal TDateTime](https://www.freepascal.org/docs-html/rtl/sysutils/tdatetime.html) - compatible serial-date reference.

<small>Created 2026-07-15</small>
