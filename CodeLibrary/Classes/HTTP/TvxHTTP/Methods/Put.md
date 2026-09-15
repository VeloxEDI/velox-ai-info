---
title: Put
description: Sends a synchronous PUT request with the complete nonempty pending body and captures the resulting response content and metadata.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, put, request-body, idempotent]
---

```Delphi
procedure Put(const aURL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ContentAsUTF8 := '{"status":"ready"}';
  Http.Header['Content-Type'] := 'application/json';
  Http.Header['If-Match'] := '"example-version"';
  Http.Put('https://api.example.invalid/resources/example-123');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

Sends a synchronous PUT request with the complete nonempty pending body and captures the resulting response content and metadata.

### Additional Technical Info
`Put` selects `hmPut`, stores `aURL`, and synchronously calls Indy's PUT overload. It supplies the complete pending [`Content`](../Properties/Content.md) stream when its size is positive and no stream when empty. Indy rewinds a supplied stream before sending.

Velox does not define the representation, set `Content-Type`, add preconditions, validate the target or decide whether PUT creates/replaces a resource. The endpoint contract controls those meanings. Although PUT is idempotent by HTTP definition, concurrency and ambiguous failures still require care; use service-supported validators such as `If-Match` to avoid overwriting another change.

The pending body is normally cleared after the attempt, including after operational exceptions. An authentication preflight exit can preserve it. A completed response body is captured and rewound, while status/headers stay on the response facade.

HTTP error statuses normally do not raise. Network, proxy, TLS and stream failures can raise. The method blocks, reuses stored client state, accepts unrestricted URLs and uses the current non-validating local SSL configuration.

Unlike [`Post`](Post.md), this wrapper calls Indy `DoRequest` directly and does not temporarily force HTTP/1.0; it uses the selected protocol version.

**External references**

- [RFC 9110 section 9.3.4: PUT](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.4)
- [RFC 9110 section 9.2.2: Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2)
- [RFC 9110 section 13.1.1: If-Match](https://www.rfc-editor.org/rfc/rfc9110#section-13.1.1)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
