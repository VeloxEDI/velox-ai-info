---
title: "SaveStreamToFile"
description: "Creates or replaces a file from an entire stream, rewinding the source and suppressing post-open failures."
sidebar_position: 43
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - stream
  - destructive
---

```Delphi
Procedure SaveStreamToFile( aStream : TStream; aFileName : string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamUTF8('Fictional payload', Buffer);
    SaveStreamToFile(Buffer, 'C:\Fictional\Outbound\payload.txt');
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`SaveStreamToFile` creates or replaces a file from an entire stream, rewinding the source and suppressing post-open failures.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aStream` | `TStream` | Existing readable, seekable caller-owned source. Its incoming position is discarded and it is normally left at the end. |
| `aFileName` | `string` | Destination path. The parent directory must already exist. |

**Returns**

This procedure has no return value. Normal return does not prove that the complete stream was saved.

**Behaviour**

- Existing destination content is truncated before the source is validated.
- A stable empty stream creates/truncates a zero-byte file.
- On complete success, the destination contains source bytes `0..Size-1` and the source position is normally `Size`.
- The procedure never frees or restores the source stream.

**Errors**

Initial file-construction failures propagate. Every exception inside the copy block is suppressed. The procedure provides no Boolean, count or exception after such a failure.

**Usage notes**

Save and restore the source position yourself if subsequent code depends on it—but restoration cannot reveal a swallowed write failure. Prefer a reporting/verified output path for critical files.

### Additional Technical Info
`SaveStreamToFile` rewinds a caller-owned stream and creates or replaces a file with its complete contents. It accepts `TStream` but requires usable position and size operations. Like [`SaveBytesToFile`](SaveBytesToFile.md), it propagates destination-open errors but suppresses every exception after the file opens.

The example writes fictional in-memory content to a fictional path. It would replace that destination, is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The exact runtime pointer reaches `vxFiles.SaveStreamToFile`. It creates/truncates an exclusive `TFileStream`, assigns `aStream.Position := 0`, obtains `aStream.Size`, then calls Delphi `CopyFrom` for that count. `CopyFrom` uses fixed-count reads/writes and advances both positions.

The file constructor executes before the `try`. Once it succeeds, the broad `except` frees the destination and suppresses nil-source, seek, size, read, allocation and write exceptions.

**Edge cases and quirks**

- A nil, non-seekable, size-less or unreadable stream can leave an empty destination and return normally because failure occurs after truncation and is swallowed.
- A mid-copy source or destination failure can leave a partial file while also returning normally.
- Resetting `Position` and querying `Size` are required despite the general `TStream` declaration. Custom stream implementations may not support those operations reliably.
- Concurrent mutation of the source is not coordinated. The captured size and actual readable bytes can diverge.
- Replacement is direct and non-atomic; there is no temporary path, rollback, checksum or post-write verification.
- On Windows, normal `CREATE_ALWAYS` link following means an existing symbolic-link path causes its target to be truncated; this routine does not open the link object itself.

**Side effects**

Mutates the source position and creates or irreversibly replaces the destination file.

**Performance and concurrency**

Synchronous linear-time copy using Delphi's temporary buffer; it does not allocate a second full copy of an ordinary stream. The destination is exclusive only while its handle is open. Coordinate source mutation and externally verify critical output.

**Related entries**

- [`LoadFileToStream`](LoadFileToStream.md) replaces a memory stream from a file.
- [`SaveBytesToFile`](SaveBytesToFile.md) writes a byte array with the same post-open suppression pattern.
- [`StreamToBytes`](../Conversion/StreamToBytes.md) creates a detached byte array from a memory stream.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create) and [`TStream.WriteBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.WriteBuffer) - the Delphi creation and exact-write contracts used by the copy path.
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html) and [`TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html) - compatible stream-copy context; suppression and source handling follow Velox and installed Delphi source.
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) - the exact Windows create/truncate, share and symbolic-link behaviour below `TFileStream`.

<small>Created 2026-07-15</small>
