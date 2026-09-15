---
title: "ReverseString"
description: "Returns text in reverse UTF-16 code-unit order using Delphi's direct StrUtils implementation."
sidebar_position: 48
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - reverse
  - unicode
---

```Delphi
Function ReverseString( const AText : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ReverseString('ABC-123'); // 321-CBA
end;
```

### Usage

Use `ReverseString` to reverse the UTF-16 code units in a string. It is suitable for code-unit-oriented text, but it can split surrogate pairs and combining-character sequences, so do not use it when user-perceived Unicode characters must remain intact.

**Parameters and return value**

`AText` is not modified.

### Additional Technical Info
`ReverseString` allocates a result with the same Delphi `Length` as `AText`, then copies source positions from `High(AText)` down to `Low(AText)`. It reverses UTF-16 `Char` code units, not user-perceived Unicode characters.

The example is fictional and source-reviewed only.

**Important Unicode behavior**

- A supplementary Unicode character is represented by a UTF-16 surrogate pair. Reversing its two code units produces an invalid pair.
- A base character followed by combining marks has its code units reversed, so the visual grapheme is not preserved.
- Emoji sequences joined by variation selectors or zero-width joiners are not treated atomically.
- Applying `ReverseString` twice restores the original code-unit sequence, even when the once-reversed intermediate text is not valid/meaningful Unicode.

Use this function for code-unit-oriented ASCII or controlled BMP text. It is not a locale-aware reversal, word reversal or grapheme-cluster reversal.

**Performance and concurrency**

Runtime is linear in UTF-16 length with one result allocation. No shared state is read.

**External references**

- [Embarcadero DocWiki: `System.StrUtils.ReverseString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.StrUtils.ReverseString)
- [Free Pascal: `StrUtils.ReverseString`](https://www.freepascal.org/docs-html/rtl/strutils/reversestring.html) - compatible code-unit-oriented intent; implementation details may differ.

<small>Created 2026-07-15</small>
