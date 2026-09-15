---
title: "EmptyGuidString"
description: "Returns the all-zero GUID in Delphi's uppercase, hyphenated, brace-wrapped string form."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - empty
  - string
  - braces
---

```Delphi
Function EmptyGuidString: string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EmptyGuidString;
  // {00000000-0000-0000-0000-000000000000}
end;
```

### Usage

`EmptyGuidString` returns the all-zero GUID in Velox's uppercase, hyphenated, brace-wrapped string form.

**Returns**

Exactly:

```text
{00000000-0000-0000-0000-000000000000}
```

**Important usage notes**

- This is ordinary nonempty text. It is not `''`, variant null or database `NULL`.
- Case and braces are fixed by the Velox. Consumers that compare strings case-sensitively should normalize external values or compare parsed GUID records.
- The result is suitable as a sentinel only when the surrounding contract deliberately uses a zero GUID.
- [`NoBraces`](NoBraces.md) converts this exact output to 36 zero/hyphen characters.

### Additional Technical Info
`EmptyGuidString` returns the canonical Delphi text representation of the all-zero GUID. The result is always 38 characters, including opening/closing braces and four hyphens.

The example is fictional, deterministic, source-reviewed and was not executed by the documentation workflow.

**Implementation**

The registered function calls [`EmptyGuid`](EmptyGuid.md), then installed Delphi `System.SysUtils.GUIDToString`. Delphi's default `B` format allocates 38 UTF-16 characters, writes braces/hyphens at fixed offsets and emits uppercase hexadecimal pairs.

**Side effects and errors**

Only result-string allocation. The binary GUID is fixed and always valid, so no conversion error is expected.

**Performance and concurrency**

Constant-size record formatting and one 38-character allocation. No mutable state.

**Related entries**

- [`EmptyGuid`](EmptyGuid.md) returns the record value.
- [`GUIDToStringNoBraces`](GUIDToStringNoBraces.md) formats any GUID without braces.
- [`SafeStringToGuid`](SafeStringToGuid.md) parses this form and maps exact empty text to the same value.

**External references**

- [Embarcadero `System.SysUtils.GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString)
- [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html) - documents the compatible brace-wrapped shape.

<small>Created 2026-07-15</small>
