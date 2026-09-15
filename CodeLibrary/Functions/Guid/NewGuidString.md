---
title: "NewGuidString"
description: "Requests a new Windows UUID and returns Delphi's uppercase brace-wrapped string form."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - uuid
  - string
  - braces
  - windows
---

```Delphi
Function NewGuidString: string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := NewGuidString;
  // Shape: {XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}
end;
```

### Usage

`NewGuidString` requests a new Windows UUID and returns Velox's uppercase brace-wrapped string form.

**Returns**

A string shaped as `{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}`, with uppercase hexadecimal, four hyphens and two braces.

**Important usage notes**

- Output shape is deterministic; output value is not.
- The string always contains braces and uppercase hex in Velox.
- A successful string allocation does not prove that Windows reported `RPC_S_OK` because status was discarded earlier.
- The UUID is an identifier, not a secret or authentication credential.
- No collision check is performed against Velox configuration or database contents.
- Do not assume lexical sort order represents creation order.

### Additional Technical Info
`NewGuidString` requests a Windows UUID through [`NewGuid`](NewGuid.md) and formats the resulting record in Delphi's 38-character uppercase brace-wrapped form.

The example shows only the shape because the value is nondeterministic. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The function evaluates `GUIDToString(NewGuid)`. `NewGuid` calls Delphi `CreateGUID` but discards its status; installed Windows Delphi reaches `rpcrt4!UuidCreate`. Installed `GUIDToString` then formats whatever `TGuid` record was returned.

Formatting a record cannot restore the discarded generation status. Even an all-zero or otherwise unexpected record has a valid 38-character text representation.

**Side effects and errors**

Calls Windows UUID services and allocates a string. Velox performs no persistence. Nonzero generation statuses are not raised; delayed runtime/DLL and allocation failures may propagate.

**Performance and concurrency**

One OS call plus constant-size formatting. No Velox shared counter/state.

**Related entries**

- [`NewGuid`](NewGuid.md) documents the ignored status.
- [`NewGuidStringNoBraces`](NewGuidStringNoBraces.md) removes the generated braces.
- [`EmptyGuidString`](EmptyGuidString.md) is the fixed all-zero text sentinel.
- [`SafeStringToGuid`](SafeStringToGuid.md) parses this exact shape.

**External references**

- [Embarcadero `System.SysUtils.CreateGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.CreateGUID)
- [Microsoft `UuidCreate`](https://learn.microsoft.com/en-us/windows/win32/api/rpcdce/nf-rpcdce-uuidcreate)
- [Embarcadero `System.SysUtils.GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString)
- [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html) - compatible output shape.

<small>Created 2026-07-15</small>
