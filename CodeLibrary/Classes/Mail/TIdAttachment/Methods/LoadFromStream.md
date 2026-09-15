---
title: LoadFromStream
description: Rewinds a seekable source stream and copies its complete contents into newly prepared concrete attachment storage.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, attachment, load, stream, copy]
---

```Delphi
procedure LoadFromStream(AStream: TStream);
```

### Example

```Delphi
procedure ReplaceFromStream(const Attachment: TIdAttachment;
  const Source: TStream);
begin
  // Source is borrowed; its current position is ignored.
  Attachment.LoadFromStream(Source);
end;
```

### Usage

`LoadFromStream` rewinds a seekable source stream and copies its complete contents into newly prepared attachment storage.

### Additional Technical Info
`LoadFromStream` asks the runtime attachment class to prepare destination storage, then executes `Destination.CopyFrom(AStream, 0)`. Its `finally` block calls the descendant's storage finaliser even when copying fails.

| Parameter | Meaning |
|---|---|
| `AStream` | Borrowed source stream. It must be non-nil, readable, seekable to byte zero and able to report its complete size. |

Passing zero as the copy count has a precise Delphi meaning: `AStream.Position` is first set to zero and `AStream.Size` becomes the copy count. The caller's incoming position is ignored. On normal completion a conventional source is positioned at end-of-stream. This differs from APIs that copy only `Size - Position` bytes.

The method does not free the source or restore its position. If the caller needs its former position, save it before the call and restore it in the caller's own `finally` block. A non-seekable socket, decompression or forward-only stream can fail while resetting position or obtaining size.

#### Storage and finalisation

The base class is abstract; behavior depends on its concrete storage hooks. [`TIdAttachmentFile`](../../TIdAttachmentFile.md) allocates a new system temporary path, creates/truncates the file, stores that path, and marks the file for deletion when the attachment is destroyed. It closes the file during finalisation and then sets [`AttachmentBlocked`](../../TIdAttachmentFile/Properties/AttachmentBlocked.md) from a simple `not FileExists(StoredPathName)` test.

Finalisation is guaranteed only after destination preparation returns successfully. If preparation itself raises, there is no prepared object to finalise. If `AStream` is nil, file-backed preparation can already create and adopt a temporary file before the nil dereference occurs; finalisation then still runs.

Velox's hidden `TvxEmail.AttachStream` descendant is not a writable attachment store: its preparation hook returns nil and its finaliser is a no-op. Calling this method on that runtime class therefore fails on the nil destination instead of replacing the borrowed backing stream.

The finaliser is not rollback. If reading or writing fails partway through and the temporary file remains, the attachment can retain incomplete bytes while `AttachmentBlocked` is false. Discard the attachment after any exception rather than assuming its earlier state survived.

#### Metadata, memory and concurrency

Content is copied as opaque bytes. The method does not derive `FileName`, MIME `ContentType`, transfer encoding or a checksum. Update appropriate inherited metadata separately only when the sender's contract requires it.

The copy is synchronous and O(n) in source size. Current Delphi copies in bounded chunks, but the complete attachment still consumes filesystem/storage quota. An inaccurate or malicious stream size, short read, read error, disk-full condition or sharing/security product can propagate an exception and leave partial state.

The attachment, its owner collection and source stream are mutable and not thread-safe. Do not reuse or reposition the source concurrently, and do not load one attachment from multiple flows at once.

The source-reviewed example states the ownership and position boundary explicitly. It was not executed by the documentation workflow.

**External references**

- [Indy upstream: `TIdAttachment.LoadFromStream`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdAttachment.pas) - upstream implementation, including its own zero-count warning comment.
- [Embarcadero DocWiki: `System.Classes.TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.CopyFrom) - Delphi copy semantics used by Velox.
- [Free Pascal: `TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html) - analogous RTL contract for portability context.

<small>Created 2026-07-15</small>
