---
title: ContentID
description: Reads or replaces the first raw Content-ID header value used by Indy to count related parts, without identifier normalization.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, content-id, related]
---

```Delphi
property ContentID: string read write;
```

### Example

```Delphi
procedure IdentifyInlinePart(const Part: TIdMessagePart);
begin
  Part.ContentID := '<logo@example.invalid>';
end;
```

### Usage

`ContentID` reads or replaces the first raw Content-ID header value used by Velox to count related parts, without identifier normalization.

### Additional Technical Info
`ContentID` maps directly to the first `Content-ID` header value. Nonempty assignment adds/replaces it; empty assignment removes the first occurrence. Duplicates can remain and later surface.

The value is stored exactly. Indy does not add angle brackets, validate msg-id syntax, enforce uniqueness or synchronize HTML `cid:` references. Use a complete application-generated identifier and keep references consistent.

`TIdMessageParts.CountParts` treats any nonempty visible ContentID as a related part, regardless of MIME type or syntax. Counts are cached only when that method runs; changing this property does not automatically refresh them.

The operation modifies metadata only and issues no network/body action. Header lookup is linear and the part is not thread-safe.

The source-reviewed example uses the reserved `.invalid` domain and sends no message.

**External references**

- [Indy upstream: `TIdMessagePart.GetContentID`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - header mapping and count consumer.
- [RFC 2392](https://www.rfc-editor.org/rfc/rfc2392.html) - Content-ID and `cid:` URL syntax.

<small>Created 2026-07-15</small>
