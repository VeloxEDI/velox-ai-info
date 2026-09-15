---
title: "Replicate"
description: "Returns a script string containing one character repeated a requested number of times."
sidebar_position: 47
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - repeat
  - character
---

```Delphi
function Replicate(C: Char; I: LongInt): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Replicate('-', 5); // -----
end;
```

### Usage

`Replicate` returns a script string containing one character repeated a requested number of times.

**Parameters and return value**

| Item | Meaning |
|---|---|
| `C` | Character to repeat. The runtime retrieves it through its string representation and uses the first character. |
| `I` | Requested signed repetition count. |
| Result | `StringOfChar(C, I)`. A nonpositive count yields empty text in the current Velox. |

**Important behavior and quirks**

- `Replicate` does not repeat a multi-character string. Use [`StringOfString`](StringOfString.md) for that purpose.
- `C = #0` creates a string containing embedded NUL code units. Its Velox length is still `I`, but pointer-based helpers may treat it as empty or stop at the first NUL.
- The result contains code units, not grapheme clusters.
- Very large counts can raise an allocation or integer-overflow exception.

### Additional Technical Info
`Replicate` returns `I` copies of the character `C`. In the modified PascalScript runtime it is an exact alias of [`StringOfChar`](StringOfChar.md): both names use the same runtime selector and Delphi terminal.

The example is fictional and source-reviewed only.

**Performance and concurrency**

The Delphi terminal allocates the result once and fills it. It does not read shared Velox state.

**External references**

- [Embarcadero DocWiki: `System.StringOfChar`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.StringOfChar)
- [Free Pascal: `System.StringOfChar`](https://www.freepascal.org/docs-html/rtl/system/stringofchar.html) - compatible repeated-character reference.

<small>Created 2026-07-15</small>
