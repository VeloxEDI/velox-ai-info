---
title: ResolveContentType
description: Returns nonempty input unchanged or supplies context-sensitive MIME defaults for empty input, including multipart/digest children.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, content-type, default, multipart]
---

```Delphi
function ResolveContentType(AContentType: string): string;
```

### Example

```Delphi
procedure EffectiveType(const Part: TIdMessagePart; var Value: Variant);
begin
  Value := Part.ResolveContentType(Part.ContentType);
end;
```

### Usage

`ResolveContentType` returns nonempty input unchanged or supplies context-sensitive MIME defaults for empty input, including multipart/digest children.

### Additional Technical Info
`ResolveContentType` supplies Indy's default media type only when `AContentType` is empty.

| Condition | Result |
|---|---|
| Input nonempty | The exact input, including parameters and whitespace, unchanged |
| Empty; item belongs to a MIME-encoded owner message; parent is `multipart/digest` | `message/rfc822` |
| Empty; item belongs to any other MIME context | `text/plain` |
| Empty; detached, wrong collection, no owner message or non-MIME message | Empty String |

Despite a source comment saying the routine extracts `text/plain` from a parameterized value, the implementation does not parse nonempty input at all. Callers needing a bare media type must parse it separately; do not assume parameters are removed.

The MIME default path depends on the item being in `TIdMessageParts` whose owner is `TIdMessage` with `Encoding=meMIME`. For a nonnegative hidden `ParentPart`, it indexes the same collection and inspects that parent's first `Content-Type` header for `multipart/digest`.

There is no ParentPart bounds check here. A stale index can raise an indexed collection exception. Parent linkage is not exposed by this generated page set, but decoded/native message structures can contain it.

The method does not write [`ContentType`](../Properties/ContentType.md), repair headers or validate the returned token. Complexity is constant except header lookup. Collection/owner mutation during the call is unsupported.

The source-reviewed example passes the stored header and accepts that an already nonempty parameterized value remains parameterized. It was not executed.

**External references**

- [Indy upstream: `TIdMessagePart.ResolveContentType`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - exact context/default branches.
- [RFC 2045 section 5.2](https://www.rfc-editor.org/rfc/rfc2045.html#section-5.2) - default `text/plain` MIME content type.
- [RFC 2046 section 5.1.5](https://www.rfc-editor.org/rfc/rfc2046.html#section-5.1.5) - `multipart/digest` child default.

<small>Created 2026-07-15</small>
