---
title: Values
description: Gets or changes the first name-matched value, adding on nonempty miss and deleting on empty assignment.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, values, name-value, configuration]
---

```Delphi
property Values[const Name: string]: string read write;
```

### Example

```Delphi
procedure SetMode(const Items: TStringList);
begin
  Items.NameValueSeparator := '=';
  Items.Values['Mode'] := 'Test';
end;
```

### Usage

`Values` gets or changes the first name-matched value, adding on nonempty miss and deleting on empty assignment.

- Do not use empty read alone to distinguish missing from empty.
- Assigning empty deletes and can shift indexes or detach/free an associated object according to string list ownership.
- Enforce unique/canonical names separately if dictionary semantics are required.

### Additional Technical Info
`Values` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It is a convenience view over string entries, not a dictionary with unique keys.

#### Source-backed behaviour

The getter calls [`IndexOfName`](../Methods/IndexOfName.md) and returns the substring after `Length(Name) + 1` characters from the first match; no match yields empty. Comparison follows the concrete list's case/locale policy.

The setter also targets the first match. A nonempty value adds an empty entry when absent, then replaces the selected entry with `Name + NameValueSeparator + Value`. An empty value deletes the matched entry and does nothing when absent. Therefore explicit empty values cannot be represented through this setter, and duplicate names beyond the first remain. `TStringList` prohibits the replacement step while sorted, so a missing-name assignment can add an empty entry and then raise, leaving that partial mutation behind.

#### Related members

[`IndexOfName`](../Methods/IndexOfName.md) identifies the selected entry. [`Names`](Names.md) and [`ValueFromIndex`](ValueFromIndex.md) expose indexed parts.

#### Official RTL references

- [Embarcadero: TStrings.Values](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Values)
- [Free Pascal: TStrings.Values](https://www.freepascal.org/docs-html/rtl/classes/tstrings.values.html)

<small>Created 2026-07-15</small>
