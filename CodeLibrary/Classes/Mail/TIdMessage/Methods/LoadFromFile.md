---
title: LoadFromFile
description: Destructively loads and parses a message from a read/share-deny-write file stream after an existence check, optionally stopping after headers.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, load, file, eml]
---

```Delphi
procedure LoadFromFile(const AFileName: string;
  const AHeadersOnly: Boolean);
```

### Example

```Delphi
procedure LoadMessageFile(const Message: TIdMessage;
  const AFileName: string);
begin
  Message.LoadFromFile(AFileName, False);
end;
```

### Usage

`LoadFromFile` destructively loads and parses a message from a read/share-deny-write file stream after an existence check, optionally stopping after headers.

### Additional Technical Info
`LoadFromFile` checks `FileExists(AFileName)`, opens an Indy `TIdReadFileExclusiveStream`, delegates to [`LoadFromStream`](LoadFromStream.md), and closes the file in `finally`. The stream opens at position zero for reading and denies write sharing while open; other readers are not necessarily excluded.

If the initial existence check is false, the method raises `EIdMessageCannotLoad`. The file can still disappear/change or become inaccessible between that check and open, and path/permission/share errors then surface as the underlying filesystem exception.

Loading is destructive. The delegated method calls [`Clear`](Clear.md) before parsing, so the old message is lost even when the file later proves malformed or parsing/attachment creation fails. Retained fields such as NoDecode and AttachmentTempDirectory survive Clear and influence how this file is processed.

When `AHeadersOnly=True`, headers are read and [`ProcessHeaders`](ProcessHeaders.md) populates typed properties, but Body and MessageParts remain empty. With false, body/MIME parts are decoded synchronously. Received file attachments can create temporary files under AttachmentTempDirectory and are owned by MessageParts after success or partial parsing.

The input is interpreted through Indy's message-stream framing: EOF is converted to an internal dot terminator, while an actual unescaped dot-only line can end the message. This is compatible with files produced by [`SaveToFile`](SaveToFile.md), but it is not a byte-for-byte opaque file reader.

`AFileName` is resolved under the Velox process account and can be absolute or relative to that process's working directory. Validate/configure paths rather than accepting arbitrary external input; loading can expose local files and allocate large memory/disk content. The operation is synchronous, non-transactional and not thread-safe.

The source-reviewed example passes the script-required Boolean explicitly and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.LoadFromFile`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - existence/open/delegation lifecycle baseline.
- [RFC 5322](https://www.rfc-editor.org/rfc/rfc5322.html) - parsed Internet message format.
- [Embarcadero DocWiki: `System.Classes.TFileStream`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TFileStream) - underlying Delphi file stream.
- [Free Pascal: `TFileStream`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.html) - compatible stream context; Velox uses Delphi/Indy.

<small>Created 2026-07-15</small>
