---
title: TvxHTTP
description: Provides Velox scripts with a reusable synchronous Indy HTTP client, pending request body, response facade and authentication configuration.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, client, request, response, authentication, tls]
---

```Delphi
TvxHTTP = class(TObject);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Header['Accept'] := 'application/json';
  Http.Get('https://api.example.invalid/v1/status');

  if Http.Response.Success then
    Value := Http.Response.ContentAsUTF8
  else
    Value := Http.Response.ResponseCode;
end;
```

### Usage

`TvxHTTP` provides Velox scripts with a reusable synchronous Velox HTTP client, pending request body, response facade and authentication configuration.

### Additional Technical Info
`TvxHTTP` is Velox's stateful outbound HTTP helper. It wraps one Indy client, a pending request-body memory stream, a response facade, a request-header list, a per-instance in-memory cookie manager, authentication/OAuth state and optional proxy/SSL/intercept objects.

Use the [`Http`](../../Variables/Helpers/Http.md) helper in ordinary scripts. It lazily returns the client owned by the current scripter, or a client injected by the host; never free that object. [`Create`](TvxHTTP/Methods/Create.md) instead returns a separate caller-owned instance that must be freed and requires a valid log object.

The class exposes 14 generated methods and 31 generated properties. Its methods are [`ClearAuthentication`](TvxHTTP/Methods/ClearAuthentication.md), [`Create`](TvxHTTP/Methods/Create.md), [`CustomRequest`](TvxHTTP/Methods/CustomRequest.md), [`Delete`](TvxHTTP/Methods/Delete.md), [`Get`](TvxHTTP/Methods/Get.md), [`Head`](TvxHTTP/Methods/Head.md), [`LoadFromBytes`](TvxHTTP/Methods/LoadFromBytes.md), [`LoadFromFile`](TvxHTTP/Methods/LoadFromFile.md), [`LoadFromStream`](TvxHTTP/Methods/LoadFromStream.md), [`Options`](TvxHTTP/Methods/Options.md), [`Patch`](TvxHTTP/Methods/Patch.md), [`Post`](TvxHTTP/Methods/Post.md), [`Put`](TvxHTTP/Methods/Put.md) and [`Trace`](TvxHTTP/Methods/Trace.md). Native `Clear`, `ApplyHeaders`, internal Indy objects and the destructor are not registered as descendant pages.

#### Initial state

A newly constructed client has:

- HTTP/1.1 selected, redirects enabled and a 15-second connect timeout;
- Indy's default read timeout until changed;
- user agent `Mozilla/4.0 (compatible; Velox EDI)`;
- no authentication, `gtAuto` grant selection and automatic SSL type;
- a new empty header list, request stream and response stream; and
- header folding disabled.

Each instance receives a newly created cookie manager. Cookies can persist between calls on that same client, but the current cache factory does not copy them into a shared/persistent store.

#### Request lifecycle

Verb methods execute synchronously in the calling script thread. The shared terminal:

1. resolves explicit or operating-system proxy settings;
2. creates raw-wire intercept and SSL objects when locally managed;
3. clears the prior **response body**;
4. configures SSL and authentication;
5. applies stored headers;
6. calls Indy with the selected method and URL;
7. rewinds a captured response body to position zero; then
8. normally clears the pending request body, disconnects and flushes intercepted traffic in a `finally` block.

HTTP statuses such as 4xx and 5xx normally do not raise: Velox enables Indy's no-protocol-error-exception and error-content options so scripts can inspect [`Response`](TvxHTTP/Properties/Response.md). DNS, socket, TLS, proxy, stream and other operational failures can still raise after normal finalisation.

There are two state exceptions to understand. Authentication can fail and return before the request `try/finally`, leaving pending body/connection/intercept state intact. Also, only response content is explicitly cleared before a call; if a failure occurs before Indy receives a new response, status and header getters can still reflect older Indy metadata. Treat response metadata as current only after a completed request.

#### Security and operational boundaries

The reviewed local SSL path leaves Indy's/OpenSSL's peer `VerifyMode` empty and configures no root-certificate file, so certificate verification is not enabled. It also assigns a callback that always returns `True`, ignoring the library's `AOk`, depth and error values; if a verification callback is enabled by another configuration, that handler accepts failures. Consequently this helper does **not** reject an invalid HTTPS peer certificate and must not be treated as server-identity verification. Restrict destinations and compensate at the network/application design level until the product implementation is corrected.

The class accepts caller-supplied URLs and can reach resources available to the Velox process, so configuration/script authority is also outbound-network authority. Apply an allowlist where URLs can be influenced by external data; do not permit loopback, link-local, metadata-service or internal-management targets unintentionally.

When HTTP communication logging is enabled, the intercept buffers and stores decoded raw request/response traffic with the URL. Headers, tokens, credentials, query values and bodies can enter logs. This also duplicates whole messages in memory and attempts text decoding even for binary traffic.

The object is mutable and not thread-safe. Do not share one instance across concurrent scripts. Headers, cookies, authentication settings and response metadata persist across sequential calls unless explicitly changed; the pending request body is normally one-shot.

**External references**

- [RFC 9110 section 9: Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9)
- [RFC 9110 section 15: Status Codes](https://www.rfc-editor.org/rfc/rfc9110#section-15)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)
- [Embarcadero DocWiki: `TMemoryStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream)

<small>Created 2026-07-15</small>
