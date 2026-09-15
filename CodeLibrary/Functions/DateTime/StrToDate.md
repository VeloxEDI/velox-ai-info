---
title: "StrToDate"
description: "Parses a date string with the Velox process's global host format settings and raises when parsing fails."
sidebar_position: 141
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - parsing
  - locale
  - conversion
---

```Delphi
function StrToDate(const S: string): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // This input assumes the Velox host uses a day/month/year short-date format.
  Value := StrToDate('16/07/2026');
end;
```

### Usage

`StrToDate` parses a date string with the Velox process's global host format settings and raises when parsing fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Date text expected to match the host process's short-date format, separators, names and year rules. |

**Returns**

A `TDateTime` containing the parsed Gregorian date with a zero time portion.

**Behaviour**

- Numeric field order follows `FormatSettings.ShortDateFormat`; a portable script cannot assume day/month/year or month/day/year.
- Named months/day names are compared against the format settings when the active pattern requests them.
- A missing year is replaced with the host's current year. A missing day becomes day one where the active format permits omission. A month is required.
- A short year is expanded using `TwoDigitYearCenturyWindow`.
- Leading or embedded blanks accepted around configured separators depend on the active date format; trailing unconsumed text fails.
- The result is date-only at midnight and carries no timezone.

**Errors**

Invalid syntax, invalid field combinations or unmatched locale text raise `EConvertError`. The exception includes locale/runtime text and the supplied value; do not parse the message as an interface. Velox does not catch it.

**Usage notes**

For integration data, avoid relying on a server's interactive regional settings. Use a deliberately specified Velox date format/conversion path when the source format is contractually fixed.

### Additional Technical Info
`StrToDate` parses a date-only string using the Velox process's current global date-format settings. It returns the encoded date at midnight or raises when the entire string cannot be parsed.

The example is fictional, source-reviewed and intentionally locale-dependent. It was not executed by the documentation workflow.

**Implementation**

The modified PascalScript date library declares `StrToDate` and runtime-registers `System.SysUtils.StrToDate(S)` directly. The installed Delphi 37.0 overload passes the process-global `FormatSettings` record to `TryStrToDate`. Its scanner parses `ShortDateFormat`, `DateSeparator`, locale month/day names and era rules, requires the parser to consume the full string, and then calls `TryEncodeDate`. Failure is converted to `EConvertError`.

**Edge cases and quirks**

- The same text can mean different dates or fail on different Velox hosts because the one-argument overload always uses global process settings.
- Omitting a year introduces a current-clock dependency, so the same input can produce a different year later.
- Concurrent mutation of global `FormatSettings` can race with parsing. Prefer an unambiguous governed input format and a matching Velox conversion helper where available.
- The input is not treated as ISO 8601 merely because it resembles one; the active short-date pattern remains authoritative.
- Free Pascal offers the same one-argument and format-settings concepts, but parser details and accepted text can differ. Installed Delphi defines Velox behaviour.

**Side effects**

No persistent state is changed. The routine reads global format settings and, when needed, the current year.

**Performance and concurrency**

Linear in the short input/pattern length, with small fixed locale-name scans and no external I/O. Reads of mutable global settings make concurrent locale reconfiguration unsafe.

**Related entries**

- [`DateToStr`](DateToStr.md) formats a date with host settings.
- [`vxStrToDate`](../Conversion/vxStrToDate.md) is the Velox conversion helper when its governed format rules are required.

**External references**

- [Embarcadero `System.SysUtils.StrToDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrToDate)
- [Free Pascal `StrToDate`](https://www.freepascal.org/docs-html/rtl/sysutils/strtodate.html)

<small>Created 2026-07-15</small>
