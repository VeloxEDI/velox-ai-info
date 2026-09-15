---
title: "ProperCase"
description: "Normalises space-delimited words with caller-defined lower-case, forced-capital and all-uppercase rules."
sidebar_position: 37
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - title-case
  - casing
---

```Delphi
Function ProperCase( const aString : String; const aAllLower : TStringArray; const aLowerOverrides : TStringArray; const aAllUpper : TStringArray) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  LowerWords, CapitaliseAfter, UpperWords: TStringArray;
begin
  SetArrayLength(LowerWords, 3);
  LowerWords[0] := 'and';
  LowerWords[1] := 'of';
  LowerWords[2] := 'the';
  SetArrayLength(CapitaliseAfter, 1);
  CapitaliseAfter[0] := ':';
  SetArrayLength(UpperWords, 1);
  UpperWords[0] := 'edi';
  Value := ProperCase('THE RISE OF EDI : A GUIDE', LowerWords,
    CapitaliseAfter, UpperWords); // The Rise of EDI : A Guide
end;
```

### Usage

`ProperCase` normalises space-delimited words with caller-defined lower-case, forced-capital and all-uppercase rules.

**Parameters**

| Parameter | Meaning |
|---|---|
| `aString` | Text to transform. Leading and trailing whitespace is removed, and repeated spaces do not produce output tokens. |
| `aAllLower` | Lowercase token values that should remain entirely lower case unless forced. Entries should themselves be lower case. |
| `aLowerOverrides` | Exact original tokens which force the following middle token to be capitalised. Comparison is case-sensitive. This is commonly used for standalone punctuation such as `:`, `-` or `;`. |
| `aAllUpper` | Lowercase token values that should be returned entirely in upper case. This test has priority over every other rule. |

**Return value**

The transformed words separated by single spaces. Empty or whitespace-only input returns an empty string.

**Important behavior and quirks**

- Tokenisation uses [`SplitString`](SplitString.md), not general Unicode whitespace rules. The input is trimmed, ordinary spaces are separators, repeated spaces collapse and no empty token is preserved.
- Punctuation is not a delimiter unless surrounded by spaces. `name:subtitle` is one token; `name : subtitle` is three.
- Only the first lowercase ASCII letter is explicitly capitalised. A token that begins with punctuation can therefore capitalise a later ASCII letter. Locale-lowercased non-ASCII text may remain without a capital first letter.
- The rule arrays are not normalised. `aAllLower` and `aAllUpper` should contain lowercase values because the token has already been lowercased. `aLowerOverrides` must match the preceding original token's case.
- The function does not understand names, acronyms, apostrophes, hyphenated words or language-specific title-casing rules beyond the supplied arrays.
- It allocates a new result and does not mutate the input or arrays.

### Additional Technical Info
`ProperCase` lowercases each space-delimited token, optionally keeps selected words lower case, converts selected tokens entirely to upper case, and otherwise uppercases the first ASCII letter it can find. It then joins the tokens with one ordinary space.

The example is fictional and source-reviewed only.

**Rule precedence**

For each token, Velox performs these operations:

1. apply Delphi `AnsiLowerCase` using the current locale;
2. if the lowercased token exactly equals an `aAllUpper` entry, uppercase the complete token and stop;
3. if the token is not forced and equals an `aAllLower` entry, keep it lower case and stop; and
4. scan from left to right and uppercase the first character in the ASCII range `a` through `z`.

The first and last token are always forced. A middle token is forced only when the preceding **original** token exactly equals an `aLowerOverrides` entry.

**Performance and concurrency**

Each token is compared linearly with both applicable rule arrays. Large rule sets and many tokens produce proportional repeated comparisons. Locale-aware casing reads the process/host locale but does not mutate shared state.

**Related entries**

- [`SplitString`](SplitString.md) - the exact tokeniser used internally.
- [`TitleCase`](TitleCase.md) - calls `ProperCase` with Velox's fixed English-oriented rule arrays.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.AnsiLowerCase`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.AnsiLowerCase)
- [Embarcadero DocWiki: `System.SysUtils.AnsiUpperCase`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.AnsiUpperCase)
- [Free Pascal: `AnsiLowerCase`](https://www.freepascal.org/docs-html/rtl/sysutils/ansilowercase.html) - compatibility context; Velox runs the Delphi RTL.
- [Free Pascal: `AnsiUpperCase`](https://www.freepascal.org/docs-html/rtl/sysutils/ansiuppercase.html) - compatibility context; Velox runs the Delphi RTL.

<small>Created 2026-07-15</small>
