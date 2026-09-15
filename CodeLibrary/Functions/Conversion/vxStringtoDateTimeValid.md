---
title: "vxStringtoDateTimeValid"
description: "Parses a Velox date/time mask and reports through aSuccess whether the returned value is valid."
sidebar_position: 47
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - date
  - time
  - validation
  - format mask
---

```Delphi
function vxStringtoDateTimeValid(
  const DateTimeFormat: string;
  const DateTimeStr: string;
  var aSuccess: Boolean): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Parsed: TDateTime;
  IsValid: Boolean;
begin
  Parsed := vxStringtoDateTimeValid(
    'YYYY-MM-DD HH:NN:SS',
    '2026-07-16 14:30:00',
    IsValid);

  if IsValid then
    Value := Parsed
  else
    Value := Null;
end;
```

### Usage

`vxStringtoDateTimeValid` parses a Velox date/time mask and reports through aSuccess whether the returned value is valid.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `DateTimeFormat` | `string`, `const` | Velox parsing mask, trimmed and uppercased before scanning. |
| `DateTimeStr` | `string`, `const` | Input text, trimmed and uppercased before scanning. |
| `aSuccess` | `Boolean`, `var` | Overwritten to `True` at entry and set to `False` only when a component is explicitly invalid or the final `TryEncodeDateTime` call fails. Inspect it after the call. |

**Returns**

The assembled `TDateTime` when `aSuccess=True`; otherwise `0.0`. The pair `(0.0, True)` is possible for the valid Velox epoch date 30 December 1899 midnight, whereas `(0.0, False)` reports final validation failure.

**Behaviour**

Time-only input is combined with the current local date. Velox rejects hour `24`; valid hours are `0` through `23`.

**Errors**

Normal component and range failures return `(0.0, False)` without raising. The routine does not catch allocation, locale-initialisation or other unexpected runtime exceptions; if one propagates, callers must not assume the output pair was completed.

**Usage notes**

Test `aSuccess` before using the return. If format conformance matters, separately validate separators, full input consumption and the permitted year/date range; `aSuccess=True` alone proves only that the fields retained by this permissive scanner formed an encodable date/time.

### Additional Technical Info
`vxStringtoDateTimeValid` runs Velox's custom mask-driven date/time parser and returns its final range-validation state separately in `aSuccess`. This makes a valid `TDateTime` value of zero distinguishable from ordinary parser failure, but it does not make the parser strict about separators, suffixes or every token.

The fictional example is source-reviewed and not executed by the documentation workflow.

**Implementation**

The date-tools import binds directly to `vxDateTools.vxStringtoDateTimeValid`. Its parser body duplicates `vxStringtoDateTime` rather than calling it. Source comparison shows the same initial fields, system-locale settings, mask scanner, destructive input consumption, AM/PM conversion, time-only current-date rule, `TryEncodeDateTime` terminal and ineffective offset call.

The only material validation additions are:

1. assign `aSuccess := True` before any parsing;
2. after scanning, set the return to `0.0` and `aSuccess := False` when hour/minute/second/millisecond is `-1` or Delphi `TryEncodeDateTime` returns `False`; and
3. leave `aSuccess=True` for every result accepted by that final encoder, even if input text or mask content was ignored.

The supported token processing is the same as [`vxStringtoDateTime`](vxStringtoDateTime.md): `D`/`DD`, unchecked `DDD`, prefix-matched `DDDD`, `M`/`MM`/`MMM`/`MMMM`, `YY`/`YYYY`, `H`/`HH`, `NN`, `SS`, `ZZ`/`ZZZ`, permissive `AP`/`AM`/`PM`/`AMP`/`AMPM`, no-op `+`, and ineffective `O`/`OO`.

**Edge cases and quirks**

- `aSuccess` reports final component encoding, not complete conformance to `DateTimeFormat`. Unchecked separator substitutions, ignored suffixes and an omitted trailing time section can still yield `True`.
- The loop never processes a token starting at the final mask character and stops as soon as input becomes empty.
- Literal format characters are positional wildcards, quote characters consume no input, and a final one-character literal can remain unconsumed.
- `Y` and `YYY` do not set a year. Invalid `YY` text is converted through zero and can become the first year of the current century.
- Weekday tokens are not checked against the assembled date. Long weekday/month matching uses only the first three letters; month matching uses the system long-name array even for `MMM`.
- A single `H` can parse the leading `2` from input `24` and leave the `4` unchecked. `HH=24` reaches the installed encoder and fails.
- The last time field overwrites, rather than accumulates, the `timePartSpecified` flag. Any explicit `-1` component still causes final failure.
- AM/PM text other than exact `AM` is generally interpreted as PM.
- `O`/`OO` never changes the result because `IncHour` returns a value and that return is discarded. `aSuccess` does not reveal this semantic no-op.
- The incoming value of `aSuccess` has no effect; it is always overwritten at function entry.

**Side effects**

The caller's `aSuccess` variable is always mutated. No persistent Velox state is changed. Current date and system locale are observable inputs to some masks.

**Performance and concurrency**

Cost and allocation behaviour match `vxStringtoDateTime`: repeated string deletion/copying and small locale-name scans. Parser state is local, but system locale and current date remain external time-varying inputs.

**Related entries**

- [`vxStringtoDateTime`](vxStringtoDateTime.md) has the same parser but no success output.
- [`StringtoDateTime`](StringtoDateTime.md) is the unprefixed alias of that no-success variant.
- [`vxTryStrToDate`](vxTryStrToDate.md) uses Delphi's strict locale-date parser rather than this custom mask scanner.

**External references**

- [Embarcadero `System.DateUtils.TryEncodeDateTime`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.DateUtils.TryEncodeDateTime) - describes the final Delphi field encoder; installed source supplies the exact hour rule used by Velox.
- [Free Pascal `TryEncodeDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/tryencodedatetime.html) - compatible range-encoding reference, not evidence for Velox mask acceptance.
- [Embarcadero `System.DateUtils.IncHour`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.DateUtils.IncHour) - documents the returned adjusted value that the Velox offset branch currently discards.
- [Free Pascal `IncHour`](https://www.freepascal.org/docs-html/rtl/dateutils/inchour.html) - compatibility reference for functional date shifting.

<small>Created 2026-07-15</small>
