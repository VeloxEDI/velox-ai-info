---
title: "StringReplaceFirst"
description: "Replaces the first non-overlapping occurrence of a pattern using case-insensitive Delphi string comparison."
sidebar_position: 60
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - replace-first
  - case-insensitive
---

```Delphi
Function StringReplaceFirst( const S, OldPattern, NewPattern : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StringReplaceFirst('North NORTH north', 'north', 'South');
  // South NORTH north
end;
```

### Usage

`StringReplaceFirst` replaces the first non-overlapping occurrence of a pattern using case-insensitive Velox string comparison.

**Important behavior and quirks**

- Matching is always case-insensitive; there is no flag for a case-sensitive first replacement.
- Empty source or empty old pattern is returned unchanged.
- The first match is determined from the beginning of the source. Later occurrences remain exactly as supplied.
- `OldPattern` is literal text, not a regex or wildcard expression.
- `NewPattern` can be empty to delete the first match.
- Non-ASCII ignore-case results can depend on Velox's current locale/case-conversion behavior.
- Embedded NUL remains part of the length-counted source.

### Additional Technical Info
`StringReplaceFirst` replaces only the earliest case-insensitive occurrence of `OldPattern` in `S`. It returns a new string and leaves the input unchanged.

The example is fictional and source-reviewed only.

**How it works**

The wrapper calls Delphi `StringReplace(S, OldPattern, NewPattern, [rfIgnoreCase])`. Because `rfReplaceAll` is absent, scanning stops after the first match.

**Performance and concurrency**

At most one match is replaced, although the search still scans up to that match. Output allocation depends on the replacement length. The function mutates no Velox state.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringReplace)
- [Free Pascal: `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - compatibility context.

<small>Created 2026-07-15</small>
