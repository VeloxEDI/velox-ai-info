---
title: "DateToStr"
description: "Formats the date portion of a TDateTime value with the process-wide Delphi short-date settings."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - formatting
  - locale
  - global-state
  - delphi
---

```Delphi
function DateToStr(D: TDateTime): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DateToStr(EncodeDate(2026, 7, 18));
  // Exact text depends on the Velox process format settings.
end;
```

### Usage

`DateToStr` formats the date portion of a TDateTime value with the process-wide Velox short-date settings.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `D` | `TDateTime` | Value whose date portion is formatted. Its time is ignored by the short-date pattern. |

**Returns**

A locale-sensitive `string` produced from the current global `FormatSettings.ShortDateFormat`, its date separator and any names referenced by that pattern.

**Behaviour**

The result follows the Velox process's active Velox format settings. Numeric field order, separator, leading zeros and textual month/day elements can differ between hosts or after the process settings change.

**Errors**

Valid dates normally format without exception. Unsupported raw values or a concurrent invalid mutation of global format data can propagate a Velox formatting exception; the binding does not catch it.

**Usage notes**

Do not parse this output elsewhere unless both sides deliberately share the same locale contract. An explicit numeric format is safer for machine-to-machine values.

### Additional Technical Info
`DateToStr` formats the calendar-date portion of a `TDateTime` using Delphi's process-wide short-date format settings. It is appropriate for locale-facing display, not for a stable interchange format.

The example is fictional and source-reviewed. It was not executed because its exact output is intentionally configuration-dependent.

**Implementation**

The modified PascalScript runtime registers the script function directly to the one-argument `System.SysUtils.DateToStr`. In Delphi 37.0 that overload delegates to `DateToStr(DateTime, FormatSettings)`, then calls `DateTimeToString` with `AFormatSettings.ShortDateFormat`. Velox does not supply an explicit format-settings object for this entry.

**Edge cases and quirks**

- The function is locale-sensitive and therefore unsuitable as a canonical file, database, API or EDI date representation unless the receiving contract explicitly requires that same format.
- The time component does not appear in the result and no timezone conversion occurs before formatting.
- A value of `0.0` formats as the valid Delphi epoch date (30 December 1899), not as blank or failure.
- This entry uses Delphi's shared `FormatSettings`, unlike Velox `vxDateToStr`/conversion wrappers that construct a Windows system-locale settings record for a call.
- Free Pascal documents the same `ShortDateFormat` concept, but its Unix localisation activation and global settings model do not define Velox behaviour.

**Side effects**

No state is changed. The function reads process-wide mutable format state.

**Performance and concurrency**

Formatting allocates the result string. Concurrent reads are inexpensive, but concurrent writes to Delphi global `FormatSettings` are not coordinated by this function and can produce inconsistent output. Prefer an explicit-format routine for deterministic integration data.

**Related entries**

- [`Date`](Date.md) obtains the current local date before formatting.
- [`DateOf`](DateOf.md) removes time without converting the value to text.

**External references**

- [Embarcadero `System.SysUtils.DateToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DateToStr) - documents the exact Delphi overload family.
- [Free Pascal `DateToStr`](https://www.freepascal.org/daily/doc/rtl/sysutils/datetostr.html) - documents the compatible short-date-format convention and platform difference.

<small>Created 2026-07-15</small>
