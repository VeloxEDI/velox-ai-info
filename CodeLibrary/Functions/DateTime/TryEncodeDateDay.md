---
title: "TryEncodeDateDay"
description: "Tries to construct midnight from a Gregorian year and one-based day-of-year ordinal."
sidebar_position: 147
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - ordinal-day
  - encoding
  - validation
---

```Delphi
Function TryEncodeDateDay(const AYear, ADayOfYear: Word;
  var AValue: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EncodedDate: TDateTime;
begin
  if TryEncodeDateDay(2028, 60, EncodedDate) then
    Value := EncodedDate; // 29 February 2028
end;
```

### Usage

`TryEncodeDateDay` tries to construct midnight from a Gregorian year and one-based day-of-year ordinal.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year `1..9999`. |
| `ADayOfYear` | `Word`, `const` | Ordinal `1..365`, or `1..366` in a leap year. |
| `AValue` | `TDateTime`, `var` | Receives the requested date at midnight only on success. |

**Returns**

`True` for a valid year-local ordinal; otherwise `False`.

**Important usage notes**

- Day 60 is 29 February in a leap year and 1 March in a common year.
- Zero is invalid and does not mean the preceding year's final day.
- Day 366 returns `False` for a common year rather than rolling into the next year.
- `AValue` is not assigned when validation fails. The script declaration is `var`, so do not consume its prior value unless the result is `True`.
- The resulting midnight has no timezone tag.

**Errors**

Normal year/ordinal validation failures return `False`. No Velox function translates unexpected runtime faults.

### Additional Technical Info
`TryEncodeDateDay` converts a Gregorian year and one-based ordinal day into a date at midnight. Invalid year/ordinal combinations return `False` rather than raising the corresponding DateUtils conversion error.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.TryEncodeDateDay`. It calls `IsValidDateDay`; when valid it constructs 1 January with `StartOfAYear` and adds `ADayOfYear - 1` whole days.

**Side effects**

Writes `AValue` on success only. No other state changes.

**Performance and concurrency**

Constant bounded calendar validation and arithmetic with no shared state.

**Related entries**

- [`EncodeDateDay`](EncodeDateDay.md) raises instead of returning a success flag.
- [`DecodeDateDay`](DecodeDateDay.md) performs the inverse decomposition.
- [`DayOfTheYear`](DayOfTheYear.md) extracts the one-based ordinal.

**External references**

- [Embarcadero `System.DateUtils.TryEncodeDateDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TryEncodeDateDay)
- [Free Pascal `TryEncodeDateDay`](https://www.freepascal.org/docs-html/rtl/dateutils/tryencodedateday.html)

<small>Created 2026-07-15</small>
