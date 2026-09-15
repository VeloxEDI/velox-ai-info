---
title: "RegExReplace"
description: "Reports whether a regex matches, but currently discards the computed replacement and leaves the input unchanged."
sidebar_position: 42
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - regex
  - defect
---

```Delphi
Function RegExReplace( const ARegExpr, AInputStr, AReplaceStr : string) : boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Input: String;
begin
  Input := 'Order 1007';
  if RegExReplace('[0-9]+', Input, '####') then
    Value := Input; // still 'Order 1007'
end;
```

### Usage

`RegExReplace` reports whether a regex matches, but currently discards the computed replacement and leaves the input unchanged.

**Parameters**

| Parameter | Meaning |
|---|---|
| `ARegExpr` | Velox/PCRE pattern. |
| `AInputStr` | Read-only input text. It is never changed. |
| `AReplaceStr` | Replacement expression passed to Velox only when a match is first found. Any resulting text is discarded. |

**Return value**

The Boolean result of `TRegEx.IsMatch(AInputStr, ARegExpr)`: `True` for a non-empty match and `False` otherwise. It does **not** indicate that observable replacement occurred.

**Important behavior and quirks**

- No successful call changes `AInputStr` or returns replaced text.
- A matched input is scanned twice: once by `IsMatch` and again by `Replace`.
- An unmatched input does not evaluate replacement processing beyond the first match test.
- The default regex options include `roNotEmpty`; empty matches alone are excluded.
- Replacement syntax, including group substitutions, is still evaluated when a match is found. A malformed or unsupported replacement can therefore raise an error even though replacement text is never returned.

### Additional Technical Info
`RegExReplace` currently acts as an expensive Boolean match test. When a match exists it computes a replaced string internally, but discards that string. `AInputStr` is declared `const`, so neither the caller's value nor any return string can receive the replacement.

The example is fictional and source-reviewed only. It demonstrates the current defect; do not use this function when transformed text is required.

**Exact implementation**

```Delphi
Result := TRegEx.IsMatch(AInputStr, ARegExpr);
if Result then
  TRegEx.Replace(AInputStr, ARegExpr, AReplaceStr);
```

Delphi `TRegEx.Replace` is a function returning a new string. The Velox wrapper ignores that return value.

**Recommended selection**

Use [`RegExMatch`](RegExMatch.md) when only a Boolean test is required. There is currently no working public regex replacement function in this entry. For exact literal replacement, use [`StringReplaceAll`](StringReplaceAll.md) or [`StringReplaceFirst`](StringReplaceFirst.md) as appropriate.

**Errors, performance and concurrency**

Pattern and replacement exceptions propagate. Matched inputs allocate a replacement result that is immediately released, so the function can consume time and memory without producing transformed output. Regex backtracking risks still apply. Per-call regex objects are local.

**External references**

- [Embarcadero DocWiki: `System.RegularExpressions.TRegEx.IsMatch`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.RegularExpressions.TRegEx.IsMatch)
- [Embarcadero DocWiki: `System.RegularExpressions.TRegEx.Replace`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.RegularExpressions.TRegEx.Replace)
- [Free Pascal: `ReplaceRegExpr`](https://www.freepascal.org/daily/packages/regexpr/regexpr/replaceregexpr.html) - comparison only; this API correctly returns replaced text and is not the Velox terminal.

<small>Created 2026-07-15</small>
