---
title: "GUIDToStringNoBraces"
description: "Converts a TGuid to uppercase 36-character hyphenated text without braces."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - string
  - no-braces
  - uppercase
---

```Delphi
Function GUIDToStringNoBraces(const aGuid: TGuid): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Identifier: TGuid;
begin
  Identifier := SafeStringToGuid('{12345678-9abc-def0-1234-56789abcdef0}');
  Value := GUIDToStringNoBraces(Identifier);
  // 12345678-9ABC-DEF0-1234-56789ABCDEF0
end;
```

### Usage

`GUIDToStringNoBraces` converts a TGuid to uppercase 36-character hyphenated text without braces.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aGuid` | `TGuid`, `const` | Binary GUID to render. Any 128-bit value, including all zeroes, can be formatted. |

**Returns**

Exactly 36 characters of uppercase hexadecimal and hyphens, without `{` or `}`.

### Additional Technical Info
`GUIDToStringNoBraces` converts a binary `TGuid` to Delphi's standard uppercase, hyphenated text and removes the generated outer braces. The result is the common 36-character `8-4-4-4-12` form.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The helper calls installed Delphi `GUIDToString`, which emits a 38-character brace-wrapped value, then calls [`NoBraces`](NoBraces.md). Because the intermediate is guaranteed to begin `{` and end `}`, the custom helper safely removes those two known characters on this path.

**Edge cases and quirks**

- Lowercase input history is not preserved; a `TGuid` has no text casing, and Delphi emits uppercase.
- The all-zero value becomes `00000000-0000-0000-0000-000000000000` rather than an empty string.
- No validation is needed once the input is a `TGuid`; every bit pattern has a printable form.
- The result contains no braces but retains four hyphens. It is not the compact 32-character `N` format.
- This function's use of `NoBraces` is safe even though arbitrary-string use of that helper can truncate malformed text.

**Side effects and errors**

Two short string operations/allocations. No state change or expected conversion error for a binary GUID.

**Performance and concurrency**

Constant-size work with no shared mutable state.

**Related entries**

- [`NoBraces`](NoBraces.md) performs the lexical removal step.
- [`EmptyGuidString`](EmptyGuidString.md) shows the brace-wrapped zero form.
- [`NewGuidStringNoBraces`](NewGuidStringNoBraces.md) combines creation and this output shape.
- [`SafeStringToGuid`](SafeStringToGuid.md) parses brace-wrapped or 36-character input.

**External references**

- [Embarcadero `System.SysUtils.GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString)
- [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html)

<small>Created 2026-07-15</small>
