---
title: "TryModifiedJulianDateToDateTime"
description: "Tries to convert a Modified Julian date into an encoded Gregorian date and millisecond time."
sidebar_position: 154
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - modified-julian
  - conversion
---

```Delphi
Function TryModifiedJulianDateToDateTime(const AValue: Double;
  var ADateTime: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EncodedValue: TDateTime;
begin
  if TryModifiedJulianDateToDateTime(51544.0, EncodedValue) then
    Value := EncodedValue; // 1 January 2000 at 00:00
end;
```

### Usage

`TryModifiedJulianDateToDateTime` tries to convert a Modified Julian date into an encoded Gregorian date and millisecond time.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `Double`, `const` | Modified Julian date, including an optional fraction since midnight. |
| `ADateTime` | `TDateTime`, `var` | Receives the millisecond-resolution conversion when successful. |

**Returns**

`True` when the adjusted Julian date can be converted and `ADateTime` receives the result; otherwise `False`.

**Errors**

Unencodable derived dates normally return `False`; floating-point conversion or arithmetic faults can propagate.

### Additional Technical Info
`TryModifiedJulianDateToDateTime` converts a Modified Julian date (MJD) to a proleptic-Gregorian `TDateTime`. MJD uses a midnight day boundary and an epoch at 17 November 1858, making `51544.0` midnight on 1 January 2000.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.TryModifiedJulianDateToDateTime`. Its entire wrapper adds `2,400,000.5` and delegates to `TryJulianDateToDateTime`. That terminal derives the Gregorian date, accounts for the Julian noon boundary and adds the fractional day at millisecond resolution.

**Edge cases and quirks**

- The `.5` in the offset is what converts the underlying Julian noon boundary to MJD's midnight boundary.
- Output is limited to the Delphi calendar range, normally returning `False` for an unencodable derived date.
- Adding the large offset can lose low-order fractional precision for extremely precise or large `Double` inputs before millisecond quantisation occurs.
- NaN, infinity, extreme numeric input and boundary timestamp arithmetic can raise despite the `Try` name because the delegated routine does not catch all numeric operations.
- `ADateTime` has no timezone or astronomical time-scale tag.

**Side effects**

May write `ADateTime`; no external state changes.

**Performance and concurrency**

Constant-time arithmetic with no allocation, I/O or shared mutable state.

**Related entries**

- [`ModifiedJulianDateToDateTime`](ModifiedJulianDateToDateTime.md) is the raising form.
- [`TryJulianDateToDateTime`](TryJulianDateToDateTime.md) accepts a full noon-based Julian date.
- [`DateTimeToModifiedJulianDate`](DateTimeToModifiedJulianDate.md) performs the inverse conversion.

**External references**

- [Embarcadero `System.DateUtils.TryModifiedJulianDateToDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TryModifiedJulianDateToDateTime)
- [Free Pascal `TryModifiedJulianDateToDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/trymodifiedjuliandatetodatetime.html)

<small>Created 2026-07-15</small>
