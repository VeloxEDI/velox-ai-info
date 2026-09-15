---
title: "EndOfAWeek"
description: "Returns the final millisecond of a chosen weekday in a supplied ISO week-numbering year and week."
sidebar_position: 39
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - iso-8601
  - week
  - boundary
---

```Delphi
Function EndOfAWeek(const AYear, AWeekOfYear: Word;
  const ADayOfWeek: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EndOfAWeek(2026, 1, 7); // Sunday 4 January 2026, 23:59:59.999
end;
```

### Usage

`EndOfAWeek` returns the final millisecond of a chosen weekday in a supplied ISO week-numbering year and week.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | ISO week-numbering year `1..9999`. |
| `AWeekOfYear` | `Word`, `const` | ISO week number valid for `AYear`. |
| `ADayOfWeek` | `Word`, `const` | Monday `1` through Sunday `7`; required by the Velox declaration. |

**Returns**

The final millisecond of the chosen ISO weekday. Near New Year, the result's calendar year can differ from `AYear`.

**Errors**

Invalid ISO year/week/day fields raise `EConvertError` through `EncodeDateWeek`.

### Additional Technical Info
`EndOfAWeek` encodes one weekday in an ISO week and sets its time to `23:59:59.999`. Despite its name, the result is the end of the **selected day**; it is the end of the ISO week only when `ADayOfWeek` is Sunday (`7`).

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.EndOfAWeek`. It calls `EncodeDateWeek(AYear, AWeekOfYear, ADayOfWeek)` and then `EndOfTheDay` on the result.

**Edge cases and quirks**

- The upstream Delphi declaration defaults `ADayOfWeek` to Sunday, which makes a two-argument Delphi call mean the week end. The generated Velox script declaration exposes no default and requires the third argument.
- Passing Monday (`1`) returns Monday's final millisecond, not Sunday. Use `7` when the boundary must be the end of the ISO week.
- `AYear` is the ISO week year and can differ from the calendar year of the returned date.
- Week 53 is accepted only for ISO years that contain it.
- The result is timezone-neutral and millisecond-resolution.

**Side effects**

None.

**Performance and concurrency**

Constant bounded calendar arithmetic with no shared state.

**Related entries**

- [`EndOfTheWeek`](EndOfTheWeek.md) always returns the Sunday ending the week that contains an existing value.
- [`EncodeDateWeek`](EncodeDateWeek.md) returns the selected day's midnight.

**External references**

- [Embarcadero `System.DateUtils.EndOfAWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EndOfAWeek)
- [Free Pascal `EndOfAWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/endofaweek.html)

<small>Created 2026-07-15</small>
