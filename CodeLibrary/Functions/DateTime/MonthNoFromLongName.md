---
title: "MonthNoFromLongName"
description: "Maps a long month name from global host format settings to 1-12, returning zero when no name matches."
sidebar_position: 102
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
Function MonthNoFromLongName(const aMonthName: String): integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MonthNoFromLongName('January'); // 1 when the host's long name for month 1 is January
end;
```

### Usage

`MonthNoFromLongName` maps a long month name from global host format settings to 1-12, returning zero when no name matches.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMonthName` | `String`, `const` | Complete long month name to find using a case-insensitive comparison against global `FormatSettings.LongMonthNames`. |

**Returns**

An `Integer` from 1 through 12 for the first matching month, or 0 when no entry matches.

**Behaviour**

- Matching is case-insensitive and returns the first of the 12 global month-name entries that compares equal.
- The entire input must match. Leading/trailing spaces, extra punctuation or a partial name are not trimmed or accepted.
- Successful English examples such as `January` depend on the process's current global month names; the routine is not fixed to English.
- Input that matches none of the configured long names returns zero rather than raising.

**Errors**

Ordinary no-match input is reported as zero. Unexpected allocation or runtime string-comparison exceptions are not caught by Velox.

**Usage notes**

Treat the accepted names as deployment-locale data. When a configuration contract requires a stable machine-independent token, prefer numeric month values or validate the expected locale outside this helper.

### Additional Technical Info
`MonthNoFromLongName` searches the Velox process's global long-month-name array and returns the matching one-based month number. Matching is case-insensitive but otherwise requires the complete locale-specific name; an unmatched value returns zero.

The example is source-reviewed and intentionally locale-dependent. It was not executed by the documentation workflow.

**Implementation**

Velox's date-tools import binds to the Velox wrapper. The wrapper constructs a local `TFormatSettings` for the Windows system-default locale, but does not use that variable. It instead passes the process-wide global `FormatSettings.LongMonthNames` array to Delphi `System.StrUtils.IndexText`, then adds one to the returned zero-based index. `IndexText` returns `-1` when no match exists, producing the public zero sentinel.

**Edge cases and quirks**

- The locally created system-default `TFormatSettings` is ignored. Actual results come from mutable global `FormatSettings`, which may represent the user locale or a host override rather than the system-default value suggested by the wrapper.
- For non-ASCII text on Windows, the case-insensitive comparison uses the current user locale. The comparison locale and the global month-name source can therefore be affected by different process/host configuration paths.
- The function does not accept short names; use `MonthNoFromShortName` for the separate short-name array.
- Zero means no match and is not a valid month number.

**Side effects**

The wrapper reads process-wide locale state and creates a temporary local format-settings record. It does not modify the input or global settings.

**Performance and concurrency**

At most 12 case-insensitive full-string comparisons are performed. Concurrent mutation of global `FormatSettings` can make results inconsistent across calls; host code should not change global locale data while scripts are running.

**Related entries**

- [`MonthNoFromShortName`](MonthNoFromShortName.md) searches the separate short-month-name array.
- [`MonthOf`](MonthOf.md) extracts a numeric month from an encoded date/time.

**External references**

- [Embarcadero `System.StrUtils.IndexText`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.IndexText)
- [Free Pascal `IndexText`](https://www.freepascal.org/docs-html/rtl/strutils/indextext.html)

<small>Created 2026-07-15</small>
