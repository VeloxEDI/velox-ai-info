---
title: "RemoveLeadingZero"
description: "Removes leading ASCII zero characters while deliberately retaining at least the source's final character."
sidebar_position: 45
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - zero
  - normalise
---

```Delphi
Function RemoveLeadingZero( S : String) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := RemoveLeadingZero('000120'); // 120
end;
```

### Usage

`RemoveLeadingZero` removes leading ASCII zero characters while deliberately retaining at least the source's final character.

**Parameters and return value**

`S` is passed by value. The result is a copy with the qualifying leading zero run deleted.

| Input | Result | Reason |
|---|---|---|
| `''` | `''` | No characters. |
| `'0'` | `'0'` | The sole/final character is retained. |
| `'0000'` | `'0'` | All leading positions except the final one are deleted. |
| `'000A'` | `'A'` | Leading zeroes are textual; a numeric suffix is not required. |
| `' 001'` | `' 001'` | The first character is not `'0'`; no trim is performed. |
| `'-001'` | `'-001'` | A sign at position one stops removal. |

**Important behavior and quirks**

- This is textual cleanup, not numeric parsing or formatting.
- Only ASCII zero U+0030 is recognised.
- Whitespace, plus/minus signs, decimal separators and other prefixes prevent any removal.
- The source argument is not declared `const`, but it is still passed by value and the caller's variable is not mutated.

### Additional Technical Info
`RemoveLeadingZero` deletes consecutive ASCII `'0'` characters from the start of a string, but never examines or removes the last character. This ensures an all-zero non-empty input retains one zero.

The example is fictional and source-reviewed only.

**How it works**

Velox scans from index 1 only while `i <= Length(Result) - 1` and the current character is `'0'`. It then deletes positions `1..i-1` in one operation.

**Performance and concurrency**

The prefix is scanned once and removed once. No shared state is read.

<small>Created 2026-07-15</small>
