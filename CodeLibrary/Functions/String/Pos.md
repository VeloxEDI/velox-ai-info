---
title: "Pos"
description: "Returns the one-based position of the first exact, case-sensitive substring match, or zero when no non-empty match exists."
sidebar_position: 34
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - search
  - substring
  - indexing
---

```Delphi
function Pos(SubStr, S: String): LongInt;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Pos('EDI', 'Velox EDI'); // 7
end;
```

### Usage

Returns the one-based position of the first exact, case-sensitive substring match, or zero when no non-empty match exists.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `SubStr` | `String` | Non-empty text to locate. |
| `S` | `String` | Source text to search. |
| Result | `LongInt` | First one-based match position, or `0`. |

Matching is case-sensitive, ordinal and non-regex. `'edi'` does not match `'EDI'`. In Velox, an empty `SubStr` returns `0`, including against an empty source. A non-empty substring longer than `S` also returns `0`.

ANSI, `WideString` and `UnicodeString` values are supported. Arguments must be compatible string values. No locale-based case folding or Unicode normalisation is performed.

Positions are code-unit indexes. If the string carries multibyte ANSI text or UTF-16 surrogate pairs, the number is not necessarily a user-perceived character index. Check explicitly for `> 0` before using the result as a position; subtracting or passing a not-found zero into another one-based routine can produce unintended boundary behavior.

Use [`PosEx`](PosEx.md) when the search must start at a caller-specified offset. Use [`IndexText`](IndexText.md) for a case-insensitive whole-value lookup in an array.

### Additional Technical Info
`Pos` searches `S` from its beginning for the first exact occurrence of `SubStr`. It returns the one-based starting position or `0` when no match exists.

The example is fictional and source-reviewed only.

**External references**

- [Embarcadero DocWiki: `System.Pos`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Pos)
- [Free Pascal: `System.Pos`](https://www.freepascal.org/docs-html/rtl/system/pos.html)

<small>Created 2026-07-15</small>
