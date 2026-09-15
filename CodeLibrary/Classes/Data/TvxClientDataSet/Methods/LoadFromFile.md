---
title: LoadFromFile
description: Replaces a Velox client dataset from a MIDAS packet file opened under the Velox process identity.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, client-dataset, packet, file, load]
---

```Delphi
procedure LoadFromFile(const FileName: string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // The path is fictional. This replaces DATA1's current in-memory packet.
  DATA1.LoadFromFile('C:\VeloxData\FictionalInput.cds');
  Value := DATA1.RecordCount;
end;
```

### Usage

`LoadFromFile` replaces a Velox client dataset from a MIDAS packet file opened in Velox process identity.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string` | Packet file to open. On Windows the value is passed directly to `TFileStream`; a relative path is therefore relative to the Velox process's current directory. No environment expansion, directory creation, path allow-list or packet trust check is applied. |

**Errors and recovery**

Pending-edit validation, dataset close/open events, missing files, permissions, sharing conflicts, allocation, short/corrupt packets and MIDAS parsing can raise. File-open failure occurs after the original dataset has been closed; the preserved old packet may still allow an explicit `Open`, but the method does not automatically recover it after an exception.

The private file stream is always freed. There is no transaction or rollback covering the dataset replacement.

### Additional Technical Info
`LoadFromFile` closes the dataset and replaces it with a MIDAS client-dataset packet read from a file. The packet can be binary, XML or UTF-8 XML; the loader derives the representation from the packet rather than from the filename extension.

The example is destructive, uses a fictional path and was source-reviewed without being run. Use it only when the selected file is a trusted packet and replacing the current in-memory dataset is intended.

**Signature**

The native Delphi method has an optional filename, but the Velox script registration does not. Scripts must always pass `FileName`; they cannot request the component's native FileName-property fallback.

**Implementation**

The inherited `TCustomClientDataSet.LoadFromFile` terminal performs this sequence:

1. Closes the current dataset.
2. Opens `FileName` through `TFileStream` using `fmOpenRead or fmShareDenyWrite`.
3. Marks the dataset as opening a file and calls `LoadFromStream`.
4. Clears that marker and frees its private file stream in `finally` blocks.

`LoadFromStream` closes again, reads from the file stream's initial position to its size into one in-memory packet and opens that packet. The read share mode permits other readers but denies writers for the duration of this call, giving the loader a stable file through normal cooperative Windows sharing.

**Replacement and lifecycle effects**

Closing can post or validate a pending edit and serialise the old standalone packet for possible reopening. A successful load destroys and recreates dataset fields/cursors from the new packet, so retained field objects, bookmarks, record positions and current-row assumptions are invalid afterward. Close/open and field lifecycle events can run.

The packet is a client-dataset transport representation, not CSV, arbitrary XML or another flat-file format. It carries the schema and records required to reconstruct the in-memory dataset and can carry packet state defined by the MIDAS codec.

**Edge cases and quirks**

- A zero-byte file causes the delegated stream reader to read no new packet. If closing preserved the old packet, the method can reopen the old data instead of producing an empty dataset or reporting an empty-file error.
- A nonempty invalid or short packet replaces the saved copy before opening is attempted. Packet parsing can then fail with the dataset inactive.
- The complete remaining file is copied into one Integer-sized safe-array packet before parsing. Very large files are unsupported by that narrowing and can require substantially more memory than the file size while the packet is opened.
- No extension check is made on load. `.cds`, `.xml` and other names are only naming conventions; content determines whether the packet is valid.
- The method reads any path accessible to the Velox process account. Treat a script-controlled filename as a filesystem-security boundary.

**Performance and concurrency**

Time is linear in packet size. Loading first holds the whole file packet in memory and the opened dataset then allocates its own internal structures. Do not navigate or mutate the shared dataset concurrently. The temporary deny-write share lock ends when the call returns.

**Related entries**

- [`LoadFromStream`](LoadFromStream.md) is the delegated packet reader and explains stream-position and empty-source behaviour.
- [`SaveToFile`](SaveToFile.md) creates a compatible packet file.

**External references**

- [Embarcadero DocWiki: `TCustomClientDataSet.LoadFromFile`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TCustomClientDataSet.LoadFromFile) - the inherited dataset method registered by Velox.
- [Embarcadero DocWiki: `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create) - the exact file-open and sharing terminal.
- [Free Pascal: `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html) - compatible file-mode and deny-write reference; it does not define the Delphi MIDAS packet format.

<small>Created 2026-07-15</small>
