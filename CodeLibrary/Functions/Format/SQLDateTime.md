---
title: "SQLDateTime"
description: "Formats a TDateTime as unquoted millisecond SQL date/time text, including zero as Delphi's epoch."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sql
  - datetime
  - format
  - microsoft-sql-server
  - locale
---

```Delphi
Function SQLDateTime(const ADate: TDateTime): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 19, 14, 30, 45, 125);
  Value := SQLDateTime(InputValue);
  // Usually 2026-07-19 14:30:45.125; the time separator is host-locale dependent.
end;
```

### Usage

`SQLDateTime` formats a TDateTime as unquoted millisecond SQL date/time text, including zero as Velox's epoch.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ADate` | `TDateTime`, `const` | Velox serial date/time. Zero is a valid value and receives no null treatment in this function. |

**Returns**

Unquoted text containing year-month-day, hour, minute, second and three millisecond digits. With the usual `:` time separator it resembles `2026-07-19 14:30:45.125`.

**Exact output rules**

- `YYYY`, `MM`, `DD`, `HH`, `NN`, `SS` and `ZZZ` output padded numeric fields.
- Hyphens, the space and period are ordinary literal characters in Velox's date/time pattern.
- The two unquoted `:` characters are **locale time-separator placeholders**. They normally emit `:`, but can emit another system-locale separator.
- `ZZZ` is the millisecond field decoded from `TDateTime`; it does not preserve finer-than-millisecond input or negotiate database column precision.
- No outer single quotes are included.

**Errors**

Velox catches no exception. Invalid serial values, locale/runtime failures and allocation errors propagate. Database conversion errors can still occur later when a consumer parses the returned text.

**Usage notes**

Use `SQLDateTime` only when an unquoted text representation is explicitly required. For SQL commands, a typed parameter carries both value and null state more reliably than interpolated text.

### Additional Technical Info
`SQLDateTime` converts a `TDateTime` to unquoted text using Velox's fixed legacy Microsoft SQL pattern `YYYY-MM-DD HH:NN:SS.ZZZ`. It is registered as a friendlier script name for the native `MSSQLDateTime` helper.

Despite its name, the result is only date/time text. It is not a quoted SQL literal, a database parameter, a timezone conversion or a guarantee that a particular server/session will parse the text.

The example is fictional and source-reviewed. It was not executed or sent to a database by the documentation workflow.

**Implementation**

The SQL-format import registers runtime name `SQLDateTime` to `vxSQLFormat.MSSQLDateTime`. That implementation performs one call:

```Delphi
vxFormatDateTime('YYYY-MM-DD HH:NN:SS.ZZZ', ADate)
```

`vxFormatDateTime` creates `TFormatSettings(LOCALE_SYSTEM_DEFAULT)` and delegates to Delphi `DateTimeToString`. The SQL helper adds no quote, zero branch, range check or exception handling.

**Zero and null behavior**

`ADate = 0` is not null here. Delphi `TDateTime(0)` represents 1899-12-30 00:00:00, so the usual-locale result is `1899-12-30 00:00:00.000`. This deliberately differs from [`SQLDateTimeString`](SQLDateTimeString.md), which returns `NULL` for the same input.

**Edge cases and quirks**

- The function's native name and comment say it is for Microsoft SQL parameter formatting, but returning text is not the same as binding a typed parameter.
- Because time separators are locale-sensitive, the result is not completely culture-invariant even though all fields are numeric.
- `TDateTime` contains no timezone or offset. The output does not state whether fields are UTC, local time or a business-local wall clock.
- Negative or out-of-normal-range serials follow Delphi date decoding rules and may fail.
- SQL Server type precision/rounding is not modeled. For example, legacy `datetime` and `datetime2` have different supported precision and ranges.
- The function does not inspect a connection type, database session language, date format or target column.
- Concatenating the unquoted result into SQL produces syntax that depends on surrounding SQL and server parsing. Prefer typed query parameters.

**Side effects**

Reads Windows locale data and allocates a result. It performs no database call and changes no state.

**Performance and concurrency**

One locale snapshot and one date/time formatting operation per call. No shared mutable Delphi format record is used.

**Related entries**

- [`SQLDateTimeString`](SQLDateTimeString.md) returns `NULL` for zero and surrounds nonzero text with single quotes.
- [`vxFormatDateTime`](vxFormatDateTime.md) is the formatter used by this helper.
- [`FormatDateTime`](FormatDateTime.md) accepts a caller-supplied date/time pattern.
- [`EncodeDateTime`](../DateTime/EncodeDateTime.md) constructs the value shown in the example.

**External references**

The SQL wrapper is Velox-specific. These references document its Delphi formatting terminal:

- [Embarcadero `System.SysUtils.FormatDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FormatDateTime)
- [Free Pascal `FormatDateTime`](https://www.freepascal.org/docs-html/rtl/sysutils/formatdatetime.html) - compatibility context only.

<small>Created 2026-07-15</small>
