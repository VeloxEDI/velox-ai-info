---
title: "StringOfChar"
description: "Returns a script string filled with a requested number of copies of one character."
sidebar_position: 57
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - repeat
  - fill
---

```Delphi
function StringOfChar(C: Char; I: LongInt): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StringOfChar('0', 4); // 0000
end;
```

### Usage

`StringOfChar` returns a script string filled with a requested number of copies of one character.

**Parameters and return value**

| Item | Meaning |
|---|---|
| `C` | Character used to fill the result. If supplied as a string, Velox uses its first character. |
| `I` | Number of characters. Zero or a negative value returns an empty string. |
| Result | Newly allocated filled string for positive `I`. |

### Additional Technical Info
`StringOfChar` returns `I` copies of `C`. The modified PascalScript runtime registers it and [`Replicate`](Replicate.md) against the same selector 28, so their behavior is identical.

The example is fictional and source-reviewed only.

**Important behavior and limits**

- This function repeats one character only. Use [`StringOfString`](StringOfString.md) to repeat complete text.
- `StringOfChar(#0, N)` has Delphi length `N` but begins with NUL; C-style and pointer-scanning consumers can treat it as empty.
- The operation works in code units and does not construct multi-code-unit grapheme clusters.
- Very large positive counts can raise allocation or overflow exceptions. No maximum is enforced by Velox before the Delphi call.

**Performance and concurrency**

The terminal allocates once and fills the result. It has no shared Velox state.

**External references**

- [Embarcadero DocWiki: `System.StringOfChar`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.StringOfChar)
- [Free Pascal: `System.StringOfChar`](https://www.freepascal.org/docs-html/rtl/system/stringofchar.html)

<small>Created 2026-07-15</small>
