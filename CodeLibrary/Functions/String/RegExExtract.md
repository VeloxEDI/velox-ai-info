---
title: "RegExExtract"
description: "Returns whether a regular expression has a first non-empty match and writes that complete match to an output string."
sidebar_position: 39
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - regex
  - extract
---

```Delphi
Function RegExExtract( const aExpression, aInput : String; var aPiece : String) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Piece: String;
begin
  if RegExExtract('[A-Z]{2}-[0-9]{4}', 'Reference NZ-2048 received', Piece) then
    Value := Piece; // NZ-2048
end;
```

### Usage

`RegExExtract` returns whether a regular expression has a first non-empty match and writes that complete match to an output string.

**Parameters**

| Parameter | Meaning |
|---|---|
| `aExpression` | Velox/PCRE regular-expression pattern. |
| `aInput` | Text to search. Matching is not anchored unless the pattern supplies anchors. |
| `aPiece` | Output string. It is cleared before the pattern is evaluated, then receives `Match.Value` on success. |

**Return value**

`True` when `TRegEx.Match` finds a non-empty match; otherwise `False`. On a normal `False` result, `aPiece` is empty.

**Important behavior and quirks**

- Only the first complete match is returned. Capturing groups are not exposed by this function.
- A pattern that can match an empty string does not succeed solely on that empty match under the default `roNotEmpty` option.
- Matching is case-sensitive, single-line and otherwise uses Velox's default options unless the pattern itself contains supported inline modifiers.
- The input is not modified. `aPiece` is modified even when the result is `False`.
- Use [`RegExExtractAll`](RegExExtractAll.md) for the first match's capture groups; despite its name, it also does not enumerate every match.

### Additional Technical Info
`RegExExtract` finds the first non-empty match of a Delphi regular expression and assigns the complete matched text to `aPiece`. It returns whether that match succeeded.

The example is fictional and source-reviewed only.

**How it works**

Velox clears `aPiece`, calls the static two-string `TRegEx.Match(aInput, aExpression)` overload, copies `TMatch.Success` to the Boolean result and, on success, copies `TMatch.Value` to `aPiece`. The default Delphi options include `roNotEmpty`.

**Errors, performance and concurrency**

An invalid pattern or regex engine failure raises a Delphi regular-expression exception; the function does not convert it to `False`. `aPiece` has already been cleared at that point. A fresh regex object is created for each call, so repeated use of a complex pattern pays compilation/setup cost each time. The object is local, but CPU and memory use can become excessive for pathological patterns or hostile input.

**External references**

- [Embarcadero DocWiki: `System.RegularExpressions.TRegEx.Match`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.RegularExpressions.TRegEx.Match)
- [Embarcadero DocWiki: `System.RegularExpressions.TMatch`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.RegularExpressions.TMatch)
- [Free Pascal: `TRegExpr.Exec`](https://www.freepascal.org/daily/packages/regexpr/regexpr/tregexpr.exec.html) - conceptual compatibility only; Free Pascal uses a different regex API and may differ in syntax and defaults.

<small>Created 2026-07-15</small>
