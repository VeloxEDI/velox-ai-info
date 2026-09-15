---
title: "MakeUniqueFilename"
description: "Returns the original file name when absent or a currently unused GUID-suffixed alternative when it exists."
sidebar_position: 35
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - filename
  - unique
  - guid
---

```Delphi
Function MakeUniqueFilename( const aFilename : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MakeUniqueFilename('C:\Fictional\order.csv');
  // If the original file exists, shape: C:\Fictional\order_<GUID>.csv
  // If it does not exist, the original string is returned unchanged.
end;
```

### Usage

`MakeUniqueFilename` returns the original file name when absent or a currently unused GUID-suffixed alternative when it exists.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilename` | `string`, `const` | Preferred path/name. A relative path uses the Velox process current directory for existence checks. |

**Returns**

The exact original string when it does not currently identify a non-directory file; otherwise `<path><base>_<GUID><extension>` for the first generated candidate that does not currently identify a file.

**Behaviour**

- A currently absent preferred file name is returned exactly, without a GUID.
- A currently existing file receives a 36-character uppercase hexadecimal/hyphen GUID suffix.
- Only the final extension is separated; `archive.tar.gz` becomes `archive.tar_<GUID>.gz`.
- The result is never opened or created by this function.

**Errors**

Most missing/inaccessible existence outcomes are folded into the normal return path by `FileExists`. Conversion, allocation and unexpected GUID/runtime failures can propagate.

**Usage notes**

Use an atomic create/open mode and handle “already exists” when exclusive ownership matters. Do not treat this helper as a security or locking mechanism.

### Additional Technical Info
`MakeUniqueFilename` returns `aFilename` unchanged when [`FileExists`](FileExists.md) is false. When it is true, the function inserts an underscore and a new brace-free GUID before the final extension, repeating only while that generated candidate also exists.

The example uses a fictional path and was not executed by the documentation workflow. The returned candidate is not created or reserved.

**Implementation**

On an existing file, `vxFiles.MakeUniqueFilename` splits the path/name/final extension with the approved Delphi wrappers, removes the final extension from the base, then repeatedly builds `lPath + lFilename + '_' + NewGuidStringNoBraces + lExt` until `FileExists` returns false. GUID generation reaches Delphi `CreateGUID`/`GUIDToString`; Velox does not inspect the returned GUID-generation `HResult`.

**Edge cases and quirks**

- This is a time-of-check result, not atomic allocation. Another thread/process can create the candidate immediately after the final check.
- A directory at `aFilename` is not accepted by the terminal `FileExists`, so the original directory path is returned unchanged even though a file cannot be created at that same path.
- A dotfile such as `.env` has an empty base and becomes `_<GUID>.env` when the original file exists.
- Invalid/overlong names, inaccessible paths and false-negative existence results are not corrected.
- A relative path depends on process-global current-directory state.
- The GUID is not a secret or authorisation token, and the helper does not surface GUID-generation status.

**Side effects**

No persistent change. It performs one or more file-system existence queries and requests GUID values only when the original exists.

**Performance and concurrency**

Normally one metadata query; an existing original adds GUID generation and another query, repeating on collision. Remote storage can block. The lack of atomic reservation is the primary concurrency constraint.

**Related entries**

- [`AppendIdFilename`](AppendIdFilename.md) always adds a GUID without any existence query.
- [`MakeUniqueFilenameNumber`](MakeUniqueFilenameNumber.md) uses sequential numeric suffixes.
- [`FileExists`](FileExists.md) defines the query's file/link/directory behaviour.

**External references**

- [Embarcadero `System.SysUtils.CreateGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.CreateGUID)
- [Embarcadero `System.SysUtils.GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString)
- [Free Pascal `CreateGUID`](https://www.freepascal.org/docs-html/rtl/sysutils/createguid.html) and [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html) - compatibility context; installed Delphi/Windows source defines Velox GUID generation/formatting.

<small>Created 2026-07-15</small>
