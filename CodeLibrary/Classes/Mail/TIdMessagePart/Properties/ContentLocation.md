---
title: ContentLocation
description: Reads or replaces the first raw Content-Location header without resolving, fetching or validating the supplied reference.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, content-location, uri]
---

```Delphi
property ContentLocation: string read write;
```

### Example

```Delphi
procedure LocateInlinePart(const Part: TIdMessagePart);
begin
  Part.ContentLocation := 'images/logo.png';
end;
```

### Usage

`ContentLocation` reads or replaces the first raw Content-Location header without resolving, fetching or validating the supplied reference.

### Additional Technical Info
`ContentLocation` is a first-value view over the `Content-Location` header. Nonempty assignment adds/replaces the first occurrence; empty removes it. A duplicate later header can become visible.

The String is stored raw. The setter does not parse a URI, resolve a relative reference, fetch content, verify a file, update ContentID or change the part bytes. Relative/absolute interpretation belongs to the MIME consumer and surrounding message context.

Avoid treating this metadata as an authorized filesystem or network destination. If external input controls it, apply the consumer application's URI/security policy before dereferencing it elsewhere.

Lookup/update is linear in header count, non-transactional with respect to broader message changes and not thread-safe.

The source-reviewed example sets a relative metadata reference only; no resource was accessed.

**External references**

- [Indy upstream: `TIdMessagePart.GetContentLocation`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - exact raw-header mapping.
- [RFC 2557 section 4](https://www.rfc-editor.org/rfc/rfc2557.html#section-4) - Content-Location in MIME-related content.

<small>Created 2026-07-15</small>
