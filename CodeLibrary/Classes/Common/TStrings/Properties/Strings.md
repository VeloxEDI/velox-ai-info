---
title: Strings
description: Gets or replaces the string at a zero-based index through the concrete descendant's default indexed property.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, strings, default-property, index]
---

```Delphi
property Strings[Index: Integer]: string read write; default;
```

### Example

```Delphi
procedure NormaliseFirst(const Items: TStringList);
begin
  if Items.Count > 0 then
    Items.Strings[0] := 'Normalised';
end;
```

### Usage

`Strings` gets or replaces the string at a zero-based index through the string list's default indexed property.

- Check bounds against [`Count`](Count.md).
- Do not write an entry in a sorted `TStringList`; remove/re-add through its sorting policy instead.
- Saved indexes can become stale after any insertion, deletion, move or sort.

### Additional Technical Info
`Strings` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). Because it is the default property, `Items[0]` and `Items.Strings[0]` are equivalent in script.

#### Source-backed behaviour

The read accessor is abstract in `TStrings`. The base write accessor preserves the current object reference, deletes the entry and reinserts the new text at the same index; that multi-step path can be partially destructive. `TStringList` overrides the setter with an in-place text assignment, bounds checks and notifications, but rejects all string replacement when `Sorted=True` to protect ordering.

Valid indexes are `0..Count-1`. Assigning text containing [`NameValueSeparator`](NameValueSeparator.md) makes it visible through the name/value properties but does not create separate storage.

#### Related members

[`Objects`](Objects.md) is the paired association. [`Add`](../Methods/Add.md), [`Insert`](../Methods/Insert.md) and [`Delete`](../Methods/Delete.md) change the indexed set.

#### Official RTL references

- [Embarcadero: TStrings.Strings](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Strings)
- [Free Pascal: TStrings.Strings](https://www.freepascal.org/docs-html/rtl/classes/tstrings.strings.html)

<small>Created 2026-07-15</small>
