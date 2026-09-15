---
title: TIdAttachmentFile
description: Implements a file-backed mail attachment as either a live outgoing source path or a destructor-managed received temporary file.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, mail, attachment, file, temporary-file]
---

```Delphi
TIdAttachmentFile = class(TIdAttachment)
```

### Example

```Delphi
procedure ExportIfAvailable(const Attachment: TIdAttachmentFile;
  const ApprovedDestination: String);
begin
  if not Attachment.AttachmentBlocked then
    Attachment.SaveToFile(ApprovedDestination);
end;
```

### Usage

`TIdAttachmentFile` implements a file-backed mail attachment as either a live outgoing source path or a destructor-managed received temporary file.

#### Critical writable-path hazard

`StoredPathName` is exposed read/write, but its setter is only a raw field assignment. It performs no validation, move, copy, metadata update, block-state reset or temporary-ownership transfer.

Do **not** assign it on a received or otherwise temporary attachment. The hidden temporary flag stays true. When the attachment is destroyed, its destructor calls `DeleteFile` on the *current* `StoredPathName`, so reassignment can delete an unrelated replacement path while leaving the original temporary file behind. The destructor ignores a failed deletion result.

On an outgoing non-temporary attachment, path reassignment changes the future byte source but leaves display `FileName` and MIME `ContentType` stale. Prefer creating/attaching the intended file through the owning mail API rather than mutating this property.

### Additional Technical Info
`TIdAttachmentFile` is the normal concrete, file-backed implementation of [`TIdAttachment`](TIdAttachment.md). It appears in two operational states that look similar through the script API but have different storage and cleanup contracts.

| State | Backing behavior |
|---|---|
| Outgoing attachment | The native constructor normally stores the supplied local path directly. It does not copy the source; sending or saving reopens the live file later. |
| Received/decoded attachment | The decoder calls inherited loading, which creates a unique system temporary file, stores decoded bytes there and marks it for deletion by the attachment destructor. |

Attachments are normally owned by a `TIdMessage.MessageParts` collection. A value returned from the message or from `TvxEmail.AttachFile` is borrowed; clearing/freeing the message destroys the item and, for received content, attempts temporary-file cleanup. Do not free the item separately or retain it after its owner.

#### Creating outgoing attachments

Velox's native `TvxEmail.AttachFile` helper first checks that the supplied file exists, constructs `TIdAttachmentFile` in the message's parts collection, and returns the borrowed item. It returns nil when the file is absent and also catches any constructor exception and converts it to nil. Construction records the full argument in [`StoredPathName`](TIdAttachmentFile/Properties/StoredPathName.md), extracts only its base name into inherited `FileName`, and infers `ContentType` from that base name.

No byte copy or content snapshot occurs. If the source changes, disappears or becomes locked before encoding/sending, later attachment access observes that new state or fails. Keep the source stable for the whole mail operation and never assume an earlier `FileExists` check reserves it.

#### Loading received or replacement content

Inherited [`LoadFromFile`](TIdAttachment/Methods/LoadFromFile.md) and [`LoadFromStream`](TIdAttachment/Methods/LoadFromStream.md) replace storage with a newly created temporary file, set the hidden native temporary flag and update `StoredPathName`. They copy complete content from byte zero. They do not update inherited display `FileName` or `ContentType` to describe that content.

After the temporary writer closes, the descendant checks only whether the path still exists. If it has disappeared, [`AttachmentBlocked`](TIdAttachmentFile/Properties/AttachmentBlocked.md) becomes true and the owner message policy decides whether loading raises or returns with the blocked item retained.

#### Saving, failures and security

Inherited [`SaveToStream`](TIdAttachment/Methods/SaveToStream.md) opens the current backing path and copies complete bytes to the caller's current stream position. Overridden [`SaveToFile`](TIdAttachment/Methods/SaveToFile.md) normally performs an overwrite-allowed operating-system file copy and notifies the owner message. If the block flag is true, that override only emits the blocked save notification and returns without creating the destination.

The block flag is not a live `FileExists` property. An outgoing missing file can still show false; a path reassignment can leave a prior true value stale. Stream saving also does not short-circuit on the flag.

Local paths can expose or overwrite any file available to the Velox service identity. Apply canonical-path/root policies outside these low-level methods and avoid logging `StoredPathName` where host topology is sensitive. Operations are synchronous, non-transactional and not thread-safe; object state and files must remain stable throughout transfer and cleanup.

The source-reviewed example checks the one exposed blocked indicator before export. Normal return still requires application-level confirmation of the expected output. No filesystem or mail operation was executed by the documentation workflow.

**External references**

- [Indy upstream: `IdAttachmentFile.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdAttachmentFile.pas) - upstream descendant context; Velox's bundled copy contains material modifications described above.
- [Indy upstream: `IdAttachment.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdAttachment.pas) - inherited complete-content transfer contract.
- [Embarcadero DocWiki: `System.Classes.TFileStream`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TFileStream) - Delphi backing-stream reference.
- [Free Pascal: `TFileStream`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.html) - compatible file-stream context only.

<small>Created 2026-07-15</small>
