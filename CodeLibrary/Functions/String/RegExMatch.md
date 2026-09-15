---
title: "RegExMatch"
description: "Reports whether a Delphi regular expression finds any non-empty match within an input string."
sidebar_position: 41
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - regex
  - match
---

```Delphi
Function RegExMatch( const ARegExpr, AInputStr : string) : boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := RegExMatch('^[A-Z]{2}-[0-9]{4}$', 'NZ-2048'); // True
end;
```

### Usage

`RegExMatch` reports whether a Velox regular expression finds any non-empty match within an input string.

**Parameters**

| Parameter | Meaning |
|---|---|
| `ARegExpr` | Velox/PCRE regular-expression pattern. |
| `AInputStr` | String searched by the pattern. |

**Return value**

`True` if `TRegEx.IsMatch(AInputStr, ARegExpr)` succeeds; otherwise `False`.

**Important behavior and quirks**

- Parameter order is pattern first, input second, although Velox's method receives input first.
- The default options are used. In the installed runtime these include `roNotEmpty`, so a pattern does not report success solely for an empty match.
- Matching is case-sensitive unless the expression supplies a supported inline case-insensitive option.
- `RegExMatch('cat', 'concatenate')` is `True`; use `^cat$` when the entire input must match.
- A Boolean `False` means no qualifying match, not that the pattern was invalid.

### Additional Technical Info
`RegExMatch` returns whether `ARegExpr` finds a non-empty match in `AInputStr`. The function searches anywhere in the input unless the pattern includes anchors such as `^` and `$`.

The example is fictional and source-reviewed only.

**Errors, performance and concurrency**

Invalid syntax raises a regular-expression exception rather than returning `False`. Each call constructs and prepares a new regex object. Expressions with catastrophic backtracking can consume disproportionate CPU; inputs and patterns from untrusted sources require external size, complexity or timeout controls. The per-call object is local and does not intentionally mutate Velox state.

**External references**

- [Embarcadero DocWiki: `System.RegularExpressions.TRegEx.IsMatch`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.RegularExpressions.TRegEx.IsMatch)
- [Free Pascal: `TRegExpr.Exec`](https://www.freepascal.org/daily/packages/regexpr/regexpr/tregexpr.exec.html) - analogous Boolean matching through a different engine/API.

<small>Created 2026-07-15</small>
