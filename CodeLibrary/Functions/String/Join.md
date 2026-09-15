---
title: "Join"
description: "Concatenates a string array with a delimiter and optional blank inclusion, with a current leading-delimiter defect after initial skipped blanks."
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - array
  - join
  - implementation-defect
---

```Delphi
function Join(const Values: TStringArray; const aDelimiter: string;
  aIncludeBlank: boolean): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Join(['Red', 'Green', 'Blue'], ', ', False); // Red, Green, Blue
end;
```

### Usage

`Join` concatenates a string array with a delimiter and optional blank inclusion, with a current leading-delimiter defect after initial skipped blanks.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `Values` | `TStringArray` | Values to copy in their existing zero-based order. |
| `aDelimiter` | `string` | Exact text placed between participating positions. Empty text concatenates directly. |
| `aIncludeBlank` | `Boolean` | Include empty-string entries when true; skip them when false. Whitespace-only values are never considered blank. |
| Result | `string` | Joined text. Empty array returns empty. |

### Additional Technical Info
`Join` concatenates `Values` in array order and writes `aDelimiter` between entries. When `aIncludeBlank` is `True`, empty entries participate and preserve their delimiter positions. When it is `False`, empty entries are skipped—but a current implementation defect affects arrays that begin with one or more empty entries.

The example is fictional and source-reviewed only.

**Normal blank behavior**

With `aIncludeBlank=True`, `Join(['A', '', 'B'], ', ', True)` produces `'A, , B'`. With `False`, the same array produces `'A, B'`. Blank values at the end are similarly included or skipped.

**Current leading-delimiter defect**

The native two-pass implementation decides whether to allocate/copy a delimiter using the original array index (`i > 0`) instead of whether a previous value was actually included. If one or more initial entries are blank and excluded, the first nonblank value still receives one leading delimiter:

```Delphi
// Current result is ', A, B', not 'A, B'.
Value := Join(['', 'A', 'B'], ', ', False);
```

Any number of skipped initial blanks produces one leading delimiter before the first later value. If every entry is blank and blanks are excluded, the result is empty. Avoid the defect by removing leading empty elements before calling, including blanks intentionally, or using explicit accumulation that tracks whether a value has already been emitted.

**Implementation and limits**

Velox first calculates a result length, allocates once, then copies delimiters and values with `Move`. This is efficient for valid sizes, but it performs no overflow/business-size guard. It does not quote or escape delimiter text within values and is not a CSV serializer. Large untrusted arrays or strings should be bounded before joining.

<small>Created 2026-07-15</small>
