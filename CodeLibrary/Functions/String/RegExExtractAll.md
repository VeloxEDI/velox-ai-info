---
title: "RegExExtractAll"
description: "Returns the complete first regular-expression match and all of that match's capture groups in an output array."
sidebar_position: 40
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - regex
  - capture-groups
---

```Delphi
Function RegExExtractAll( const aExpression, aInput : String; var aStrings : TStringArray): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Parts: TStringArray;
begin
  if RegExExtractAll('([A-Z]{2})-([0-9]{4})', 'NZ-2048; AU-1001', Parts) then
    Value := Parts[2]; // 2048
end;
```

### Usage

`RegExExtractAll` returns the complete first regular-expression match and all of that match's capture groups in an output array.

**Parameters**

| Parameter | Meaning |
|---|---|
| `aExpression` | Velox/PCRE pattern, including any desired capture groups. |
| `aInput` | Text searched for the first non-empty match. |
| `aStrings` | Output array. It is reset to length zero before matching. On success it is resized to the first match's `Groups.Count`. |

**Important behavior and quirks**

- `NZ-2048; AU-1001` in the example produces groups for `NZ-2048` only. `AU-1001` is not represented.
- A pattern without explicit capture groups still returns a one-element array containing the complete match.
- The input is not changed, but the caller's output array is always cleared before pattern evaluation.
- Matching is unanchored and case-sensitive unless the expression changes those rules.

### Additional Technical Info
`RegExExtractAll` writes the complete first match and each capture group belonging to that match into `aStrings`. The name is misleading: it does **not** return all matches in the input.

The example is fictional and source-reviewed only.

**Return value and output layout**

The function returns `True` when the first `TRegEx.Match` succeeds. On success:

- `aStrings[0]` is the complete matched text;
- `aStrings[1]` is capture group 1;
- subsequent elements follow capture-group order; and
- an optional group that did not participate normally contributes an empty value.

On a normal `False` result, `aStrings` remains an empty array.

**How it works**

Velox clears the output, calls `TRegEx.Match(aInput, aExpression)`, then copies `Match.Groups[i].Value` for `i = 0` through `Groups.Count - 1`. It never calls `Matches` or advances to another match. Delphi's default `roNotEmpty` option prevents a solely empty match from succeeding.

**Errors, performance and concurrency**

Invalid patterns and regex engine errors propagate as exceptions. If evaluation raises, `aStrings` has already been cleared. Each call constructs a new regex object and then allocates/copies the group array. Pathological expressions can consume excessive CPU or memory; do not apply untrusted expressions to large untrusted input without independent limits.

**Related entries**

- [`RegExExtract`](RegExExtract.md) - returns only the complete first match.
- [`RegExMatch`](RegExMatch.md) - Boolean existence test.

**External references**

- [Embarcadero DocWiki: `System.RegularExpressions.TRegEx.Match`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.RegularExpressions.TRegEx.Match)
- [Embarcadero DocWiki: `System.RegularExpressions.TGroupCollection`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.RegularExpressions.TGroupCollection)
- [Free Pascal: `TRegExpr`](https://www.freepascal.org/daily/packages/regexpr/regexpr/tregexpr.html) - compatibility context for first-match and capture access; not Velox's runtime engine.

<small>Created 2026-07-15</small>
