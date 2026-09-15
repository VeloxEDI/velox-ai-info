---
title: "NoBraces"
description: "Removes the first and last character whenever a string begins with an opening brace, without validating a GUID or closing brace."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - braces
  - string
  - truncation
---

```Delphi
Function NoBraces(const aGuid: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := NoBraces('{12345678-9ABC-DEF0-1234-56789ABCDEF0}');
  // 12345678-9ABC-DEF0-1234-56789ABCDEF0
end;
```

### Usage

`NoBraces` removes the first and last character whenever a string begins with an opening brace, without validating a GUID or closing brace.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aGuid` | `string`, `const` | Any string. The name suggests a GUID, but Velox accepts arbitrary text. |

**Returns**

- Input unchanged when it is empty or does not begin with `{`.
- `Copy(aGuid, 2, Length(aGuid) - 2)` when it begins with `{`.

**Usage notes**

Use this helper only when the input is already known to be Velox's brace-wrapped GUID form. To validate and parse external input, use [`SafeStringToGuid`](SafeStringToGuid.md), noting that it still raises on malformed text.

### Additional Technical Info
`NoBraces` is a small lexical helper. If the first character is `{`, it removes the first and last character. Otherwise it returns the input unchanged. It does not parse or validate a GUID and does not verify that the last character is `}`.

The example is fictional, deterministic, source-reviewed and was not executed by the documentation workflow.

**Implementation**

The direct runtime pointer reaches `vxCommon.NoBraces`. Its only condition is `(Length(aGuid) = 0) or (aGuid[1] <> '{')`. The true removal branch relies on Delphi's 1-based `Copy` semantics.

**Edge cases and quirks**

- A normal `{...}` GUID loses both braces as intended.
- `{abc` becomes `ab`: the opening brace and final `c` are removed even though no closing brace exists.
- `{x` and `{` produce an empty string because the requested copy count is zero or negative.
- A string ending `}` but not starting `{` is returned unchanged.
- Leading whitespace prevents removal because position 1 is not `{`.
- Parentheses, square brackets and lowercase/uppercase characters receive no special treatment.
- The helper never reports malformed structure, so a normal return does not prove that the input was a GUID.

**Side effects and errors**

No side effects. Empty and short strings are handled by the condition/Delphi `Copy`; normal allocation failures are the only expected failure class.

**Performance and concurrency**

One first-character check and, on removal, one substring allocation proportional to input length. No shared state.

**Related entries**

- [`GUIDToStringNoBraces`](GUIDToStringNoBraces.md) invokes this helper on a guaranteed Delphi-generated string.
- [`NewGuidStringNoBraces`](NewGuidStringNoBraces.md) uses it through the same safe generated path.
- [`SafeStringToGuid`](SafeStringToGuid.md) performs actual GUID parsing after limited normalization.

**External references**

`NoBraces` is custom Velox string logic. The official GUID references show the validated shape that makes its intended use safe:

- [Embarcadero `System.SysUtils.GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString)
- [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html)

<small>Created 2026-07-15</small>
