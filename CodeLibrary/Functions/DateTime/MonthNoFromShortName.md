---
title: "MonthNoFromShortName"
description: "Maps a short month name from global host format settings to 1-12, returning zero when no name matches."
sidebar_position: 103
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - month
  - locale
  - parsing
---

```Delphi
Function MonthNoFromShortName(const aMonthName: String): integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MonthNoFromShortName('Jan'); // 1 when the host's short name for month 1 is Jan
end;
```

### Usage

`MonthNoFromShortName` maps a short month name from global host format settings to 1-12, returning zero when no name matches.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMonthName` | `String`, `const` | Complete short month name to find using a case-insensitive comparison against global `FormatSettings.ShortMonthNames`. |

**Returns**

An `Integer` from 1 through 12 for the first match, or 0 when no short name matches.

**Behaviour**

- Matching is case-insensitive and scans the 12 short month names in calendar order.
- The complete configured abbreviation must compare equal; the routine performs no trimming, prefix matching or punctuation normalisation.
- Abbreviation length and punctuation are locale-specific. A locale may use forms such as a trailing period.
- Input that matches none of the configured short names returns zero without raising.

**Important usage notes**

- The local system-default settings record is unused. Actual behaviour depends on mutable process-wide global `FormatSettings`.
- For non-ASCII text on Windows, the comparison uses current-user-locale case rules. This can differ from simple ordinal lowercasing.
- A long month name is not accepted merely because it begins with the short name; comparison is against the short-name entries as complete strings.
- Zero is an explicit no-match sentinel, not January.

**Usage notes**

Do not hard-code an English abbreviation unless the deployment contract also fixes the process locale and punctuation.

### Additional Technical Info
`MonthNoFromShortName` searches the Velox process's global short-month-name array and returns the matching one-based month number. Matching is case-insensitive but otherwise requires the complete locale-specific abbreviation; an unmatched value returns zero.

The example is source-reviewed and intentionally locale-dependent. It was not executed by the documentation workflow.

**Implementation**

Velox's date-tools import binds to the Velox wrapper. The wrapper creates a local `TFormatSettings` for the Windows system-default locale but never reads it. It passes global `FormatSettings.ShortMonthNames` to Delphi `System.StrUtils.IndexText` and adds one to the returned index, converting `IndexText`'s `-1` no-match value to zero.

**Side effects**

The function reads global locale state and constructs a temporary settings record. It does not modify global state or the caller's string.

**Errors**

No match returns zero. Unexpected allocation or comparison exceptions propagate unchanged.

**Performance and concurrency**

At most 12 full-string comparisons are made. Concurrent changes to global `FormatSettings` can alter or destabilise results across calls.

**Related entries**

- [`MonthNoFromLongName`](MonthNoFromLongName.md) searches the long-month-name array.
- [`MonthOf`](MonthOf.md) extracts a numeric month from `TDateTime`.

**External references**

- [Embarcadero `System.StrUtils.IndexText`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.IndexText)
- [Free Pascal `IndexText`](https://www.freepascal.org/docs-html/rtl/strutils/indextext.html)

<small>Created 2026-07-15</small>
