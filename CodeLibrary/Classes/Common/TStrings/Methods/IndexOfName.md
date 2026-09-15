---
title: IndexOfName
description: Finds the first entry whose text begins with the requested name followed by NameValueSeparator.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, indexofname, name-value, search]
---

```Delphi
function IndexOfName(Name: string): Integer;
```

### Example

```Delphi
procedure FindSetting(const Items: TStringList; var FoundAt: Integer);
begin
  Items.NameValueSeparator := '=';
  FoundAt := Items.IndexOfName('Mode');
end;
```

### Usage

`IndexOfName` finds the first entry whose text begins with the requested name followed by NameValueSeparator.

- Keep key spelling and whitespace canonical; `Mode` and ` Mode` are different names.
- Duplicate names are allowed and only one matching index is returned.
- A sorted list is sorted by complete entry text, not a separate key column; preserve its comparison invariants.

### Additional Technical Info
`IndexOfName` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It searches name/value syntax; it does not search arbitrary substrings.

#### Source-backed behaviour

The base implementation finds the first [`NameValueSeparator`](../Properties/NameValueSeparator.md) in each entry, compares the preceding name through virtual `CompareStrings`, and returns the first match. Entries without the separator are ignored.

`TStringList` has optimized linear and, under narrow sorted/non-locale/non-duplicate conditions, binary paths. Its case and locale settings apply. The requested `Name` is not trimmed, and only a separator immediately after the compared name qualifies.

#### Related members

[`Names`](../Properties/Names.md) extracts a key by index. [`ValueFromIndex`](../Properties/ValueFromIndex.md) returns the value at a known index.

#### Official RTL references

- [Embarcadero: TStrings.IndexOfName](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.IndexOfName)
- [Free Pascal: TStrings.IndexOfName](https://www.freepascal.org/docs-html/rtl/classes/tstrings.indexofname.html)

<small>Created 2026-07-15</small>
