---
title: "SaveBytesToFile"
description: "Creates or replaces a file with a byte array, but suppresses failures after the file opens."
sidebar_position: 42
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - bytes
  - binary
  - destructive
---

```Delphi
Procedure SaveBytesToFile( aBytes : TBytes; aFileName : string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Data: TBytes;
begin
  Data := Base64DecodeBytes('RklDVElPTkFM');  // FICTIONAL
  SaveBytesToFile(Data, 'C:\Fictional\Outbound\payload.bin');
end;
```

### Usage

`SaveBytesToFile` creates or replaces a file with a byte array, but suppresses failures after the file opens.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aBytes` | `TBytes` | Bytes to write. Velox does not modify the managed array. |
| `aFileName` | `string` | Destination path. A relative path uses the Velox process current directory. |

**Returns**

This procedure has no return value. Normal return does not prove that all bytes were written.

**Behaviour**

- Existing content is destroyed as soon as the destination opens successfully.
- A nil/empty array creates or truncates a zero-byte file.
- No BOM, length prefix, encoding or other transformation is added.
- The file handle is closed before the procedure returns from either the success or suppressed-exception path.

**Errors**

Destination-construction exceptions propagate. All later exceptions are swallowed. Consequently, wraparound exception handling alone cannot distinguish complete success from a failed write; verify the resulting file independently when correctness matters.

**Usage notes**

Do not use normal return as a delivery acknowledgement. For critical output, write to a temporary path with a mechanism that reports errors, verify length/content, then atomically promote where the storage supports it.

### Additional Technical Info
`SaveBytesToFile` creates or replaces a file with the supplied byte array. It preserves the bytes exactly, but its current error handling is unusual: failure to create/open the destination raises, while every exception after the file opens is suppressed. The procedure has no result that confirms how many bytes reached storage.

The example targets a fictional path and would replace that file. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The script import binds directly to `vxFiles.SaveBytesToFile`. It constructs `TFileStream` with `fmCreate or fmOpenWrite or fmShareExclusive`; `fmCreate` creates or immediately truncates the destination and the compatibility share value is exclusive. For a non-nil array it calls Delphi `WriteBuffer` with the array length, which normally requires an exact write.

The constructor is before the `try` block, so its exceptions propagate. The subsequent `try..except` frees the file and consumes every exception without re-raising or reporting it.

**Edge cases and quirks**

- A full disk, lost storage connection or short write after creation can leave a partial or empty file and still return normally because `WriteBuffer`'s exception is caught.
- Missing parent directories, invalid paths, access denial and an initial sharing conflict normally raise because they occur in the constructor before exception suppression begins.
- Replacement is not atomic: readers can observe the old file before open and the new/partial file after close; there is no temporary-file rename, backup or rollback.
- On Windows, the underlying `CREATE_ALWAYS` open does not request `FILE_FLAG_OPEN_REPARSE_POINT`. If the path is a symbolic link, the link target is opened and truncated rather than the link object.
- No path containment, expected length, checksum, destination type or post-write size check is performed.

**Side effects**

Creates or irreversibly replaces file content. Velox supplies no explicit security descriptor: a new Windows file receives its default inherited security, while an existing file keeps the security of the object that `CREATE_ALWAYS` opens.

**Performance and concurrency**

The call is synchronous and writes from the existing array without another full Velox copy. The destination is held exclusively while open, but there is no coordination before open or after close and no durability guarantee beyond normal handle closure.

**Related entries**

- [`LoadFileToBytes`](LoadFileToBytes.md) reads a file into a byte array.
- [`SaveStreamToFile`](SaveStreamToFile.md) writes an entire stream and has similar exception suppression.
- [`Base64DecodeFile`](../EncryptionHashEncode/Base64DecodeFile.md) decodes Base64 directly to a file through this writer path.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create) and [`TStream.WriteBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.WriteBuffer) - the exact Delphi create/truncate and fixed-write APIs reached by Velox.
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html) and [`TStream.WriteBuffer`](https://www.freepascal.org/docs-html/rtl/classes/tstream.writebuffer.html) - compatible stream context; Velox's exception suppression is product-specific.
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) - the Windows `CREATE_ALWAYS`, exclusive-share, security and symbolic-link terminal beneath Delphi `FileCreate`.

<small>Created 2026-07-15</small>
