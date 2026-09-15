---
title: "vxStringtoTime"
description: "Parses time text with the Windows system short-time format converted to a Velox mask."
sidebar_position: 48
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - time
  - locale
  - format mask
---

```Delphi
function vxStringtoTime(const aString: string): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // For a host whose system short-time pattern is compatible with HH:mm:
  Value := vxStringtoTime('14:30');
end;
```

### Usage

`vxStringtoTime` parses time text with the Windows system short-time format converted to a Velox mask.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aString` | `string`, `const` | Time text expected to occupy the positions implied by the host system's `ShortTimeFormat`. |

**Returns**

The current local date combined with the parsed hour/minute fields and any supported additional time fields. Failure returns `0.0`.

**Behaviour**

The converted mask is processed by the same permissive scanner documented for [`vxStringtoDateTime`](vxStringtoDateTime.md). Valid time tokens set date fields to the current local date through `DecodeDate(Now, ...)`, after which the Velox encoder validates the assembled value.

**Errors**

Ordinary parsing/range failure returns `0.0` without a success flag. Locale acquisition, allocation or unexpected runtime exceptions can still propagate.

**Usage notes**

If a flow needs a time-of-day fraction, explicitly remove the date portion after checking that parsing succeeded. Because zero is also a valid midnight fraction but this function supplies today's date on success, use a separate validation rule rather than treating every nonzero value as trustworthy.

### Additional Technical Info
`vxStringtoTime` derives a Velox parser mask from the Windows system short-time pattern, then calls Velox's custom date/time parser. A successful result contains the **current local date plus the parsed time**; it is not a time-only `TDateTime` fraction.

The example is locale-qualified, fictional and source-reviewed. It is not executed by the documentation workflow.

**Implementation**

The date-tools import registers `vxStringtoTime` directly. The implementation creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)`, passes its `ShortTimeFormat` through `vxTimeFormat`, and invokes `vxStringtoDateTime(ConvertedMask, aString)`.

`vxTimeFormat` performs this case-sensitive transformation sequence:

1. replace the first lowercase/uppercase occurrences of `am`, `pm`, `AM` and `PM` with placeholders;
2. replace the first occurrences of `mm`, `m`, `MM` and `M` with `nn`, `n`, `NN` and `N`; and
3. restore the AM/PM placeholders.

The calls use `StringReplace` with an empty flags set, so each call replaces only its first occurrence. The protection prevents the `M` letters inside common AM/PM tokens from being converted to minute tokens.

**Edge cases and quirks**

- `vxTimeFormat` can produce a single `N` from a single `m`, but `vxStringtoDateTime` only implements `NN`; a system pattern using a single-minute token is therefore not parsed as minutes.
- Only the first occurrence of each protected or minute pattern is replaced. Unusual short-time formats containing repeated minute/AM-PM segments are only partially converted.
- Mixed-case AM/PM spellings that are not one of the four exact protected forms are not protected from the later `M` replacement.
- Separators are positional wildcards. The input character at a separator position does not have to equal the system `TimeSeparator` or the character shown in `ShortTimeFormat`.
- A successful time-only parse is anchored to `Now`'s local date. Identical input parsed on different days produces different `TDateTime` values.
- The underlying parser stops when input is empty and does not reject all unconsumed suffixes. AM/PM handling is permissive, and a mask token at the final format character is skipped.
- The parser's `timePartSpecified` flag is overwritten by each time component. Invalid components still cause final failure, but missing trailing components can default to zero when scanning stops early.
- Hour `24` is rejected by the installed Delphi `TryEncodeTime` terminal. The ordinary failure sentinel is `0.0`.
- This is not Delphi `StrToTime`: Delphi's routine returns a time fraction and strictly consumes its locale grammar, while this Velox adapter returns today's date plus time and inherits the custom scanner's wildcards.

**Side effects**

No persistent state is changed. The system locale, current local date and time of the call affect the result.

**Performance and concurrency**

Each call acquires system format settings, allocates a converted mask, then performs the custom parser's repeated string operations. State is local; midnight rollover or a system-locale change can alter later calls.

**Related entries**

- [`vxStringtoDateTime`](vxStringtoDateTime.md) is the mask parser used after short-time-format conversion.
- [`vxStringtoDateTimeValid`](vxStringtoDateTimeValid.md) exposes final encoder success for a caller-supplied mask.
- [`vxStrToDateTime`](vxStrToDateTime.md) delegates to Delphi's locale parser and accepts time-only input as a time fraction.

**External references**

- [Embarcadero `System.DateUtils.TryEncodeDateTime`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.DateUtils.TryEncodeDateTime) - describes the final date/time encoder reached by the Velox parser.
- [Free Pascal `TryEncodeDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/tryencodedatetime.html) - compatible encoding context; it does not define Velox's mask conversion or current-date behaviour.

<small>Created 2026-07-15</small>
