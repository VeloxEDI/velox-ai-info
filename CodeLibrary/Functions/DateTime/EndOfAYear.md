---
title: "EndOfAYear"
description: "Returns the final millisecond of 31 December in a supplied valid calendar year."
sidebar_position: 40
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - year
  - boundary
  - milliseconds
---

```Delphi
Function EndOfAYear(const AYear: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EndOfAYear(2026); // 2026-12-31 23:59:59.999
end;
```

### Usage

`EndOfAYear` returns the final millisecond of 31 December in a supplied valid calendar year.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year `1..9999`. |

**Returns**

31 December of `AYear` at `23:59:59.999`.

**Important usage notes**

- The function uses a calendar year, not an ISO week-numbering year.
- The output is the last representable millisecond. Prefer an exclusive `StartOfAYear(AYear + 1)`-style boundary in systems that store greater-than-millisecond precision.
- Year zero and years after 9999 are unsupported.
- No timezone is attached or converted.

**Errors**

An out-of-range year raises `EConvertError` through `EncodeDate`.

### Additional Technical Info
`EndOfAYear` constructs the final millisecond of the supplied Gregorian calendar year.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.EndOfAYear`. It encodes `AYear, 12, 31` and passes the date to `EndOfTheDay`.

**Side effects**

None.

**Performance and concurrency**

Constant-time arithmetic with no shared state.

**Related entries**

- [`EndOfTheYear`](EndOfTheYear.md) derives the year from an existing value.
- [`EndOfAMonth`](EndOfAMonth.md) returns a month boundary.

**External references**

- [Embarcadero `System.DateUtils.EndOfAYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EndOfAYear)
- [Free Pascal `EndOfAYear`](https://www.freepascal.org/docs-html/rtl/dateutils/endofayear.html)

<small>Created 2026-07-15</small>
