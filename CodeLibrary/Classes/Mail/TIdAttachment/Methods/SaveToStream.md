---
title: SaveToStream
description: Copies complete attachment storage from byte zero into the caller's current destination-stream position without clearing or truncating it.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, attachment, save, stream, position]
---

```Delphi
procedure SaveToStream(AStream: TStream);
```

### Example

```Delphi
procedure AppendAttachment(const Attachment: TIdAttachment;
  const Destination: TStream);
begin
  Destination.Position := Destination.Size;
  Attachment.SaveToStream(Destination);
end;
```

### Usage

`SaveToStream` copies complete attachment storage from byte zero into the caller's current destination-stream position without clearing or truncating it.

### Additional Technical Info
`SaveToStream` opens the concrete attachment's readable storage, then runs `AStream.CopyFrom(Source, 0)`. It closes/releases the attachment source in a `finally` block. The caller's destination stream is borrowed and is never freed.

| Parameter | Meaning |
|---|---|
| `AStream` | Non-nil writable destination stream. Bytes are written at its current position. |

The zero copy count rewinds the attachment source to byte zero and copies its complete reported size. It does **not** mean zero bytes and does not start from a previously selected source offset.

The destination is not reset, cleared, resized or truncated. Its incoming position controls where the first attachment byte is written, and its position advances by the bytes written. This supports deliberate append behavior, as in the example. When replacing existing content, first set the destination size and position appropriately; otherwise an older tail can remain after a shorter attachment.

#### Runtime storage behavior

For [`TIdAttachmentFile`](../../TIdAttachmentFile.md), the open hook creates a read-only file stream over [`StoredPathName`](../../TIdAttachmentFile/Properties/StoredPathName.md) with write sharing denied. The close hook frees that stream. A missing, removed, inaccessible or locked backing file raises before any copy begins.

The Velox product also has an internal stream-backed attachment descendant. Its open hook saves that backing stream's current position and resets it to zero; its close hook restores the saved position. That detail explains why source position may be preserved for an internal runtime object, but it does not alter the public destination contract.

Unlike [`SaveToFile`](SaveToFile.md) on `TIdAttachmentFile`, this inherited method does not check [`AttachmentBlocked`](../../TIdAttachmentFile/Properties/AttachmentBlocked.md) and does not issue the message's save notification. A blocked decoded file normally fails as an ordinary source-open error. Code that wants a stable blocked contract must inspect the flag first.

#### Failure, state and cost

If opening the source fails, the close hook is not called because no source was returned. If `AStream` is nil or writing fails after a source was opened, the source is still closed, but the destination can contain a partial attachment and its position can have advanced. No rollback restores prior destination bytes, size or position.

The method copies synchronously in bounded chunks and is O(n) in attachment size. Destination streams can impose their own memory, capacity, seek or short-write errors. Do not copy unbounded email content into an in-memory stream without a size policy.

No attachment transformation, MIME decoding, checksum validation or malware scan occurs here; the bytes are the concrete stored representation used by the attachment part. The attachment and both streams must not be mutated concurrently.

The source-reviewed example deliberately appends by positioning the destination. It was not executed by the documentation workflow.

**External references**

- [Indy upstream: `TIdAttachment.SaveToStream`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdAttachment.pas) - upstream open/copy/close sequence.
- [Embarcadero DocWiki: `System.Classes.TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.CopyFrom) - exact Delphi source-rewind and destination-position contract.
- [Free Pascal: `TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html) - analogous compatibility reference.

<small>Created 2026-07-15</small>
