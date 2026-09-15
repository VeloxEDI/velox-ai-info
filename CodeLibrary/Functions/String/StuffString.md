---
title: "StuffString"
description: "Returns a copy with a one-based character range replaced by new text."
sidebar_position: 66
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - replace
  - insert
---

```Delphi
Function StuffString( const AText : string; AStart, ALength : Cardinal; const ASubText : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StuffString('ABCDE', 2, 2, 'xy'); // AxyDE
end;
```

### Usage

`StuffString` returns a copy with a one-based character range replaced by new text.

**Parameters and result**

| Item | Description |
|---|---|
| `AText` | Source text. It is not modified. |
| `AStart` | One-based position at which replacement begins. Use a value from `1` through `Length(AText) + 1`. |
| `ALength` | Number of characters to remove before inserting `ASubText`. Zero performs an insertion. |
| `ASubText` | Text to insert at `AStart`; it can be empty. |
| Result | Newly assembled string. |

**Boundary behavior**

- `AStart = 1` replaces or inserts at the beginning.
- `AStart = Length(AText) + 1` appends `ASubText`; `ALength` cannot remove anything because the start is already beyond the last source character.
- `ALength = 0` inserts without removing any source character.
- If the requested range extends beyond the end, the remaining source suffix is removed and no error is raised by the `Copy` calls.
- Empty `ASubText` deletes the selected range.

**Important behavior and quirks**

The Velox is equivalent to concatenating:

```Delphi
Copy(AText, 1, AStart - 1) + ASubText +
 Copy(AText, AStart + ALength, MaxInt)
```

`AStart` and `ALength` are unsigned `Cardinal` values and Velox does not validate them. Do not pass zero, an out-of-range start, or values whose addition can overflow: the resulting unsigned arithmetic and `Copy` arguments are not a supported editing contract.

Positions and lengths are Velox string elements rather than user-perceived Unicode grapheme clusters. A position can therefore split a surrogate pair or combining sequence.

### Additional Technical Info
`StuffString` returns a new string formed from the part of `AText` before `AStart`, followed by `ASubText`, followed by the part after the replaced range. `AStart` is one-based and `ALength` is the number of characters to replace.

The example is fictional and source-reviewed only.

**Performance and concurrency**

The two retained portions and the replacement text are copied into a new result. The function uses no shared state.

**External references**

- [Embarcadero DocWiki: `System.StrUtils.StuffString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.StrUtils.StuffString)
- [Free Pascal: `StuffString`](https://www.freepascal.org/docs-html/rtl/strutils/stuffstring.html) - compatibility context; Velox executes the installed Delphi implementation.

<small>Created 2026-07-15</small>
