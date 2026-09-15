---
title: "NewGuidStringNoBraces"
description: "Requests a new Windows UUID and returns uppercase 36-character hyphenated text."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - uuid
  - string
  - no-braces
  - windows
---

```Delphi
Function NewGuidStringNoBraces: string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := NewGuidStringNoBraces;
  // Shape: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
end;
```

### Usage

`NewGuidStringNoBraces` requests a new Windows UUID and returns uppercase 36-character hyphenated text.

**Returns**

`XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`, with uppercase hex and four hyphens.

**Important usage notes**

- No braces are returned, but hyphens remain; this is not a compact 32-character encoding.
- Casing is uppercase under Velox.
- UUID-generation status is lost before formatting, exactly as for `NewGuid` and `NewGuidString`.
- The output is not validated as nonzero and is not checked against stored identifiers.
- Treat it as an identifier, not a secret, token or creation-time-ordered key.

### Additional Technical Info
`NewGuidStringNoBraces` requests a Windows UUID, formats it through Delphi's standard brace-wrapped representation, then removes the two generated braces. The final form is 36 uppercase hexadecimal/hyphen characters.

The example shows only the nondeterministic result shape. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The exact chain is:

```text
NewGuidStringNoBraces
  -> NewGuidString
  -> GUIDToString(NewGuid)
  -> CreateGUID / Windows UuidCreate (status ignored)
  -> NoBraces(generated 38-character string)
```

[`NoBraces`](NoBraces.md) has unsafe behavior on arbitrary unbalanced strings, but this call path supplies a guaranteed `{...}` result from Delphi `GUIDToString`, so its first/last-character removal is well-defined.

**Side effects and errors**

One Windows UUID request and short string allocations. No persistent write. Generation status is ignored; DLL/runtime/allocation failures may still propagate.

**Performance and concurrency**

Constant-size OS generation and formatting work with no Velox shared counter.

**Related entries**

- [`NewGuid`](NewGuid.md) documents creation/status behavior.
- [`NewGuidString`](NewGuidString.md) retains braces.
- [`GUIDToStringNoBraces`](GUIDToStringNoBraces.md) converts an existing record to this shape.
- [`SafeStringToGuid`](SafeStringToGuid.md) accepts this 36-character form by adding braces.

**External references**

- [Microsoft `UuidCreate`](https://learn.microsoft.com/en-us/windows/win32/api/rpcdce/nf-rpcdce-uuidcreate)
- [Embarcadero `System.SysUtils.CreateGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.CreateGUID)
- [Embarcadero `System.SysUtils.GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString)
- [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html)

<small>Created 2026-07-15</small>
