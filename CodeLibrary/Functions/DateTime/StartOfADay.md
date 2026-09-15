---
title: "StartOfADay"
description: "Constructs midnight for supplied year/month/day fields using DateUtils day-offset arithmetic."
sidebar_position: 133
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - midnight
  - construction
  - rollover
---

```Delphi
Function StartOfADay( const AYear, AMonth, ADay : Word) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StartOfADay(2026, 7, 16); // 16 July 2026 00:00:00.000
end;
```

### Usage

`StartOfADay` constructs midnight for supplied year/month/day fields using DateUtils day-offset arithmetic.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Calendar year used to construct the first day of the month; ordinarily 1 through 9999. |
| `AMonth` | `Word`, `const` | Calendar month from 1 through 12. |
| `ADay` | `Word`, `const` | Day offset counted from one. Velox does not validate it against the month. |

**Returns**

A `TDateTime` at midnight after applying the supplied day offset to the first day of the month.

**Behaviour**

- Ordinary in-range fields return the requested date at 00:00:00.000.
- Year and month are validated while encoding the first day of the month.
- The result has no timezone tag and performs no timezone conversion.
- The selected overload differs from the separate year/day-of-year overload that Velox also provides.

**Errors**

Invalid year or month values raise while `StartOfAMonth` encodes day one. The subsequent day offset is not range-checked, so rollover or a final raw value outside the normal calendar range does not itself raise in this routine. Velox does not catch an exception from the initial encoder.

**Usage notes**

Use `EncodeDate` when invalid day-of-month input must be rejected rather than rolled over.

### Additional Technical Info
`StartOfADay` constructs an encoded midnight from separate year, month and day numbers. Velox exposes the three-argument DateUtils overload.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds the exact three-argument overload of Delphi 37.0 `System.DateUtils.StartOfADay`. The implementation calls `StartOfAMonth(AYear, AMonth)`, which encodes day 1, then adds `ADay - 1` as raw whole days. It does not call `EncodeDate` with `ADay`.

**Edge cases and quirks**

- `ADay` is not range-checked. Zero returns the final day of the previous month; a value larger than the month length rolls into a later month or year.
- This permissive rollover is materially different from `EncodeDate`, which rejects an invalid day-of-month.
- Large `Word` day values can move far beyond the named month. The raw day addition is unchecked, so it can return a numeric `TDateTime` outside the normal year 1-9999 encodable calendar range rather than rejecting the result.
- Free Pascal publishes overloaded `StartOfADay` documentation, but the exact Velox declaration selects year/month/day and installed Delphi's day-offset algorithm defines its behaviour.

**Side effects**

None.

**Performance and concurrency**

Constant-time date encoding and addition with no I/O or shared mutable state.

**Related entries**

- [`StartOfAMonth`](StartOfAMonth.md) supplies the encoded base used by this routine.
- [`EncodeDate`](EncodeDate.md) validates all three calendar fields.

**External references**

- [Embarcadero `System.DateUtils.StartOfADay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.StartOfADay)
- [Free Pascal `StartOfADay`](https://www.freepascal.org/docs-html/rtl/dateutils/startofaday.html)

<small>Created 2026-07-15</small>
