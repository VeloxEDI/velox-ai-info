---
title: TStringArray
description: Stores an ordered zero-based sequence of managed Unicode strings for Velox text operations.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, array, string, unicode, text]
---

```Delphi
TStringArray = array of String
```

### Example

```Delphi
procedure BuildColumns(var Columns: TStringArray);
begin
  SetLength(Columns, 3);
  Columns[0] := 'OrderNumber';
  Columns[1] := '';
  Columns[2] := 'Amount';
end;
```

### Usage

`TStringArray` stores an ordered zero-based sequence of managed Unicode strings for Velox text operations.

#### State and indexing

- `SetLength(Values, N)` creates or resizes the sequence. Newly added elements are initialized to the empty string.
- An empty array has no elements. It is different from a one-element array whose only value is `''`.
- `Length(Values)` counts elements. It does not count characters or UTF-16 code units inside those strings.
- `High(Values)` is -1 when empty and otherwise identifies the last valid index.
- Array order and duplicates are preserved unless a called helper explicitly says otherwise.

This distinction matters to delimited data and configuration lists: a blank field can be meaningful, while a missing element may mean that no value was supplied. Define trimming, case comparison, blank retention and delimiter escaping at the calling boundary.

#### Velox helper boundaries

- [`StringsToArray`](../../Functions/Arrays/StringsToArray.md) copies `TStrings` items into a `TStringArray`.
- [`AddStringArrayToStrings`](../../Functions/Arrays/AddStringArrayToStrings.md) appends array values to an existing string list; it does not imply ownership of the list.
- [`Join`](../../Functions/String/Join.md) has an explicit include-blank switch. Choose it from the target format rather than dropping blanks by habit.
- [`SplitString`](../../Functions/String/SplitString.md) and [`RegExExtractAll`](../../Functions/String/RegExExtractAll.md) write through `var` arrays; treat their output contract as a possible replacement of prior content.

Array assignment does not immediately copy all elements. Replacing an element through one variable can be visible through the other. Changing the length can separate the arrays, but a same-length `SetLength` call does not. Copy each element into a separately allocated destination when independent editing is required.

### Additional Technical Info
`TStringArray` is registered by the Velox common-string scripting importer. Every element is the current managed Unicode [`String`](../DataTypes/String.md) type, and array indexes are zero-based.

**Related Code Library entries**

- [String](../DataTypes/String.md) - Unicode element semantics and encoding boundaries.
- [Arrays](../Arrays.md) - shared dynamic-array behavior and safe-copy guidance.

**External references**

- [Embarcadero structured types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_%28Delphi%29) - dynamic-array assignment, bounds and lifetime.
- [Embarcadero System.SetLength](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.SetLength) - resize and initialization contract.
- [Free Pascal dynamic arrays](https://www.freepascal.org/docs-html/ref/refsu14.html) - compatible managed-array model.

<small>Created 2026-07-15</small>
