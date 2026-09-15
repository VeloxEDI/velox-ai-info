---
title: ContentDisposition
description: Stores Content-Disposition without its filename parameter and updates FileName only when a nonempty decoded filename is supplied.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, content-disposition, filename]
---

```Delphi
property ContentDisposition: string read write;
```

### Example

```Delphi
procedure MarkAttachment(const Part: TIdMessagePart);
begin
  Part.ContentDisposition := 'attachment; filename="result.csv"';
end;
```

### Usage

`ContentDisposition` stores Content-Disposition without its filename parameter and updates FileName only when a nonempty decoded filename is supplied.

### Additional Technical Info
Reading returns the first stored `Content-Disposition` header value. Assignment removes a MIME `filename` parameter from the supplied value and stores the remainder as that header.

When the extracted filename is nonempty, Indy decodes header encoding and writes [`FileName`](FileName.md). If the parameter is absent, empty or decodes empty, the existing FileName is retained. Thus `ContentDisposition := 'inline'` can coexist with a stale prior filename.

The getter normally does not reproduce the filename parameter because it was separated into the field. Setting FileName directly does not update ContentDisposition. Empty disposition removes only the first matching header and also leaves FileName unchanged; duplicate headers can then surface.

No disposition-token, filename, path or extension validation occurs. FileName is metadata and must not be treated as a trusted local path. The setter performs no body/file operation.

The source-reviewed example demonstrates extraction; it writes no file and sends no mail.

**External references**

- [Indy upstream: `TIdMessagePart.SetContentDisposition`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - exact extraction/stale-field behavior.
- [RFC 2183](https://www.rfc-editor.org/rfc/rfc2183.html) - Content-Disposition and filename parameters.

<small>Created 2026-07-15</small>
