---
title: ContentType
description: Stores the first Content-Type header after extracting charset and name parameters into independent fields that can later become stale.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, content-type, charset, name]
---

```Delphi
property ContentType: string read write;
```

### Example

```Delphi
procedure ConfigureTextPart(const Part: TIdMessagePart);
begin
  Part.ContentType := 'text/plain; charset="utf-8"';
end;
```

### Usage

`ContentType` stores the first Content-Type header after extracting charset and name parameters into independent fields that can later become stale.

### Additional Technical Info
Reading returns the first stored `Content-Type` header. The setter parses the supplied String only to remove `charset` and `name` parameters, then stores the remaining value as the header.

Nonempty extracted `charset` and `name` values update [`CharSet`](CharSet.md) and [`Name`](Name.md). Missing or empty parameters do **not** clear previous fields. Therefore replacing `text/plain; charset=utf-8` with `application/json` leaves CharSet as `utf-8` unless explicitly cleared.

The getter normally returns the stripped value, not the original assignment. Direct CharSet/Name writes do not recreate parameters. Empty ContentType removes only the first header and retains both fields; duplicates can surface.

No media-type/token/parameter compatibility is validated and no body conversion occurs. [`ResolveContentType`](../Methods/ResolveContentType.md) supplies context defaults only when passed empty; it returns nonempty parameterized input unchanged.

Coordinate content bytes, runtime part type, media type, charset and transfer encoding explicitly. Header parsing/allocation failures can leave broader caller state non-transactional; the part is not thread-safe.

The source-reviewed example results in stored ContentType `text/plain` plus CharSet `utf-8`; it encoded no bytes.

**External references**

- [Indy upstream: `TIdMessagePart.SetContentType`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - exact parameter extraction.
- [RFC 2045 section 5](https://www.rfc-editor.org/rfc/rfc2045.html#section-5) - MIME Content-Type syntax.

<small>Created 2026-07-15</small>
