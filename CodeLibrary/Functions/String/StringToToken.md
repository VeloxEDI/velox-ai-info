---
title: "StringToToken"
description: "Creates a caller-owned TStringList of non-empty tokens separated by any character in a supplied set."
sidebar_position: 61
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - tokens
  - ownership
---

```Delphi
Function StringToToken( S : string; aSeparators : TvxSeparators) : TStringList
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Tokens: TStringList;
begin
  Tokens := StringToToken('A||B,C', ['|', ',']);
  try
    Value := Tokens.Count; // 3
  finally
    Tokens.Free;
  end;
end;
```

### Usage

`StringToToken` creates a caller-owned TStringList of non-empty tokens separated by any character in a supplied set.

**Ownership**

The returned list is newly allocated even when `S` is empty. Ownership transfers to the caller. Store it in a variable and call `Free`, normally in `try/finally`, to avoid leaking the object.

**Token rules**

- `aSeparators` is `set of Char`; any member ends the current token.
- Leading, trailing and consecutive separators do not create blank list entries.
- Empty source returns an allocated list with `Count = 0`.
- An empty separator set returns one token containing the complete non-empty source.
- Tokens are not trimmed, unquoted, unescaped or otherwise normalised.
- The input is passed by value and not mutated.

### Additional Technical Info
`StringToToken` creates a new `TStringList`, scans `S` for any member of `aSeparators`, and adds each non-empty token. Empty fields are discarded.

The example is fictional and source-reviewed only.

**Performance and concurrency**

The function scans once, but builds each token one character at a time and appends through `TStringList.Add`. The caller-owned list is not automatically thread-safe; do not share it across threads without external coordination.

**Related entries**

- [`StringToTokenAllowBlank`](StringToTokenAllowBlank.md) - preserves blank fields for non-empty input.
- [`StringToToken2`](StringToToken2.md) - applies Velox's `[*]` and `@` marker rules.
- [`SplitString`](SplitString.md) - writes tokens into a caller-supplied dynamic array instead of returning an object.

<small>Created 2026-07-15</small>
