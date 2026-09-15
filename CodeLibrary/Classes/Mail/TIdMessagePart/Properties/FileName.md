---
title: FileName
description: Stores raw recipient-visible filename metadata independently from backing storage and updates only from nonempty Content-Disposition filename parameters.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, filename, metadata]
---

```Delphi
property FileName: String read write;
```

### Example

```Delphi
procedure NamePart(const Part: TIdMessagePart);
begin
  Part.FileName := 'result.csv';
end;
```

### Usage

Stores the filename shown to the recipient independently from the attachment's local file path. Reading message headers updates it only when `Content-Disposition` contains a nonempty filename.

### Additional Technical Info
`FileName` is an independent metadata field. It is not the file-backed attachment's local `StoredPathName` and setting it does not read, rename, copy or verify a file.

Assigning [`ContentDisposition`](ContentDisposition.md) with a nonempty `filename` parameter decodes and writes this field. A disposition without filename leaves any old value unchanged. Direct FileName assignment does not update the stored Content-Disposition header; the downstream encoder may use the field later.

For `TIdAttachmentFile`, changing FileName does not change its byte source. Conversely changing `StoredPathName` does not refresh FileName. Keep recipient-visible metadata and backing content coordinated deliberately.

Treat received filenames as untrusted labels, not paths. Remove directory components and enforce destination naming policy before saving. The property accepts separators, traversal text, control characters and empty String without validation.

Native Assign copies the field. Assignment is O(n), does no I/O and is not thread-safe.

The source-reviewed example sets a simple label and creates no file.

**External references**

- [Indy upstream: `TIdMessagePart`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - field and disposition extraction.
- [RFC 2183 section 2.3](https://www.rfc-editor.org/rfc/rfc2183.html#section-2.3) - filename parameter and receiver cautions.

<small>Created 2026-07-15</small>
