---
title: "StringReplaceAll"
description: "Replaces every non-overlapping occurrence of a pattern using Delphi's case-insensitive string comparison."
sidebar_position: 59
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - replace
  - case-insensitive
---

```Delphi
Function StringReplaceAll( const S, OldPattern, NewPattern : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StringReplaceAll('North NORTH north', 'north', 'South');
  // South South South
end;
```

### Usage

`StringReplaceAll` replaces every non-overlapping occurrence of a pattern using Velox's case-insensitive string comparison.

**Parameters and return value**

| Item | Meaning |
|---|---|
| `S` | Source text. |
| `OldPattern` | Exact substring to find without case sensitivity. It is not a regex. |
| `NewPattern` | Replacement inserted for each original match. |
| Result | New string after Velox `StringReplace` with `[rfReplaceAll, rfIgnoreCase]`. |

**Important behavior and quirks**

- Despite the general name, comparison is always case-insensitive.
- Empty `S` or empty `OldPattern` returns `S` unchanged.
- Matches are non-overlapping and are identified in the original search progression. Text introduced by `NewPattern` is not recursively searched during the same call.
- The case of `NewPattern` is preserved exactly; the case of each matched source occurrence is not retained.
- Velox's ignore-case path uses its current locale-aware ANSI case conversion/comparison machinery. Results for non-ASCII text can depend on locale and case-expansion behavior.
- Embedded NUL is length-counted by this function and does not terminate the replace operation.

### Additional Technical Info
`StringReplaceAll` returns `S` with every non-overlapping, case-insensitive occurrence of `OldPattern` replaced by `NewPattern`. The source is not modified.

The example is fictional and source-reviewed only.

**Performance and concurrency**

The RTL first locates matches, then allocates the exact result where possible. A large number of matches can require a position array and substantial output memory. Locale is external read-only state for the call.

**Related entries**

- [`StringReplaceFirst`](StringReplaceFirst.md) - replaces only the first match.
- [`RegExReplace`](RegExReplace.md) - currently does not return or apply its computed regex replacement.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringReplace)
- [Free Pascal: `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - compatible flag-driven operation; Velox runs Delphi's implementation.

<small>Created 2026-07-15</small>
