---
title: "EndOfADay"
description: "Returns the final millisecond of an explicitly supplied valid calendar date."
sidebar_position: 37
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - day
  - boundary
  - milliseconds
---

```Delphi
Function EndOfADay(const AYear, AMonth, ADay: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EndOfADay(2028, 2, 29); // 2028-02-29 23:59:59.999
end;
```

### Usage

`EndOfADay` returns the final millisecond of an explicitly supplied valid calendar date.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year `1..9999`. |
| `AMonth` | `Word`, `const` | Month `1..12`. |
| `ADay` | `Word`, `const` | Day valid for the supplied month and year. |

**Returns**

The requested date at `23:59:59.999`.

**Errors**

Invalid date fields raise `EConvertError`; the exception propagates into the script.

### Additional Technical Info
`EndOfADay` constructs the last millisecond of a calendar date supplied as year, month and day fields. It is useful for display-oriented inclusive day boundaries; for filtering higher-precision timestamps, an exclusive next-day boundary is often safer.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to the three-field overload of Delphi 37.0 `System.DateUtils.EndOfADay`. It calls `EncodeDate(AYear, AMonth, ADay)` and passes that midnight value to `EndOfTheDay`, which recodes the time fields to 23, 59, 59 and 999.

**Edge cases and quirks**

- Velox exposes only this three-field overload here; the upstream DateUtils unit also has a year/day-of-year overload.
- The boundary is inclusive only to millisecond resolution. A database or external timestamp with microseconds after `.999000` can lie later in the same day but compare greater than this value after a higher-precision conversion.
- The result is timezone-neutral. A daylight-saving day is still represented by a wall-clock end value, not an elapsed 24-hour calculation.
- Invalid fields are not normalised into another date.

**Side effects**

None.

**Performance and concurrency**

Constant-time calendar encoding with no shared state.

**Related entries**

- [`EndOfTheDay`](EndOfTheDay.md) uses the date contained in an existing value.
- [`EncodeDate`](EncodeDate.md) returns the corresponding start-of-day midnight.

**External references**

- [Embarcadero `System.DateUtils.EndOfADay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EndOfADay)
- [Free Pascal `EndOfADay`](https://www.freepascal.org/docs-html/rtl/dateutils/endofaday.html)

<small>Created 2026-07-15</small>
