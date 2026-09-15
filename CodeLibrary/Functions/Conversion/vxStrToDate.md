---
title: "vxStrToDate"
description: "Parses a date with Windows system-locale settings and raises when conversion fails."
sidebar_position: 51
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - date
  - locale
  - validation
  - delphi
---

```Delphi
function vxStrToDate(const S: string): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // For a host whose system short-date order is day/month/year:
  Value := vxStrToDate('31/12/2026');
end;
```

### Usage

`vxStrToDate` parses a date with Windows system-locale settings and raises when conversion fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Date text whose field order, separators, names and short-year rule are determined by Windows `LOCALE_SYSTEM_DEFAULT`. |

**Returns**

The parsed date as a `TDateTime` with a zero time part. No timezone or UTC conversion is performed.

**Behaviour**

Normal Windows patterns use two or three date fields in month/day/year, day/month/year or year/month/day order. If the year field is omitted from a two-field input, the current local year is used. A two-digit year is expanded into the moving century window captured in the local settings record.

**Errors**

Invalid syntax, impossible dates, incomplete required fields or trailing content raises Velox `EConvertError` into the script.

**Usage notes**

Locale date parsing is suitable for values intentionally entered in the host's regional format. For machine interchange, prefer an explicit mask parser or an unambiguous normalised format, and use four-digit years.

### Additional Technical Info
`vxStrToDate` parses a date according to the Windows system locale and returns it as a Delphi `TDateTime` at midnight. It requires the complete input to conform to Delphi's locale-derived date scanner and raises on failure.

The example is locale-qualified and fictional. It is source-reviewed and not executed by the documentation workflow.

**Implementation**

The formats scripting import binds `vxStrToDate` to `vxFormats.vxStrToDate`. Each call creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and invokes `System.SysUtils.StrToDate(S, AFormatSettings)`. The installed Delphi 37.0 overload calls `TryStrToDate`, which scans from `ShortDateFormat`, requires full input consumption and raises `EConvertError` when scanning fails.

The terminal parses numeric fields or locale names implied by the short-date pattern, fills an omitted year from `CurrentYear`, applies `TwoDigitYearCenturyWindow`, defaults a day only if the locale pattern itself omits it, and validates the result with `TryEncodeDate`.

**Edge cases and quirks**

- The date order and accepted separator come from the **system** locale, not the user profile of the interactive Designer or Velox Service account.
- The result of text without a year changes when the current year changes. Two-digit year interpretation can also change as the current year moves relative to `TwoDigitYearCenturyWindow`.
- A time suffix is not accepted by this date-only routine because the installed `TryStrToDate` wrapper requires the scanner position to pass the end of the string.
- Locale short/long month or weekday names are accepted only when the system `ShortDateFormat` requests those name forms. If a weekday is present, the Delphi scanner verifies it against the encoded date.
- Invalid leap days, reversed fields for the host locale, extra characters and wrong separators raise rather than being normalised.
- A valid 30 December 1899 date returns numeric `0.0`; zero is not an error sentinel for this raising routine.
- Free Pascal's reference also describes one-number date input, but explicitly notes that behaviour is not supported in Delphi. Velox executes Delphi and does not inherit that extension.

**Side effects**

No application data is changed. Current date and Windows locale are observable inputs. The `vxFormats` unit has a separate one-time initialisation action that sets the initialising thread locale and refreshes Delphi globals.

**Performance and concurrency**

Scanning is linear in the short input and includes small locale-name searches. Explicit local settings isolate the call from Delphi global format changes; a later system-locale change can affect later calls.

**Related entries**

- [`vxStrToDateDef`](vxStrToDateDef.md) returns a supplied fallback on the same failures.
- [`vxTryStrToDate`](vxTryStrToDate.md) reports success without a conversion exception.
- [`vxStrToDateTime`](vxStrToDateTime.md) accepts locale date/time or time-only text.
- [`vxStringtoDateTimeValid`](vxStringtoDateTimeValid.md) uses a caller-supplied Velox mask and a different permissive scanner.

**External references**

- [Embarcadero `System.SysUtils.StrToDate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToDate) - documents the Delphi locale order, omitted-year and century-window contract used by Velox.
- [Free Pascal `StrToDate`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtodate.html) - useful dialect comparison; its documented single-number extension does not apply to Delphi/Velox.

<small>Created 2026-07-15</small>
