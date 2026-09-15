---
title: NameValueSeparator
description: Specifies the single character separating names from values and defaults to equals.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, namevalueseparator, configuration]
---

```Delphi
property NameValueSeparator: Char read write;
```

### Example

```Delphi
procedure ConfigureAssignments(const Items: TStringList);
begin
  Items.NameValueSeparator := '=';
  Items.Values['Mode'] := 'Test';
end;
```

### Usage

`NameValueSeparator` specifies the single character separating names from values and defaults to equals.

- Set the separator before name/value access and keep it stable for the list's lifetime.
- Choose a non-null character and define escaping at a higher layer if names themselves can contain it.
- Duplicate names remain possible.

### Additional Technical Info
`NameValueSeparator` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). Changing it changes how existing strings are interpreted; it does not rewrite them.

#### Source-backed behaviour

`TStrings.Create` initializes the separator to `=` and the property stores a `Char` directly. [`Names`](Names.md), [`Values`](Values.md), [`ValueFromIndex`](ValueFromIndex.md) and [`IndexOfName`](../Methods/IndexOfName.md) use the first occurrence in each string.

No validation, escaping or whitespace trimming is applied. A value can contain further separator characters because only the first is structural. A null separator has ambiguous PChar/search behaviour and should not be used.

#### Related members

[`Names`](Names.md) and [`Values`](Values.md) interpret entries using this character. [`Strings`](Strings.md) exposes the original text.

#### Official RTL references

- [Embarcadero: TStrings.NameValueSeparator](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.NameValueSeparator)
- [Free Pascal: TStrings.NameValueSeparator](https://www.freepascal.org/docs-html/rtl/classes/tstrings.namevalueseparator.html)

<small>Created 2026-07-15</small>
