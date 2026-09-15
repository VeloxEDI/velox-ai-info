---
title: Names
description: Returns the text before the first NameValueSeparator at an indexed entry, or an empty string when no separator exists.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, names, name-value, index]
---

```Delphi
property Names[Index: Integer]: string read;
```

### Example

```Delphi
procedure ReadFirstName(const Items: TStringList; var Name: string);
begin
  Items.NameValueSeparator := '=';
  if Items.Count > 0 then
    Name := Items.Names[0];
end;
```

### Usage

`Names` returns the text before the first NameValueSeparator at an indexed entry, or an empty string when no separator exists.

- Validate `0 <= Index < Count`.
- An empty result is ambiguous between a missing separator and an explicitly empty name.
- Use [`IndexOfName`](../Methods/IndexOfName.md) or [`Values`](Values.md) for name-based lookup.

### Additional Technical Info
`Names` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It is a parsed view of [`Strings[Index]`](Strings.md), not separate stored metadata.

#### Source-backed behaviour

The installed getter reads the indexed string, finds the first [`NameValueSeparator`](NameValueSeparator.md) with `AnsiPos`, and returns everything before it. If no separator occurs, the result is empty. Later separator characters remain in the value portion.

Index validation comes from the concrete string getter. A leading separator produces an empty name. Whitespace is not trimmed, case is not changed and duplicate names are permitted.

#### Related members

[`ValueFromIndex`](ValueFromIndex.md) extracts the corresponding value. [`NameValueSeparator`](NameValueSeparator.md) controls the split.

#### Official RTL references

- [Embarcadero: TStrings.Names](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Names)
- [Free Pascal: TStrings.Names](https://www.freepascal.org/docs-html/rtl/classes/tstrings.names.html)

<small>Created 2026-07-15</small>
