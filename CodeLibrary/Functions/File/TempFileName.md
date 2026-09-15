---
title: "TempFileName"
description: "Creates and closes a unique zero-byte .TMP file in Velox's shared application-data Temp folder and returns its path."
sidebar_position: 50
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - temporary-file
  - programdata
  - filesystem
---

```Delphi
Function TempFileName : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // This call creates a real empty file; delete it when the owning operation finishes.
  Value := TempFileName;
end;
```

### Usage

`TempFileName` creates and closes a unique zero-byte .TMP file in Velox's shared application-data Temp folder and returns its path.

**Returns**

The created temporary file's path, normally under `C:\ProgramData\Velox\Temp\` unless Velox's common application-data folder has been configured differently.

**Behaviour**

- The filename uses the first three prefix characters `vx_`, a four-hex-digit unique component and `.TMP`.
- The file exists and is zero bytes when the function returns normally.
- The returned file is closed, so later code must open it with the required access/share mode.
- The directory is Velox application data, not the interactive user's `%TEMP%` directory.
- No automatic deletion is scheduled.

**Errors**

Directory/path/allocation failures can propagate. A zero result from `GetTempFileNameW` raises `EvxOSError` with Velox context and the Windows last-error code when available.

**Usage notes**

Use `try..finally` around all later work and delete the file in the cleanup path. Do not store long-lived or sensitive content there without the appropriate retention, ACL and encryption policy.

### Additional Technical Info
`TempFileName` ensures Velox's configured common application-data `Temp\` directory, asks Windows for a unique `vx_` temporary name there, creates and closes that zero-byte `.TMP` file, and returns its full path.

The example documents the callable shape but was not executed by the documentation workflow. Every real call has a file-system side effect.

**Implementation**

`vxFiles.TempFileName` calls `AppDataTempPath`. That reaches `GetAppDataPath('Temp\')` under a Velox critical section and calls `ForceDirectories` when the configured common-data folder is missing. It then calls Win32 `GetTempFileNameW(AppDataTempPath, 'vx_', 0, Buffer)` with a `MAX_PATH` buffer.

Passing `uUnique=0` instructs Windows to search its 16-bit suffix namespace, create the unique empty file and close the handle before returning. If the API returns zero, Velox immediately calls its `RaiseLastOSError` overload, which raises `EvxOSError` containing the captured error code/system message or a generic message when no last error is available.

**Edge cases and quirks**

- This is not a pure “name” function. Repeated calls that are not cleaned up leave empty files behind.
- Windows limits this algorithm to 65,535 unique values for the same directory/prefix and can become slow as the namespace fills.
- The directory path must fit the Win32 `MAX_PATH - 14` restriction used by `GetTempFileNameW`; extended-length path handling is not supplied here.
- Directory creation is attempted under the Velox service/application identity. Permissions, custom data-folder configuration, storage availability and security software can make it fail.
- The returned location can be shared by concurrent Velox processes. Windows creates the selected file during allocation, but later replacement/deletion/access still requires normal security and race handling.
- The function does not set delete-on-close, restrictive per-file ACLs or a lifetime policy.

**Side effects**

Can create the configured `Temp\` directory chain and always creates one empty temporary file on normal return. The caller owns cleanup.

**Performance and concurrency**

Includes directory checks plus Win32 name search and file creation. It is safe against simultaneous selection of the same suffix because the API creates the file, but performance degrades as undeleted `vx_*.TMP` files fill the 16-bit namespace.

**Related entries**

- [`NewGuidFileName`](NewGuidFileName.md) returns text only and creates no file.
- [`DeleteFile`](DeleteFile.md) can remove the temporary file during governed cleanup.
- [`SaveStreamToFile`](SaveStreamToFile.md) and [`SaveBytesToFile`](SaveBytesToFile.md) can populate a chosen path and have separate overwrite/error contracts.

**External references**

- [Microsoft `GetTempFileNameW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-gettempfilenamew) - exact operating-system terminal and its creation, naming, length, namespace and cleanup rules.
- [Free Pascal `GetTempFileName`](https://www.freepascal.org/docs-html/rtl/sysutils/gettempfilename.html) - compatible API/name context only; Velox calls the Win32 wide API directly and adds its configured folder/error handling.

No usable English Embarcadero symbol page was found for the imported Win32 API declaration. The Microsoft terminal documentation and current installed/product source define this entry.

<small>Created 2026-07-15</small>
