---
title: "vxCopyFile"
description: "Copies a file through Windows CopyFileEx with overwrite enabled and returns the operating-system Boolean result."
sidebar_position: 51
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - copy
  - windows
---

```Delphi
Function vxCopyFile( aSourceFile, aDestFile : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Can overwrite the destination; both paths are fictional.
  Value := vxCopyFile('C:\Fictional\Inbound\order.xml',
    'C:\Fictional\Archive\order.xml');
end;
```

### Usage

`vxCopyFile` copies a file through Windows CopyFileEx with overwrite enabled and returns the operating-system Boolean result.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aSourceFile` | `string` | Existing source file path. |
| `aDestFile` | `string` | Destination file path. Parent directories are not created. |

**Returns**

`True` when `CopyFileExW` succeeds; `False` when it fails. Velox does not expose `GetLastError` or raise for the normal false result.

**Behaviour**

- Copies file data and Windows-supported metadata to a new destination.
- Replaces an ordinary existing destination when permissions/attributes permit.
- Preserves extended attributes, alternate data streams, file attributes and current Windows security resource properties as defined by `CopyFileExW`.
- Runs synchronously and returns only after the API call completes or fails.

**Errors**

Ordinary operating-system failures return `False`; no Velox exception or error code is supplied. Unexpected interop/runtime failures can propagate.

**Usage notes**

Create the destination parent first, check the Boolean, and verify/clean up destination state on failure. Use unique/staged paths and an explicit replacement policy for important deliveries.

### Additional Technical Info
`vxCopyFile` calls Windows `CopyFileExW` to copy one existing file to a destination. It supplies no progress callback, no callback data, a cancellation flag that remains false, and copy flags `0`, so an ordinary existing destination may be overwritten.

The example is fictional, source-reviewed and was not executed by the documentation workflow. A real call creates or replaces destination data.

**Implementation**

The exact call is equivalent to `CopyFileExW(Source, Destination, nil, nil, @CancelFalse, 0)`. Because `COPY_FILE_FAIL_IF_EXISTS` is absent, replacement is enabled. Because the cancellation Boolean is local and never changed, script code cannot cancel the operation.

**Edge cases and quirks**

- An existing hidden or read-only destination causes Windows access-denied failure rather than normal overwrite.
- No `COPY_FILE_COPY_SYMLINK` flag is supplied. Symbolic-link handling therefore follows the API's default target behavior, not a request to reproduce the link itself.
- Encrypted-source copying can fail when destination encryption cannot be established; Velox does not opt into decrypted destination fallback.
- The wrapper supplies no restartable, unbuffered, compressed-traffic or fail-if-exists option.
- A false result gives no reason and does not itself prove that the destination is absent or unchanged; inspect/clean up according to the operation's policy.
- Relative paths use the process current directory. Long-path and network behavior follow the current Windows process/storage configuration.

**Side effects**

Creates or overwrites the destination. The source remains.

**Performance and concurrency**

Copies all file content synchronously and can block for large or remote files. No progress/cancellation surface is exposed. Concurrent changes can yield a source snapshot or destination outcome governed only by Windows sharing/filesystem semantics.

**Related entries**

- [`vxMoveFile`](vxMoveFile.md) exposes Windows move flags and may copy/delete across volumes.
- [`CheckFolder`](CheckFolder.md) can create a destination path's parent chain.
- [`FileExists`](FileExists.md) is only a non-atomic preflight snapshot.

**External references**

- [Microsoft `CopyFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-copyfileexw) - exact terminal, flags, metadata, link, encryption and failure behavior.

No applicable same-symbol Delphi or Free Pascal core routine is called; Velox invokes the Windows API directly.

<small>Created 2026-07-15</small>
