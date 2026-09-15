---
title: "LetterToDecimalNumber"
description: "Maps a lowercase ASCII letter to the fractional value 0.01 through 0.26 without validating the character."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - character
  - version
---

```Delphi
function LetterToDecimalNumber(aLetter: Char): Double;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LetterToDecimalNumber('c'); // approximately 0.03
end;
```

### Usage

`LetterToDecimalNumber` maps a lowercase ASCII letter to the fractional value 0.01 through 0.26 without validating the character.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aLetter` | `Char` | Intended as a single lowercase ASCII letter. It is not converted to lower case. |

**Returns**

The `Double` result of:

```Delphi
(Ord(aLetter) - 96) / 100
```

| Input | Result |
|---|---|
| `'a'` | approximately `0.01` |
| `'z'` | approximately `0.26` |
| `'A'` | approximately `-0.31` |
| `'0'` | approximately `-0.48` |
| `'{'` | approximately `0.27` |

### Additional Technical Info
`LetterToDecimalNumber` maps lowercase ASCII `a`..`z` to the fractions `0.01`..`0.26`. Velox uses the helper when incorporating a letter-based minor product version into a numeric version value.

The function does not validate or normalize the character. Its name can be misleading: it returns a fraction, not `1` through `26`. The example is fictional and source-reviewed only.

**Implementation and quirks**

`uPSI_vxCommon` registers the native function directly. Delphi `Ord` returns the character's ordinal code, 96 is subtracted, and the integer difference is divided by 100 as floating point.

- Only lowercase ASCII `a`..`z` has the intended meaning.
- Uppercase, punctuation, digits and non-ASCII Unicode `Char` values are still processed arithmetically; no sentinel or exception identifies them as invalid.
- The result is binary floating point, so most hundredths are approximations.
- Passing a multi-character string is not allowed by the `Char` declaration; explicitly select/validate one character.
- This is not a general base-26 or spreadsheet-column conversion.

**Side effects and performance**

The function is pure and constant-time.

**External references**

- [Free Pascal: `System.Ord`](https://www.freepascal.org/docs-html/rtl/system/ord.html)
- [Embarcadero DocWiki: `System.Ord`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Ord)

<small>Created 2026-07-15</small>
