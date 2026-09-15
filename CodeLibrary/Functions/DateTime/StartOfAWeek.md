---
title: "StartOfAWeek"
description: "Constructs midnight for a supplied ISO week-year, week number and ISO weekday."
sidebar_position: 135
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - iso-week
  - weekday
  - midnight
---

```Delphi
Function StartOfAWeek( const AYear, AWeekOfYear : Word; const ADayOfWeek : Word) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StartOfAWeek(2026, 29, 4); // Thursday 16 July 2026
end;
```

### Usage

`StartOfAWeek` constructs midnight for a supplied ISO week-year, week number and ISO weekday.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | ISO week-year from 1 through 9999, subject to encodable boundary dates. |
| `AWeekOfYear` | `Word`, `const` | ISO week number from 1 through 52 or 53 where that week-year contains week 53. |
| `ADayOfWeek` | `Word`, `const` | ISO weekday: 1 Monday through 7 Sunday. |

**Returns**

The encoded calendar date for the requested ISO week date at 00:00:00.000.

**Behaviour**

- Week one follows ISO 8601 and can begin in the preceding calendar year.
- Week 52 or 53 can extend into the following calendar year.
- The supplied weekday is returned, not necessarily Monday.
- The result is timezone-neutral and contains no current-clock state.

**Errors**

Invalid year/week/weekday combinations raise DateUtils `EConvertError` through the encode-week path.

**Usage notes**

Use `StartOfTheWeek` to derive Monday midnight from an existing date/time value.

### Additional Technical Info
`StartOfAWeek` constructs midnight for a specific day in an ISO 8601 week date. The parameters identify an ISO week-year, week number and Monday-one weekday.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to `System.DateUtils.StartOfAWeek`, which immediately calls `EncodeDateWeek(AYear, AWeekOfYear, ADayOfWeek)`. That routine validates the ISO fields, resolves ISO week-year ownership and encodes the resulting Gregorian date.

**Edge cases and quirks**

- Despite the name, the result is only the start of the whole week when `ADayOfWeek = 1`. Passing 2 through 7 returns midnight on the selected later weekday.
- Delphi declares a default weekday of Monday, but Velox's exact script declaration requires all three arguments; scripts cannot rely on the omitted default.
- Week 53 is accepted only for ISO week-years that actually contain it.
- Free Pascal exposes a similar overload/default model; the explicit Velox declaration above controls script syntax.

**Side effects**

None.

**Performance and concurrency**

Constant-time ISO calendar arithmetic and encoding with no I/O or shared state.

**Related entries**

- [`EncodeDateWeek`](EncodeDateWeek.md) is the delegated encoder.
- [`StartOfTheWeek`](StartOfTheWeek.md) derives the Monday boundary.

**External references**

- [Embarcadero `System.DateUtils.StartOfAWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.StartOfAWeek)
- [Free Pascal `StartOfAWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/startofaweek.html)

<small>Created 2026-07-15</small>
