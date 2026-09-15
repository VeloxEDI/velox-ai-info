---
title: "Format"
description: "Functions for formatting argument arrays, floating-point values, currency and date/time values, including SQL-oriented text."
sidebar_position: 14
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - format
  - locale
  - datetime
  - numeric
---

The Format group turns typed values into text using Delphi masks or Velox wrappers. It covers placeholder-based argument formatting, numeric and currency masks, date/time tokens, and two Microsoft-SQL-oriented date/time literal helpers.

## Common tasks

- Use [`Format`](Format/Format.md) or [`vxFormat`](Format/vxFormat.md) for placeholder-based text assembled from an open argument array; compare their locale-settings paths before choosing.
- Use [`FormatFloat`](Format/FormatFloat.md), [`vxFormatFloat`](Format/vxFormatFloat.md) or [`vxFormatCurr`](Format/vxFormatCurr.md) for explicit numeric masks and the documented value type.
- Use [`FormatDateTime`](Format/FormatDateTime.md) or [`vxFormatDateTime`](Format/vxFormatDateTime.md) for Delphi date/time tokens.
- Use [`SQLDateTime`](Format/SQLDateTime.md) and [`SQLDateTimeString`](Format/SQLDateTimeString.md) only when their exact SQL text and zero-value convention match the target.

## Locale and determinism

Mask syntax and format settings are part of the output contract. Several entries create a fresh Windows system-locale snapshot, while `vx...` wrappers follow their own explicit settings route. Decimal/group separators, month/day names, AM/PM text and other locale-dependent fields can therefore change between service identities, hosts or operating-system configuration.

For an interchange format, choose an explicit fixed mask and verify that the selected function supplies deterministic separators and language. Formatting a value does not record its timezone, units, currency or business meaning.

## Important differences

Placeholder formatting consumes an open array of Variants and can fail on an incompatible placeholder, missing argument or unsupported conversion. Numeric formatting operates on binary floating-point or fixed-point `Currency` according to the selected declaration; it does not add a business rounding policy automatically.

Date/time formatting operates on Delphi `TDateTime`, which has no timezone marker. The physical [`FormatDateTime`](Format/FormatDateTime.md) page is a known generated/index anomaly but remains the authoritative documentation for the callable entry.

The SQL helpers return text fragments, not bound parameters. They do not validate SQL dialect, column type, date range, session language or injection safety for surrounding concatenated content. Prefer database parameters where the active API supports them.
