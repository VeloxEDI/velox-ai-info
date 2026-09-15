---
title: Name
description: Stores raw MIME part name metadata independently and updates only when ContentType supplies a nonempty name parameter.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, name, content-type]
---

```Delphi
property Name: String read write;
```

### Example

```Delphi
procedure NameMimePart(const Part: TIdMessagePart);
begin
  Part.Name := 'result.csv';
end;
```

### Usage

Stores raw MIME part name metadata independently and updates only when ContentType supplies a nonempty name parameter.

### Additional Technical Info
`Name` is the independent field associated with a MIME `Content-Type` `name` parameter. It is not a collection display name, address display name or local storage path.

Setting [`ContentType`](ContentType.md) with a nonempty `name` parameter extracts that value here and removes it from the stored header. A later ContentType without the parameter leaves Name stale. Direct Name assignment does not rebuild a header parameter.

[`FileName`](FileName.md) is a separate field normally associated with `Content-Disposition filename`. The two can differ. Neither setter validates paths, extensions, encoding or consistency with the body.

Native Assign copies Name. The raw String mutation does not issue a special collection change notification, performs no I/O and is not thread-safe.

The source-reviewed example sets metadata only.

**External references**

- [Indy upstream: `TIdMessagePart.SetContentType`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - name extraction and field storage.
- [RFC 2045 section 5.1](https://www.rfc-editor.org/rfc/rfc2045.html#section-5.1) - MIME media-type parameter syntax.

<small>Created 2026-07-15</small>
