---
title: "BreakStringTail"
description: "Splits text around the first exact separator substring and preserves the unsplit input in Tail when no match exists."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - split
  - tail
---

```Delphi
Procedure BreakStringTail(S: string; const aSep: string; var Head, Tail: string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Head, Tail: string;
begin
  BreakStringTail('segment/rest/of/path', '/', Head, Tail);
  Value := Head + ' / ' + Tail; // segment / rest/of/path
end;
```

### Usage

`BreakStringTail` splits text around the first exact separator substring and preserves the unsplit input in Tail when no match exists.

**Parameters**

| Name | Mode | Description |
|---|---|---|
| `S` | input | Source text; not modified. |
| `aSep` | input | Case-sensitive separator substring. Multi-character values are supported. |
| `Head` | output through `var` | Text before the first separator, or empty when no separator exists. |
| `Tail` | output through `var` | Text after the complete separator, or all of `S` when no separator exists. |

The procedure overwrites both output variables and returns no value.

### Additional Technical Info
`BreakStringTail` splits `S` at the first exact occurrence of `aSep`, discarding the separator. Its distinguishing rule is the no-match case: `Head` becomes empty and the complete original input is placed in `Tail`.

The example is fictional and source-reviewed only.

**Exact results**

| Input situation | `Head` | `Tail` |
|---|---|---|
| `'A::B::C'`, separator `'::'` | `'A'` | `'B::C'` |
| `'::A'`, separator `'::'` | `''` | `'A'` |
| `'A::'`, separator `'::'` | `'A'` | `''` |
| `'ABC'`, separator `'::'` | `''` | `'ABC'` |
| `'ABC'`, empty separator | `''` | `'ABC'` |

The implementation uses literal, case-sensitive Delphi `Pos` and `Copy`. It does not interpret a regular expression, delimiter set, quoting or escape sequences, and only the first occurrence is consumed.

Use [`BreakString`](BreakString.md) when the no-match input should be returned through `Head` instead.

<small>Created 2026-07-15</small>
