---
title: ContentDisposition
description: Returns Indy's parsed first Content-Disposition response-field value as untrusted metadata.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, content-disposition, metadata]
---

```Delphi
property ContentDisposition: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://api.example.invalid/v1/export');
  if Http.Response.Success then
    Value := Http.Response.ContentDisposition;
end;
```

### Usage

`ContentDisposition` returns Velox's parsed first Content-Disposition response-field value as untrusted metadata.

### Additional Technical Info
`ContentDisposition` returns the value that Indy parsed from the first `Content-Disposition` field of the current response. Typical values describe an inline representation or an attachment and can include parameters such as `filename`. An absent or empty field returns `''`.

The value is metadata only. It neither saves [`Content`](Content.md) nor changes how Velox decodes the body. For just the conventional `filename` parameter, see [`Filename`](Filename.md); use the raw [`Header`](Header.md)`['Content-Disposition']` when the exact received field is required.

Repeated fields are not combined into an ordered collection by this property: Indy's named lookup selects the first matching raw-header entry. Folded continuation lines are unfolded. A trailer field can be visible through the raw-header APIs, but typed response properties are populated during initial header processing and are not reprocessed after trailers arrive.

This is server-controlled input and can be malformed, misleading or stale. Before each request Velox clears only the response body, so a failure before new headers are received can leave the previous disposition visible. Never derive a local path or trust decision directly from this value.

**External references**

- [RFC 6266: Content-Disposition in HTTP](https://www.rfc-editor.org/rfc/rfc6266)
- [RFC 9110 section 5: Fields](https://www.rfc-editor.org/rfc/rfc9110#section-5)

<small>Created 2026-07-20</small>
