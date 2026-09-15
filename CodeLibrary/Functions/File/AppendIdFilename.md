---
title: "AppendIdFilename"
description: "Documents an intended GUID-suffix helper whose current script runtime binding is missing, plus a callable equivalent."
sidebar_position: 1
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
Function AppendIdFilename( const aFilename : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // AppendIdFilename is declared but is not bound in the current script runtime.
  Value := ExtractFilePath('C:\Fictional\order.csv') +
    ChangeFileExt(ExtractFileName('C:\Fictional\order.csv'), '') + '_' +
    NewGuidFileName + ExtractFileExt('C:\Fictional\order.csv');
  // C:\Fictional\order_6F9619FF-8B86-D011-B42D-00C04FC964FF.csv
  // The GUID shown above illustrates the output shape; each call requests a new value.
end;
```

### Usage

Do not call `AppendIdFilename` in a current Velox script: it can compile but fails when the script executable is loaded.

To create the intended `<base>_<GUID><extension>` text, combine `ExtractFilePath`, `ExtractFileName`, `ExtractFileExt`, `ChangeFileExt` and [`NewGuidFileName`](NewGuidFileName.md). The resulting name is not reserved, so the file operation must still handle collisions.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilename` | `string`, `const` | File-name/path text to transform. The path does not need to exist. |

**Returns**

`<path><base>_<36-character GUID><extension>`, using the input's final extension and original path spelling.

**Errors**

Current script use reports `Cannot Import AppendIdFilename` during executable loading because the runtime binding is absent. For Velox product calls, string conversion/allocation and unexpected GUID/runtime failures can propagate; because the Velox GUID function ignores `CreateGUID`'s `HResult`, it supplies no explicit failure result to this function.

**Usage notes**

Do not call this identifier from a current Velox script until its Velox availability is added. Use the available split and change functions plus [`NewGuidFileName`](NewGuidFileName.md), as shown in the example, to reproduce the intended text transformation. Create the actual output with an operation that handles collisions atomically where correctness depends on exclusive ownership.

### Additional Technical Info
`AppendIdFilename` is published to the compiler and Code Library, but the current product omits its runtime pointer registration. A script that references it can compile, then fails while the executable is loaded with `Cannot Import AppendIdFilename`; the function cannot currently be called from a Velox script.

The native implementation, which is used elsewhere inside the product, always inserts `'_'` plus a newly generated brace-free GUID immediately before the final extension parsed from `aFilename`. It returns text only: it does not check whether the original or result exists and does not create or reserve a file.

The example uses registered functions to reproduce that transformation as a current script workaround. It uses a fictional path and illustrative GUID, is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The compile-time import calls `AddDelphiFunction` for `AppendIdFilename`, but `RIRegister_vxFiles_Routines` has no matching `RegisterDelphiFunction(@AppendIdFilename, ...)` runtime entry. PascalScript therefore rejects the unresolved external while loading a compiled script that uses it.

The unreachable script terminal `vxFiles.AppendIdFilename` splits the input with [`ExtractFilePath`](ExtractFilePath.md), [`ExtractFileName`](ExtractFileName.md) and [`ExtractFileExt`](ExtractFileExt.md). When an extension is present it removes that extension with [`ChangeFileExt`](ChangeFileExt.md), then concatenates an underscore, `vxCommon.NewGuidStringNoBraces`, and the saved extension.

The GUID helper calls Delphi `CreateGUID`, formats it with `GUIDToString` as 38 uppercase hexadecimal/hyphen characters inside braces, then removes the braces. The Velox `NewGuid` wrapper does not inspect the `HResult` returned by `CreateGUID`.

**Native implementation behaviour**

- `'order.csv'` becomes `order_<GUID>.csv`.
- `'archive.tar.gz'` becomes `archive.tar_<GUID>.gz`; only the final extension is separated.
- `'order'` becomes `order_<GUID>`.
- The operation always appends a GUID, even when the input name is currently unused.
- The result preserves the original path prefix and extension case.

**Edge cases and quirks**

- `'.env'` is treated as an extension with an empty base and becomes `_<GUID>.env`.
- An empty input becomes `_<GUID>`.
- A path ending in a delimiter has an empty file-name part and produces a GUID component such as `C:\Folder\_<GUID>`.
- No path canonicalisation, filename sanitisation, length check or existence check is performed.
- GUID generation is designed for practical uniqueness, but this helper does not atomically reserve the name. Another actor can still create the same path before it is used.
- The GUID is an identifier, not a secret, access token or proof of authenticity. The wrapper also ignores the terminal GUID-generation status code.

**Side effects**

A script fails during executable loading before the function body or its GUID request runs. The native product function has no file-system side effect but requests a new GUID from the operating system when called internally.

**Performance and concurrency**

No implementation work occurs for a failed script import. In native product use, path scans and concatenation are linear in input length. GUID generation is process/OS-safe for ordinary concurrent use, but the returned path is not reserved and has a time-of-use race.

**Related entries**

- [`MakeUniqueFilename`](MakeUniqueFilename.md) appends a GUID only after the original is found.
- [`NewGuidFileName`](NewGuidFileName.md) returns only a brace-free GUID component.
- [`MakeSafeFilename`](MakeSafeFilename.md) performs a separate lossy filename transformation.

**External references**

- [Embarcadero `System.SysUtils.CreateGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.CreateGUID)
- [Embarcadero `System.SysUtils.GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString)
- [Free Pascal `CreateGUID`](https://www.freepascal.org/docs-html/rtl/sysutils/createguid.html) and [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html) - compatible API context; current Delphi/Windows source defines Velox generation and uppercase formatting.

<small>Created 2026-07-15</small>
