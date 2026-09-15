---
title: Patch
description: Sends a synchronous PATCH request with the complete nonempty pending body and captures the response through the shared HTTP pipeline.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, patch, request-body, concurrency]
---

```Delphi
procedure Patch(const aURL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ContentAsUTF8 := '{"status":"ready"}';
  Http.Header['Content-Type'] := 'application/merge-patch+json';
  Http.Header['If-Match'] := '"example-version"';
  Http.Patch('https://api.example.invalid/resources/example-123');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

Sends a synchronous PATCH request with the complete nonempty pending body and captures the response through the shared HTTP pipeline.

### Additional Technical Info
`Patch` selects `hmPatch`, stores `aURL`, and synchronously invokes Indy's PATCH overload. If the pending [`Content`](../Properties/Content.md) size is positive, Indy sends the complete stream from position zero; otherwise Velox passes no source stream.

Velox does not select a patch document format, set `Content-Type`, add `If-Match`, determine whether the server supports PATCH or verify that the modification was applied. Those are endpoint-contract responsibilities. Use the exact media type and precondition expected by the service; PATCH is not inherently idempotent.

The pending body is normally cleared in `finally`, including after operational request failures, and must be loaded again for a retry. An authentication preflight failure can exit before that finaliser and preserve it. Response content is captured and rewound after completion.

HTTP 4xx/5xx statuses normally remain inspectable through [`Response`](../Properties/Response.md). Network/TLS/proxy/stream errors can raise. Retrying after an ambiguous failure can apply the patch twice; require an idempotency/precondition design before doing so.

The call blocks, inherits persistent headers/cookies/authentication, accepts unrestricted destinations, and uses the current non-validating local SSL configuration.

**External references**

- [RFC 5789: PATCH Method for HTTP](https://www.rfc-editor.org/rfc/rfc5789)
- [RFC 9110 section 13.1.1: If-Match](https://www.rfc-editor.org/rfc/rfc9110#section-13.1.1)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
