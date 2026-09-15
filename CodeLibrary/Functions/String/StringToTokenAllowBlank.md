---
title: "StringToTokenAllowBlank"
description: "Creates a caller-owned TStringList that preserves leading, trailing and consecutive blank fields for non-empty input."
sidebar_position: 63
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - tokens
  - blank-fields
---

```Delphi
Function StringToTokenAllowBlank( S : string; aSeparators : TvxSeparators) : TStringList
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Tokens: TStringList;
begin
  Tokens := StringToTokenAllowBlank('A||B|', ['|']);
  try
    Value := Tokens.Count; // 4: A, blank, B, blank
  finally
    Tokens.Free;
  end;
end;
```

### Usage

`StringToTokenAllowBlank` creates a caller-owned TStringList that preserves leading, trailing and consecutive blank fields for non-empty input.

**Ownership**

The returned `TStringList` is newly allocated and caller-owned. Always free it after use. Empty source still returns a live allocated list, but its early exit leaves `Count = 0` rather than adding one blank token.

**Token rules**

- Leading separators produce leading blank entries.
- Consecutive separators produce blank entries between them.
- A trailing separator produces a trailing blank entry.
- Any character in `aSeparators` is a delimiter; the exact delimiter is not retained.
- With an empty separator set and non-empty source, the list contains the complete source as one token.
- No token is trimmed, unescaped or normalised.

### Additional Technical Info
`StringToTokenAllowBlank` creates a token at every separator boundary and adds the final token after scanning. For every **non-empty** source, the result count is the number of separator characters encountered plus one.

The example is fictional and source-reviewed only.

**Performance and concurrency**

The source is scanned once, with per-character token concatenation and one list append per field. The returned list is not automatically thread-safe.

**Related entries**

- [`StringToToken`](StringToToken.md) - discards blank fields.
- [`SplitString`](SplitString.md) - also discards blanks and writes a dynamic array.

<small>Created 2026-07-15</small>
