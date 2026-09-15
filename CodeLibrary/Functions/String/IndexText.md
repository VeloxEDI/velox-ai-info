---
title: "IndexText"
description: "Returns the zero-based index of the first whole-string, case-insensitive array match, or -1 when no value matches."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - array
  - index
  - case-insensitive
---

```Delphi
Function IndexText(const AText: string; const AValues: TStringArray): Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IndexText('green', ['Red', 'Green', 'Blue']); // 1
end;
```

### Usage

`IndexText` returns the zero-based index of the first whole-string, case-insensitive array match, or -1 when no value matches.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `AText` | `string` | Complete text to find. |
| `AValues` | `TStringArray` | Candidate values in search order. |
| Result | `Integer` | First matching array index, or `-1`. Do not interpret `0` as “not found.” |

Matching is for the complete string, not a prefix or substring. Duplicate case-insensitive values resolve to the first occurrence. Empty text can match an empty candidate. An empty array returns `-1`.

### Additional Technical Info
`IndexText` searches `AValues` from its lowest index to its highest and returns the zero-based index of the first string equal to `AText` under a case-insensitive comparison. It returns `-1` when there is no match.

The example is fictional and source-reviewed only.

**Implementation and comparison**

Velox imports Delphi `System.StrUtils.IndexText` directly. The installed routine delegates to `AnsiIndexText`, walks the array linearly and compares each candidate using `AnsiSameText`. The comparison is case-insensitive and locale-aware; language-sensitive equivalence can depend on the Windows execution account. If deterministic ASCII keys are required, normalise/validate those keys explicitly instead of relying on user-locale text comparison.

Runtime is proportional to the number of candidates and the compared string lengths. No array or text is modified.

**External references**

- [Embarcadero DocWiki: `System.StrUtils.IndexText`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.IndexText)
- [Free Pascal: `StrUtils.IndexText`](https://www.freepascal.org/docs-html/rtl/strutils/indextext.html)

<small>Created 2026-07-15</small>
