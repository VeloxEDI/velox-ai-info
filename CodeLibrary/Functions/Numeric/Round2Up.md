---
title: "Round2Up"
description: "Rounds decimal text at a requested place with midpoint values away from zero before reparsing it."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - rounding
  - locale
  - quirk
---

```Delphi
function Round2Up(aValue: Extended; aDP: Integer): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Round2Up(-12.25, 1); // normally -12.3: midpoint away from zero
end;
```

### Usage

`Round2Up` rounds decimal text at a requested place with midpoint values away from zero before reparsing it.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Extended` | Value converted to text and rounded. |
| `aDP` | `Integer` | Intended number of fractional decimal digits to retain. Use a non-negative value only. |

**Returns**

For supported ordinary dot-decimal text, the value rounded at `aDP` digits with a first discarded digit of 5..9 incrementing the retained magnitude. Fewer existing fractional digits return the original binary value unchanged rather than padding zeros.

### Additional Technical Info
`Round2Up` converts the value to general-format decimal text, edits digits to implement a 5-through-9 increment, then reparses the text. It removes a negative sign while editing, so midpoint rounding is away from zero for both signs.

The implementation assumes a literal dot decimal separator and ordinary non-exponent decimal text. Formatting and parsing do not even use the same settings source, which makes locale and scientific notation important correctness hazards. The example is fictional and source-reviewed only.

**Implementation**

1. `Result` starts as the original `aValue`.
2. Unqualified `SysUtils.FloatToStr(aValue)` formats through process-global `FormatSettings` in general format.
3. A leading `-` is remembered and removed.
4. The code searches for literal `.`. No dot, or no digits beyond the requested place, returns the original value.
5. The dot is removed and the first discarded character is inspected.
6. `5`..`9` recursively increments the preceding digit and zeroes digits to its right; `0`..`4` only zeroes from the discarded digit onward.
7. A carry can insert a new leading `1`; the decimal position is adjusted.
8. The literal dot and sign are restored.
9. `vxStrToFloat` reparses using a newly created Windows **system-default** `TFormatSettings`.

**Locale and representation defects**

- A comma-decimal `FloatToStr` result contains no literal dot, so the function silently returns the unrounded original value.
- Formatting uses mutable process-global `FormatSettings`, while parsing uses fresh `LOCALE_SYSTEM_DEFAULT` settings. If they differ, text produced by one side can be misread or rejected by the other.
- `FloatToStr` uses general format and can emit exponent notation for very large/small values. The digit mutators do not understand `E`, exponent signs or exponent digits; they can overwrite those characters, calculate with a nondigit, return the original due no dot or produce malformed/wrong text.
- The operation rounds the formatted decimal representation, whose significant digits are already limited, rather than the full binary `Extended` value.

**Other edge cases and quirks**

- Negative `aDP` is not validated. It indexes into characters to the left of the decimal and can access position zero/negative under enabled range checking, raise `ERangeError`, or produce an accidental/non-general integer-place result. Use [`Round2BR`](Round2BR.md) for documented negative-place scaling.
- NaN/infinity text normally has no dot and therefore returns the original special value unchanged.
- An exact carry such as supported text `99.95` at one place becomes `100.0` through recursive digit increment.
- `-0` sign preservation depends on `FloatToStr`; a no-dot representation returns the original value.
- Final `StrToFloat` failures propagate as `EConvertError`.

**Performance and side effects**

The function has no external side effect, but allocates and mutates multiple strings and creates locale settings on parse. It is slower and less stable than direct arithmetic in a high-volume loop.

**Related entries**

- [`Round2BR`](Round2BR.md) uses scaled Double nearest/even rounding without text/locale conversion.
- [`Round2`](Round2.md) uses a six-tenths arithmetic threshold.
- [`RoundAs`](RoundAs.md) selects this function with token `ROUND2UP`.

**External references**

- [Free Pascal: `SysUtils.FloatToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/floattostr.html)
- [Free Pascal: `SysUtils.StrToFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/strtofloat.html)
- [Embarcadero DocWiki: `System.SysUtils.FloatToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FloatToStr)
- [Embarcadero DocWiki: `System.SysUtils.StrToFloat`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrToFloat)

<small>Created 2026-07-15</small>
