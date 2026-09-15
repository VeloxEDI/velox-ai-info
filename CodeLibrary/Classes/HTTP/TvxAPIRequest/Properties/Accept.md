---
title: Accept
description: Returns Indy's selected Accept request-header value as an unparsed string for optional response negotiation.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, accept, content-negotiation]
---

```Delphi
property Accept: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.Accept
  else
    Value := '';
end;
```

### Usage

Returns Velox's selected Accept request-header value as an unparsed string for optional response negotiation.

### Additional Technical Info
`Accept` returns the value Indy stored from the inbound `Accept` header. During header processing Indy performs a case-insensitive lookup in its raw-header list and stores the first matching field value; folded continuation text is unfolded. Velox's property helper returns that string unchanged.

No media-range parser, quality-factor sorting or response selection is performed. An empty result means no selected value was available; under HTTP semantics that is not the same as a client explicitly rejecting every media type. Multiple physical `Accept` fields are not combined by this getter, so do not build security or exact negotiation logic around this string alone.

Treat the value as untrusted syntax. If an endpoint supports more than one representation, parse it with a standards-conforming bounded parser, define a deterministic server preference, and return an appropriate response when no supported representation is acceptable. Do not use substring checks such as `Pos('json', Request.Accept)` as proof that a particular media range is valid or preferred.

This property is read-only but belongs to the live host-owned [`TvxAPIRequest`](../../TvxAPIRequest.md). Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`, and do not retain the object after the API execution.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Accept`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Accept)
- [RFC 9110 section 12.5.1: Accept](https://www.rfc-editor.org/rfc/rfc9110#section-12.5.1)

<small>Created 2026-07-15</small>
