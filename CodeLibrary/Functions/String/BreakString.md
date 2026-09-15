---
title: "BreakString"
description: "Splits text around the first exact separator substring and returns the unsplit input as Head when no match exists."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - split
  - separator
---

```Delphi
Procedure BreakString(S: string; const aSep: string; var Head, Tail: string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Head, Tail: string;
begin
  BreakString('customer:1007', ':', Head, Tail);
  Value := Head + ' / ' + Tail; // customer / 1007
end;
```

### Usage

`BreakString` splits text around the first exact separator substring and returns the unsplit input as Head when no match exists.

**Parameters**

| Name | Mode | Description |
|---|---|---|
| `S` | input | Source text. It is passed by value and is not modified. |
| `aSep` | input | Case-sensitive separator substring. It may contain multiple characters. |
| `Head` | output through `var` | Text before the first match, or all of `S` when no match exists. |
| `Tail` | output through `var` | Text after the first match, or an empty string when no match exists. |

The procedure returns no value and overwrites both output variables on every call.

### Additional Technical Info
`BreakString` splits `S` at the first exact occurrence of `aSep`. The separator itself is discarded. Text before it is written to `Head`, and text after the complete separator is written to `Tail`.

The example is fictional and source-reviewed only.

**Exact results**

| Input situation | `Head` | `Tail` |
|---|---|---|
| `'A=B=C'`, separator `'='` | `'A'` | `'B=C'` |
| `'=A'`, separator `'='` | `''` | `'A'` |
| `'A='`, separator `'='` | `'A'` | `''` |
| `'ABC'`, separator `'='` | `'ABC'` | `''` |
| `'ABC'`, empty separator | `'ABC'` | `''` |

The implementation uses Delphi `Pos`, `Copy` and `Length`. Matching is literal, case-sensitive and not aware of quoting, escaping, regular expressions or token boundaries. Only the first match is used; subsequent separators stay in `Tail`.

Use [`BreakStringTail`](BreakStringTail.md) when a missing separator should leave the original text in `Tail` instead. Use [`BreakStringLast`](BreakStringLast.md) only for a single-character delimiter when the last occurrence is required.

<small>Created 2026-07-15</small>
