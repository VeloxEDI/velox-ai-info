---
title: LoadFromFile
description: Opens a local source file for shared reading and replaces the concrete attachment storage with a complete byte-for-byte copy.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, attachment, load, file, filesystem]
---

```Delphi
procedure LoadFromFile(const FileName: String);
```

### Example

```Delphi
procedure ReplaceAttachmentContent(const Attachment: TIdAttachment;
  const SourceFile: String);
begin
  // SourceFile must already be trusted and readable by the Velox process.
  Attachment.LoadFromFile(SourceFile);
end;
```

### Usage

`LoadFromFile` opens a local source file for shared reading and replaces the attachment storage with a complete byte-for-byte copy.

### Additional Technical Info
`LoadFromFile` opens `FileName` through Indy's `TIdReadFileExclusiveStream`, calls virtual [`LoadFromStream`](LoadFromStream.md), and frees the source stream in a `finally` block. Despite the stream class's name, its current mode is `fmOpenRead or fmShareDenyWrite`: other readers are allowed, while a competing writer that respects sharing is denied during the copy.

| Parameter | Meaning |
|---|---|
| `FileName` | Local source path interpreted under the Velox process account. Relative paths depend on the process working directory and should be avoided. |

The method copies the complete file from byte zero; it does not retain a reference to this source stream. It preserves arbitrary binary bytes and does not parse MIME content, validate an extension, scan for malware or automatically make inherited attachment metadata match the source path.

#### File-backed descendant behavior

For [`TIdAttachmentFile`](../../TIdAttachmentFile.md), loading does **not** write into the path currently held by [`StoredPathName`](../../TIdAttachmentFile/Properties/StoredPathName.md). The descendant prepares a newly generated system temporary filename, creates that file, copies the source into it and marks it for destructor cleanup. `StoredPathName` is changed to the new temporary path.

This makes the loaded bytes independent of subsequent changes to the original source file, but it also changes an outgoing live-file attachment into a temporary-file-backed attachment. The inherited display `FileName` and `ContentType` are not refreshed by this operation, so they can continue to describe earlier content.

Velox's hidden stream-backed attachment descendant is save-only: its destination-preparation hook returns nil. If an item originated from `TvxEmail.AttachStream`, calling `LoadFromFile` opens the source file but then fails while inherited loading tries to copy into that nil destination. Do not use the load methods to replace an attached memory stream.

After closing the temporary output, the descendant tests whether its path still exists. This is intended to detect an on-access antivirus product that removed or blocked the file. Depending on the owner message's native policy, the method either raises `EIdMessageCannotLoad` or returns with [`AttachmentBlocked=True`](../../TIdAttachmentFile/Properties/AttachmentBlocked.md).

#### Failures and side effects

Missing files, directories, invalid paths, share conflicts and access errors can fail before descendant storage is prepared. Errors after preparation can leave a partial temporary file and changed attachment state; the operation has no rollback. If the output file still exists after a partial-copy exception, the existence-only block test does not prove that it is complete or safe.

The source can also change if a producer ignores Windows sharing rules. Use a stable, fully written input file. The copy is synchronous, requires I/O proportional to the complete file and may allocate Delphi's stream-copy buffer. Avoid unbounded attachment sizes and do not call the method concurrently on one attachment.

Treat `FileName` as security-sensitive input. The method can read any path visible to the Velox service identity; validate it against an approved root before a technical user, configuration value or external record can influence it.

The source-reviewed example assumes that the caller already validated the path. It was not executed and does not access a real filesystem in the documentation workflow.

**External references**

- [Indy upstream: `TIdAttachment.LoadFromFile`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdAttachment.pas) - upstream call sequence used by the bundled base class.
- [Embarcadero DocWiki: `System.Classes.TFileStream`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TFileStream) - Delphi file-stream modes and exceptions.
- [Free Pascal: `TFileStream`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.html) - compatible file-stream reference; Velox uses the traced Delphi/Indy implementation.

<small>Created 2026-07-15</small>
