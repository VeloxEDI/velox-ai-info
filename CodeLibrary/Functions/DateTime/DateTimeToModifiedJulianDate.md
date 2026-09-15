---
title: "DateTimeToModifiedJulianDate"
description: "Converts a TDateTime value to a Modified Julian date by applying the 2400000.5 offset."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - modified-julian-date
  - conversion
  - precision
  - delphi
---

```Delphi
Function DateTimeToModifiedJulianDate(const AValue: TDateTime): Double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DateTimeToModifiedJulianDate(EncodeDate(2000, 1, 1));
  // Result: 51544.0
end;
```

### Usage

`DateTimeToModifiedJulianDate` converts a TDateTime value to a Modified Julian date by applying the 2400000.5 offset.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Gregorian date/time to convert. No timezone is attached or inferred. |

**Returns**

A `Double` equal to `DateTimeToJulianDate(AValue) - 2400000.5`. MJD `0.0` corresponds to midnight at the start of 17 November 1858.

**Behaviour**

Civil midnight produces an integral Modified Julian value; later times appear as the fractional part of that day. The operation is purely numeric and leaves the input's local/UTC interpretation to the caller.

**Errors**

Valid Velox dates do not raise. Conversion errors are raised unchanged to the script.

### Additional Technical Info
`DateTimeToModifiedJulianDate` returns the Modified Julian Date (MJD) for a `TDateTime`. MJD is the ordinary Julian date minus `2400000.5`, which moves the day boundary from noon to midnight and produces smaller day numbers.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils scripting import binds directly to Delphi 37.0 `System.DateUtils.DateTimeToModifiedJulianDate`. The function calls the same unit's `DateTimeToJulianDate` and subtracts its `CJDToMJDOffset` constant (`2400000.5`). All Gregorian decoding and time-fraction behaviour therefore comes from that helper.

**Edge cases and quirks**

- Every Julian conversion caveat applies: no timezone conversion, floating precision limits, `Abs(Frac(AValue))` for negative Delphi dates and no local input validation.
- MJD is not a Unix timestamp. Its unit is a day and its epoch is in 1858, not 1970.
- Values derived by floating arithmetic may need tolerance-based comparison.
- Free Pascal documents the same `MJD = JD - 2400000.5` convention. It remains a dialect reference; the terminal used by Velox is Delphi.

**Side effects**

None.

**Performance and concurrency**

Constant-time scalar arithmetic with no allocation or shared state.

**Related entries**

- [`DateTimeToJulianDate`](DateTimeToJulianDate.md) returns the unmodified noon-boundary value.
- [`DateTimeToUnix`](DateTimeToUnix.md) returns seconds from the 1970 epoch instead of fractional days.

**External references**

- [Embarcadero `System.DateUtils.DateTimeToModifiedJulianDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DateTimeToModifiedJulianDate) - documents the exact Delphi function.
- [Free Pascal `DateTimeToModifiedJulianDate`](https://www.freepascal.org/daily/doc/rtl/dateutils/datetimetomodifiedjuliandate.html) - explains the compatible Modified Julian convention and offset.

<small>Created 2026-07-15</small>
