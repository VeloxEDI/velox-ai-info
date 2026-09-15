---
title: ValueFromIndex
description: Gets or replaces the text after the first NameValueSeparator at an indexed entry, with empty assignment deleting the entry.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, valuefromindex, name-value, delete]
---

```Delphi
property ValueFromIndex[Index: Integer]: string read write;
```

### Example

```Delphi
procedure UpdateFirstValue(const Items: TStringList);
begin
  if Items.Count > 0 then
    Items.ValueFromIndex[0] := 'Enabled';
end;
```

### Usage

`ValueFromIndex` gets or replaces the text after the first NameValueSeparator at an indexed entry, with empty assignment deleting the entry.

- Treat empty read as ambiguous: missing entry, missing separator and explicit empty value are indistinguishable.
- Never assign empty merely to clear the value unless deletion is intended.
- Do not use the setter on a sorted `TStringList`; update the pair through sorted remove/add logic.

### Additional Technical Info
`ValueFromIndex` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). Its setter has structural side effects beyond changing text.

#### Source-backed behaviour

The getter returns empty for a negative index; otherwise it reads the entry, removes everything through the first separator, and returns the remainder. No separator also yields empty. Normal out-of-range nonnegative indexes are rejected by the concrete getter.

For a nonempty assigned value, a negative index first adds an empty entry; the setter then writes `Names[Index] + NameValueSeparator + Value`. For an existing entry without a separator, that produces a leading separator. Assigning an empty value deletes an existing entry rather than storing an explicit empty value. On a sorted `TStringList`, the final string write raises; a negative-index call can therefore add an empty entry and then fail, leaving that partial mutation behind.

#### Related members

[`Names`](Names.md) supplies the retained name. [`Values`](Values.md) performs first-match access by name. [`NameValueSeparator`](NameValueSeparator.md) controls parsing.

#### Official RTL references

- [Embarcadero: TStrings.ValueFromIndex](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.ValueFromIndex)
- [Free Pascal: TStrings.ValueFromIndex](https://www.freepascal.org/docs-html/rtl/classes/tstrings.valuefromindex.html)

<small>Created 2026-07-15</small>
