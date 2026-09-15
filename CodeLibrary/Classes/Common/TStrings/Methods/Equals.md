---
title: Equals
description: Reports whether another TStrings has the same count and exactly equal strings in the same order.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, equals, comparison, ordered]
---

```Delphi
function Equals(Strings: TStrings): Boolean;
```

### Example

```Delphi
procedure CompareLists(const Left, Right: TStringList; var Same: Boolean);
begin
  Same := Left.Equals(Right);
end;
```

### Usage

`Equals` reports whether another TStrings has the same count and exactly equal strings in the same order.

- Test the other reference for nil before calling.
- Use this only for ordered textual equality. It does not compare sets, sort order equivalence or object associations.
- Concurrent mutation can invalidate indexes or produce a mixed observation.

### Additional Technical Info
`Equals` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). This reintroduced method compares list text only; it is not general TObject identity and it ignores list configuration.

#### Source-backed behaviour

The installed implementation first compares both counts, then uses Delphi's direct case-sensitive `<>` string comparison at each zero-based index. It returns false at the first difference and true only after all items match.

Associated [`Objects`](../Properties/Objects.md), capacity, sort flags, case-sensitivity settings, delimiter/quote settings, encoding and event handlers are ignored. The comparison remains case-sensitive even when a `TStringList` is configured for case-insensitive lookup. Passing nil dereferences the parameter and can raise an access violation.

#### Related members

[`IndexOf`](IndexOf.md) uses the descendant's comparison policy instead. [`Count`](../Properties/Count.md) and [`Strings`](../Properties/Strings.md) are the only content considered here.

#### Official RTL references

- [Embarcadero: TStrings.Equals](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Equals)
- [Free Pascal: TStrings.Equals](https://www.freepascal.org/docs-html/rtl/classes/tstrings.equals.html)

<small>Created 2026-07-15</small>
