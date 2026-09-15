---
title: SaveToFile
description: Creates or truncates a destination file and serializes the message with file-mode Bcc inclusion, optional headers-only output and a full-message dot terminator.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, save, file, eml]
---

```Delphi
procedure SaveToFile(const AFileName: string;
  const AHeadersOnly: Boolean);
```

### Example

```Delphi
procedure SaveMessageFile(const Message: TIdMessage;
  const AFileName: string);
begin
  Message.SaveToFile(AFileName, False);
end;
```

### Usage

`SaveToFile` creates or truncates a destination file and serializes the message with file-mode Bcc inclusion, optional headers-only output and a full-message dot terminator.

### Additional Technical Info
`SaveToFile` opens an Indy `TIdFileCreateStream`, sets an internal `FSavingToFile` flag, delegates to [`SaveToStream`](SaveToStream.md), restores the flag in `finally`, and closes the stream. The create stream uses Delphi `fmCreate` semantics: an existing file is truncated and a missing file is created.

The internal flag changes header generation. [`GenerateHeader`](GenerateHeader.md) includes Bcc recipients only for this file route; normal/direct stream output removes Bcc to match SMTP delivery privacy. The flag is restored even when serialization fails, but the other message mutations performed during header generation remain.

`AHeadersOnly=True` writes headers without Body/MessageParts and without the final dot line. False writes the full encoded/raw message and appends a line containing `.` as the end-of-message marker. The result is the same transport-framed format consumed by LoadFromFile, not necessarily a minimal byte-for-byte `.eml` representation.

The operation is not atomic. The destination is created/truncated before generation or encoding begins; an exception can leave an empty or partial final file and destroy the previous contents. Use an application-controlled temporary path plus a verified rename when atomic replacement is required.

The process account must have directory/file permissions. An arbitrary path can overwrite accessible files, so do not pass untrusted filenames. Attachment sources are read synchronously and may change/fail during serialization. Concurrent calls on the same message race the internal file flag, generated headers, boundaries and part state.

The source-reviewed example passes the script-required Boolean and was not runtime/filesystem-tested.

**External references**

- [Indy upstream: `TIdMessage.SaveToFile`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - create/flag/delegate/finally implementation.
- [RFC 5322](https://www.rfc-editor.org/rfc/rfc5322.html) - Internet message content represented inside the transport framing.
- [RFC 5321 section 4.5.2](https://www.rfc-editor.org/rfc/rfc5321.html#section-4.5.2) - dot termination/transparency context.
- [Embarcadero DocWiki: `System.Classes.TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TFileStream.Create) - Delphi create/truncate stream behavior.
- [Free Pascal: `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html) - compatible file-stream context; Velox uses Delphi/Indy.

<small>Created 2026-07-15</small>
