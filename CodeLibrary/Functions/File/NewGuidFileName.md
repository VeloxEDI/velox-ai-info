---
title: "NewGuidFileName"
description: "Returns a new 36-character brace-free GUID string suitable as a file-name component."
sidebar_position: 38
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - filename
  - guid
---

```Delphi
Function NewGuidFileName : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := NewGuidFileName;
  // Shape: 6F9619FF-8B86-D011-B42D-00C04FC964FF
end;
```

### Usage

`NewGuidFileName` returns a new 36-character brace-free GUID string suitable as a file-name component.

**Returns**

Normally a 36-character string containing 32 uppercase hexadecimal digits and four hyphens in `8-4-4-4-12` grouping.

**Behaviour**

- Each normal call requests a new operating-system GUID.
- The result contains no braces, underscore, extension or path.
- No existence test or file creation occurs.
- Text casing and hyphen positions are fixed by current Velox formatting.

**Errors**

No routine success/failure value is exposed. Conversion/allocation or unexpected runtime failures can propagate; Velox `HResult` is not checked by Velox.

**Usage notes**

Append an extension/path explicitly and create the actual file atomically when exclusive ownership matters. Do not use the value as a security token.

### Additional Technical Info
`NewGuidFileName` requests a new GUID and returns its conventional uppercase hyphenated text without the surrounding braces. Despite the name, it creates no file and returns no directory or extension.

The example uses an illustrative GUID shape. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

`vxFiles.NewGuidFileName` calls `vxCommon.NewGuidString`, which calls `NewGuid`, then installed Delphi `GUIDToString`. It removes the first and last characters with `Copy`, converting the normal `{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}` result to brace-free form. Installed Delphi formatting uses uppercase hexadecimal.

`vxCommon.NewGuid` calls `CreateGUID(Result)` but ignores the returned `HResult`, so this public function has no explicit GUID-generation failure result or check.

**Edge cases and quirks**

- “FileName” means the text is normally legal as one Windows name component; it is not a reserved path or allocated file.
- Practical GUID collision probability is extremely low, but the helper does not reserve a path and cannot prevent a time-of-use collision.
- The ignored `CreateGUID` status means a rare terminal failure is not translated into an explicit error by the Velox wrapper.
- GUIDs are observable identifiers, not confidential random tokens, passwords, signatures or authorisation proof.

**Side effects**

No file-system change. A GUID request is made to the operating system.

**Performance and concurrency**

Constant-size GUID generation and a fixed 36-character result. Safe for ordinary concurrent calls, but no returned path is reserved.

**Related entries**

- [`AppendIdFilename`](AppendIdFilename.md) inserts the same brace-free GUID style before an extension.
- [`MakeUniqueFilename`](MakeUniqueFilename.md) returns a GUID-suffixed candidate only when the preferred file exists.
- [`TempFileName`](TempFileName.md) actually creates an empty temporary file and returns its path.

**External references**

- [Embarcadero `System.SysUtils.CreateGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.CreateGUID)
- [Embarcadero `System.SysUtils.GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString)
- [Free Pascal `CreateGUID`](https://www.freepascal.org/docs-html/rtl/sysutils/createguid.html) and [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html) - compatible API context; installed Delphi source defines Velox's exact formatting.

<small>Created 2026-07-15</small>
