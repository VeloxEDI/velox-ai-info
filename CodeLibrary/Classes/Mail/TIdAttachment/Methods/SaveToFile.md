---
title: SaveToFile
description: Saves an attachment to a local path using runtime-class dispatch, with overwrite, blocked-file and non-transactional failure behavior.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, attachment, save, file, overwrite]
---

```Delphi
procedure SaveToFile(const FileName: String);
```

### Example

```Delphi
procedure ExportAttachment(const Attachment: TIdAttachment;
  const ApprovedDestination: String);
begin
  // The caller has already confined this path to an approved export folder.
  Attachment.SaveToFile(ApprovedDestination);
end;
```

### Usage

`SaveToFile` writes the attachment to a local path. It can overwrite an existing file, and a failed write can leave a partial file.

#### Security and safety

Both the source [`StoredPathName`](../../TIdAttachmentFile/Properties/StoredPathName.md) and destination are local authority boundaries. A script that can influence them can read or overwrite files visible to the Velox service account. Use canonical-path and approved-root checks outside this method; extensions and display `FileName` metadata are not security controls.

The operation is synchronous and O(n) in attachment size. The Velox Windows copy can use operating-system buffering, while other items use Velox stream copying. The object, source file and destination must remain stable for the call. Concurrent saves, cleanup or path mutation are unsupported.

### Additional Technical Info
`SaveToFile` writes the attachment's complete bytes to `FileName`. The method is virtual, so the exact file operation and blocked-attachment behavior are selected from the attachment's runtime class.

| Parameter | Meaning |
|---|---|
| `FileName` | Destination path interpreted with the Velox process identity and permissions. Existing files may be replaced. |

For a descendant that does not override the base implementation, the base first creates/truncates a destination `TIdFileCreateStream` and then calls virtual [`SaveToStream`](SaveToStream.md). Opening the source attachment happens after destination creation. A source-open failure can therefore leave an existing destination already empty or replaced.

#### `TIdAttachmentFile` override

The usual [`TIdAttachmentFile`](../../TIdAttachmentFile.md) runtime class bypasses that base stream path and calls Indy's `CopyFileTo(StoredPathName, FileName)`. On Windows this uses `CopyFile(..., False)`, so it permits replacement of an existing destination. It is still a direct non-atomic copy, not a write-to-temporary-and-rename transaction.

On copy failure, the Velox-modified implementation raises the current operating-system error with the context `Unable to save file <FileName>`. Causes include missing source content, an invalid or identical source/destination path, access denial, sharing conflicts, disk exhaustion and path errors. A failed replacement can leave destination state determined by the operating-system copy operation; do not treat it as an atomic commit.

On success the override calls the owning message's native save-notification callback with the destination name. An exception from that callback propagates even though the file has already been copied. The normal attachment is collection-owned and has a message owner; using a detached/native-created item without that owner can dereference nil during this callback.

If [`AttachmentBlocked`](../../TIdAttachmentFile/Properties/AttachmentBlocked.md) is true, the override does not create or copy `FileName`. It instead notifies the owning message with the text `BLOCKED BY ANTIVIRUS: ` followed by the requested path, then returns normally. Therefore normal return does **not** prove that a destination file exists; check the flag before saving and verify application-level output expectations afterwards.

This special blocked behavior applies only to the file-backed override. [`SaveToStream`](SaveToStream.md) does not check the flag and normally fails while trying to reopen the missing backing file.

**External references**

- [Indy upstream: `IdAttachmentFile.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdAttachmentFile.pas) - upstream file-backed override; Velox adds operating-system error detail and save notification.
- [Embarcadero DocWiki: `System.Classes.TFileStream`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TFileStream) - base-descendant file-stream context.
- [Free Pascal: `TFileStream`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.html) - compatible file-stream context, not evidence for Velox's Windows `CopyFile` override.

<small>Created 2026-07-15</small>
