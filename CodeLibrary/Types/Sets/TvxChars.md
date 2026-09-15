---
title: TvxChars
description: Defines an 8-bit character membership set for Velox removal and validation string helpers.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, set, char, validation, unicode]
---

```Delphi
TvxChars = set of Char
```

### Example

```Delphi
function IsAsciiDigits(const Value: String): Boolean;
var
  Digits: TvxChars;
begin
  Digits := ['0'..'9'];
  Result := StringContainsOnly(Value, Digits);
end;
```

### Usage

`TvxChars` defines an 8-bit character membership set for Velox removal and validation string helpers.

#### Character-domain boundary

The current script `Char` and a set's ordinal range are eight-bit, while script `String` is Unicode. `TvxChars` can therefore describe only character values with ordinals 0..255. It is suitable for ASCII-oriented protocol characters and carefully defined Latin-1-range values; it cannot represent general Unicode characters, supplementary characters or grapheme clusters.

Do not assume a visually similar Unicode character matches an ASCII member. Normalize and validate with a Unicode-aware function when the business rule is about human text rather than protocol code units.

#### Current helper behavior

- `RemoveChars2` scans from the first character and copies every character not present in the set.
- `StringContainsOnly` returns true only when the source is nonempty and every scanned character is in the set. It deliberately returns false for `''`, even if the set is nonempty.
- Both implementations convert the source to a Velox `PChar` and stop at the first `#0`. Characters after an embedded NUL are not examined; `RemoveChars2` also omits that NUL and the suffix.
- Both build/scan in memory and perform no trimming, normalization, case folding or locale-aware comparison.

If embedded NUL or non-ASCII input is possible, reject it before using these helpers or use a function with an explicit Unicode/string-length contract.

### Additional Technical Info
`TvxChars` is registered by the Velox common-string importer for [`RemoveChars2`](../../Functions/String/RemoveChars2.md) and [`StringContainsOnly`](../../Functions/String/StringContainsOnly.md). It is a fixed membership set over the public PascalScript [`Char`](../DataTypes/Char.md) domain.

**Related Code Library entries**

- [Char](../DataTypes/Char.md) - the current 8-bit script character boundary.
- [Sets](../Sets.md) - constructors, ranges and membership operations.

**External references**

- [Embarcadero structured types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_%28Delphi%29) - Delphi set construction and membership.
- [Free Pascal set types](https://www.freepascal.org/docs-html/ref/refsu16.html) - compatible 0..255 ordinal-domain limit.

<small>Created 2026-07-15</small>
