---
title: IndexOf
description: Returns the first matching string index under the concrete list's comparison policy, or minus one.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, indexof, search, comparison]
---

```Delphi
function IndexOf(const S: string): Integer;
```

### Example

```Delphi
procedure FindStatus(const Items: TStringList; var FoundAt: Integer);
begin
  FoundAt := Items.IndexOf('Complete');
end;
```

### Usage

`IndexOf` returns the first matching string index under the list's comparison policy, or minus one.

- Test for `>= 0`; `-1` means no match.
- Do not compare the result with [`Count`](../Properties/Count.md) as a not-found sentinel.
- Locale and case settings can make results environment-sensitive.

### Additional Technical Info
`IndexOf` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). Matching can therefore differ from the exact comparison used by [`Equals`](Equals.md).

#### Source-backed behaviour

The base implementation scans from index zero and calls virtual `CompareStrings` until it returns zero. A `TStringList` override uses a linear scan when unsorted and binary `Find` when sorted.

For `TStringList`, `CaseSensitive` and `UseLocale` influence comparison. The current script constructor defaults to case-insensitive, locale-aware comparison. A sorted list returns a matching position according to the binary-search path; when accepted duplicates exist, callers must not assume which equal entry is returned.

#### Related members

[`IndexOfName`](IndexOfName.md) searches name/value keys and [`IndexOfObject`](IndexOfObject.md) uses object identity. [`Equals`](Equals.md) always performs ordered case-sensitive text equality.

#### Official RTL references

- [Embarcadero: TStrings.IndexOf](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.IndexOf)
- [Free Pascal: TStrings.IndexOf](https://www.freepascal.org/docs-html/rtl/classes/tstrings.indexof.html)

<small>Created 2026-07-15</small>
