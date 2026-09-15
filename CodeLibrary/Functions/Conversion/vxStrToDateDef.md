---
title: "vxStrToDateDef"
description: "Parses a system-locale date, returning a supplied TDateTime value when conversion fails."
sidebar_position: 52
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - date
  - fallback
  - locale
  - delphi
---

```Delphi
function vxStrToDateDef(
  const S: string;
  const Default: TDateTime): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  MissingDate: TDateTime;
begin
  MissingDate := 0;
  Value := vxStrToDateDef('not a date', MissingDate);
end;
```

### Usage

`vxStrToDateDef` parses a system-locale date, returning a supplied TDateTime value when conversion fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Date text interpreted with the system `ShortDateFormat`, date separator, names and two-digit-year window. |
| `Default` | `TDateTime`, `const` | Value returned when the locale scanner does not consume a valid complete date. It is not required to contain a date-only value. |

**Returns**

The parsed midnight date on success; otherwise exactly `Default`. The return alone does not distinguish failure from a valid parsed date equal to the fallback.

**Behaviour**

Successful input follows the same contract as [`vxStrToDate`](vxStrToDate.md): locale field order and separator, current year for an omitted year, `TwoDigitYearCenturyWindow` for short years, complete consumption and a date-only result.

**Errors**

Normal conversion failures return `Default`. Locale acquisition, allocation or other unexpected runtime exceptions are not caught and can propagate.

**Usage notes**

Use [`vxTryStrToDate`](vxTryStrToDate.md) when downstream logic needs a reliable success indicator. A fallback should encode an explicit optional-data rule rather than hide malformed mandatory dates.

### Additional Technical Info
`vxStrToDateDef` parses a complete Windows system-locale date and returns a caller-supplied `Default` value when parsing or date validation fails.

The fictional example deliberately chooses zero as its fallback. It is source-reviewed and not executed by the documentation workflow; zero is also the valid Delphi representation of 30 December 1899, so that choice is ambiguous when the epoch date is allowed.

**Implementation**

The scripting import maps the entry to `vxFormats.vxStrToDateDef`. The wrapper creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls `System.SysUtils.StrToDateDef(S, Default, AFormatSettings)`. That installed Delphi overload runs `TryStrToDate` and assigns `Default` when scanning or final `TryEncodeDate` validation returns `False`.

**Edge cases and quirks**

- A fallback collision is indistinguishable. This is especially common with `Default=0`, because 30 December 1899 is a valid parsed date.
- Every ordinary failure selects the same value: wrong locale order, wrong separator, invalid leap day, missing field, time suffix and unrelated trailing text are not differentiated.
- Omitting a year makes successful output depend on the current year. Two-digit-year output depends on the moving century window.
- The settings record comes from Windows `LOCALE_SYSTEM_DEFAULT`, not a service account or interactive user's regional preference.
- The Free Pascal routine is a compatibility reference; Free Pascal's broader short-date forms do not extend the Delphi terminal executed by Velox.

**Side effects**

None beyond local locale/scanner state. The call does not mutate `Default` or persistent Velox data.

**Performance and concurrency**

Date scanning is linear in input length with bounded locale-name lookup. Local settings avoid Delphi global-format races; host locale changes can alter subsequent calls.

**Related entries**

- [`vxStrToDate`](vxStrToDate.md) raises for the same invalid input.
- [`vxTryStrToDate`](vxTryStrToDate.md) returns a Boolean and an output date.
- [`vxStringtoDateTimeValid`](vxStringtoDateTimeValid.md) accepts a caller-supplied Velox mask and reports the custom parser's final encoder state.

**External references**

- [Embarcadero `System.SysUtils.StrToDateDef`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToDateDef) - documents the exact explicit-settings fallback overload used by Velox.
- [Free Pascal `StrToDateDef`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtodatedef.html) - compatible fallback reference; Delphi locale parsing remains authoritative for Velox.

<small>Created 2026-07-15</small>
