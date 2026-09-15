---
title: CustomRequest
description: Sends a synchronous HTTP request with a caller-supplied method token, optional pending body and captured response through Indy's generic request terminal.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, custom-method, request, body]
---

```Delphi
procedure CustomRequest(const aCustomMethod: string; const aURL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Header['Accept'] := 'application/json';
  Http.CustomRequest('PROPFIND', 'https://api.example.invalid/resources');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`CustomRequest` sends a synchronous HTTP request with a caller-supplied method token, optional pending body and captured response through Velox's generic request Velox.

### Additional Technical Info
`CustomRequest` stores `aCustomMethod` and `aURL`, selects the custom-method branch, and synchronously invokes Indy's generic `DoRequest`. It returns no value; inspect [`Response`](../Properties/Response.md) after completion.

The method token is passed through without trimming, uppercasing or validation. Supply a valid protocol token such as a registered extension method. Never concatenate untrusted text into the method because whitespace/control characters can corrupt the request line.

If the pending [`Content`](../Properties/Content.md) stream has a nonzero size, the complete stream is supplied as the request body; Indy rewinds it when writing. A zero-size stream is passed as `nil`. Velox does not infer media type, semantics, idempotence or preconditions from the method name.

The shared request pipeline applies proxy, SSL, authentication and stored headers, clears the previous response body, and captures the new response body. It normally clears pending content and disconnects in `finally`, including after socket/TLS exceptions. An authentication preflight failure can exit earlier and preserve pending content.

HTTP error statuses normally remain available rather than raising. Operational failures still raise, and stale prior status/header metadata can remain if no new response was received. The call is blocking and the object is not thread-safe.

The current local SSL configuration does not enable peer verification and its assigned callback would accept a failed check. An `https` URL therefore provides encryption without reliable Velox-side server identity validation. Validate/allowlist the destination independently and do not use external input as an unrestricted URL.

**External references**

- [RFC 9110 section 9: Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9)
- [IANA HTTP Method Registry](https://www.iana.org/assignments/http-methods/http-methods.xhtml)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
