---
title: TIdAttachment
description: Defines the abstract mail-part transfer contract used by concrete attachments to load and save complete file or stream content.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, mail, attachment, stream, file]
---

```Delphi
TIdAttachment = class(TIdMessagePart)
```

### Example

```Delphi
procedure CopyAttachment(const Attachment: TIdAttachment;
  const Target: TStream);
begin
  // Attachment and Target are supplied and owned by the caller.
  Attachment.SaveToStream(Target);
end;
```

### Usage

`TIdAttachment` defines the abstract mail-part transfer contract used by attachments to load and save complete file or stream content.

### Additional Technical Info
`TIdAttachment` is Indy's abstract attachment message-part class. Velox exposes four virtual operations: [`LoadFromFile`](TIdAttachment/Methods/LoadFromFile.md), [`LoadFromStream`](TIdAttachment/Methods/LoadFromStream.md), [`SaveToFile`](TIdAttachment/Methods/SaveToFile.md) and [`SaveToStream`](TIdAttachment/Methods/SaveToStream.md). Concrete descendants decide where attachment bytes are stored by implementing four native storage hooks that are not exposed to scripts.

Do not create a bare `TIdAttachment` for direct use. Although its hidden ancestor can make a constructor visible to PascalScript, the storage hooks are abstract. Calling any transfer method on a base instance reaches an abstract method error. Work with an attachment supplied by a message or another Velox API; the normal visible implementation is [`TIdAttachmentFile`](TIdAttachmentFile.md).

#### Ownership and inherited metadata

The class inherits from [`TIdMessagePart`](TIdMessagePart.md), which in native code is a `TCollectionItem`. An attachment returned from `TIdMessage.MessageParts`, `TvxEmail.AttachFile` or a decoder is normally owned by that collection. Treat it as borrowed: do not free it independently, and do not retain it after the owning message or collection is cleared or freed.

Inherited message-part properties hold MIME metadata such as the display `FileName`, `ContentType`, `ContentTransfer` and character information. That metadata is separate from the bytes and, for a file-backed attachment, separate from its local [`StoredPathName`](TIdAttachmentFile/Properties/StoredPathName.md). The transfer methods do not generally infer or synchronise all metadata after content changes.

#### Complete-content transfer contract

Both stream methods ultimately call Delphi `TStream.CopyFrom` with `Count=0`. In the current Delphi runtime that means:

- set the source stream's position to zero;
- use the source's complete `Size` as the count; and
- write from the destination's current position.

This is not a "copy the unread remainder" contract. A caller-supplied source must support seeking to zero and reporting its size. On success its position ends at end-of-stream unless a concrete attachment hook explicitly restores it. A caller-supplied destination is not cleared or truncated, so bytes beyond the new end can survive when overwriting an existing longer stream.

Stream parameters are borrowed. These methods never free the caller's stream. Concrete storage streams are opened or prepared synchronously around the copy and closed in `finally` blocks.

#### Concrete dispatch and failure state

All four methods are virtual. Behavior therefore depends on the runtime class. `TIdAttachmentFile` stores outgoing attachments as references to live local paths and decoded attachments as temporary files. Its `SaveToFile` override performs an operating-system file copy and has special [`AttachmentBlocked`](TIdAttachmentFile/Properties/AttachmentBlocked.md) handling; `SaveToStream` remains the inherited stream path and does not perform the same flag check.

Velox also uses a hidden stream-backed descendant for `TvxEmail.AttachStream`. It borrows the supplied `TMemoryStream`, restores that backing stream's prior position after saving, and does not free it. The caller must keep the stream alive and unchanged until the message has finished using it. That descendant implements no writable temporary storage: its prepare hook returns nil, so `LoadFromFile` or `LoadFromStream` on such an item fails rather than replacing its content.

Transfers are not transactional. A read, write, allocation, seek, sharing, permission, antivirus or disk-space exception propagates. A file or destination stream can be created or partly overwritten before failure, and a failed load can leave partial concrete storage. The caller must decide whether to discard the affected attachment or destination.

Paths are interpreted by the Velox process and use its identity, working environment and filesystem permissions. Never pass an untrusted path without an application-level allow-list and destination policy. The objects, their collections, backing streams and message callbacks are mutable and not thread-safe; do not transfer or alter one attachment concurrently.

The source-reviewed example copies an existing attachment into a caller-owned target stream. It was not executed by the documentation workflow.

**External references**

- [Indy upstream: `IdAttachment.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdAttachment.pas) - upstream abstract storage and transfer design; Velox executes its bundled and modified source.
- [Embarcadero DocWiki: `System.Classes.TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.CopyFrom) - Delphi complete-stream behavior for a zero count.
- [Free Pascal: `TStream.CopyFrom`](https://www.freepascal.org/docs-html/rtl/classes/tstream.copyfrom.html) - compatible stream-copy reference; the traced Delphi runtime is authoritative for Velox.

<small>Created 2026-07-15</small>
