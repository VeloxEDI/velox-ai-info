---
title: "PadR"
description: "Appends ASCII spaces until a string reaches a requested minimum code-unit length, without truncating longer input."
sidebar_position: 32
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - padding
  - right
  - spaces
---

```Delphi
function PadR(S: String; I: LongInt): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := '[' + PadR('AB', 5) + ']'; // [AB   ]
end;
```

### Usage

`PadR` appends ASCII spaces until a string reaches a requested minimum code-unit length, without truncating longer input.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `String` | Text to copy and possibly pad. |
| `I` | `LongInt` | Minimum result length. |
| Result | `String` | `S + StringOfChar(' ', I - Length(S))`. |

When `I <= Length(S)`, the padding count is non-positive and the input is returned unchanged. Empty input with a positive target returns only spaces.

It does not calculate display width, so the result may not visually occupy `I` columns for tabs, combining marks or wide characters.

Do not confuse this standard helper with the later [`RightPad`](RightPad.md) Velox function: that function prepends a caller-selected character despite its name. `PadR` has conventional direction but a fixed space.

Validate and bound an externally supplied target to avoid unnecessary large allocations.

### Additional Technical Info
`PadR` right-pads a string with ordinary ASCII spaces until its length is at least `I`. Existing text remains at the left. The function does not trim or truncate.

The example is fictional and source-reviewed only.

**External references**

- [Embarcadero DocWiki: `System.StringOfChar`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StringOfChar)
- [Free Pascal: `System.StringOfChar`](https://www.freepascal.org/docs-html/rtl/system/stringofchar.html)

<small>Created 2026-07-15</small>
