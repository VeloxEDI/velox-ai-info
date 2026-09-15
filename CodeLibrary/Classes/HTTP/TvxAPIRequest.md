---
title: TvxAPIRequest
description: Exposes the current host-owned Indy/WebBroker API request through 36 read-only scripting properties.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, api, request, headers, body]
---

```Delphi
TvxAPIRequest = class(TObject)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request = nil then
    Value := 'No API request'
  else
    Value := Request.Method + ' ' + Request.PathInfo;
end;
```

### Usage

`TvxAPIRequest` exposes the current Velox-provided Velox/WebBroker API request through 36 read-only scripting properties.

### Additional Technical Info
`TvxAPIRequest` is Velox's script-facing wrapper over the inbound Indy `TIdHTTPAppRequest`/WebBroker `TWebRequest`.

The declaration above is the manufactured PascalScript inheritance, not the complete native Delphi ancestry. Velox intentionally attaches the script class directly to `TObject` and registers selected native properties through read helpers, avoiding exposure of the WebBroker/Indy ancestor tree.

**Acquisition, ownership and lifetime**

Use the [`Request`](../../Variables/Helpers/Request.md) helper. It obtains the most recent `TvxActionMan.Request` reference on every call. API handling assigns that object from the waiting web execution; the web thread remains paused while the action thread uses it. The request, request-info object, cookies and content stream remain owned by the host.

Test `Request` for `nil`, copy any required scalar results during the current event, and never free or retain the object. It is not a detached request snapshot and is not safe for concurrent/asynchronous use.

The script class inherits `TObject.Create` and `Free` from its hidden ancestor. Do **not** call `TvxAPIRequest.Create`: the script-visible no-argument constructor allocates zero-initialised fields but bypasses the native request constructor, which requires thread, request-info and response-info arguments. The resulting object is not a valid request, so even an apparently simple property read can dereference a nil internal reference. `Free` is only for such caller-created objects, not for `Request`.

**Exposed surface**

All 36 class-specific members are read-only properties; there are no class-specific script methods:

| Area | Properties |
|---|---|
| Request/target | `HTTPMethod`, `Method`, `ProtocolVersion`, `URL`, `PathInfo`, `RawPathInfo`, `PathTranslated`, `ScriptName`, `Query`, `QueryFields` |
| Headers | `Accept`, `Authorization`, `CacheControl`, `Connection`, `ContentEncoding`, `ContentType`, `ContentVersion`, `Cookie`, `CookieFields`, `Date`, `DerivedFrom`, `Expires`, `From`, `Host`, `IfModifiedSince`, `Referer`, `Title`, `UserAgent` |
| Body | `Content`, `ContentLength`, `ContentString`, `RawContent` |
| Network/server | `RemoteAddr`, `RemoteHost`, `RemoteIP`, `ServerPort` |

The first alphabetic property group begins with [`Accept`](TvxAPIRequest/Properties/Accept.md). Each page documents the actual Velox/Indy bridge mapping, which can differ materially from the generic WebBroker property description.

**Request construction and body state**

The native constructor first stores the live Indy thread/request/response references, lets `TWebRequest` derive its method type, builds a cached cookie string list, and then assigns `FContentStream`. When Indy supplied a post stream, the request borrows it; otherwise the bridge creates and owns a `TStringStream` from form or unparsed parameters. `Content` returns this actual stream, while `RawContent` and `ContentString` make whole-body copies and restore the stream position after their raw read.

The stream and cached lists are mutable even though the properties returning them are read-only. Changing their contents or position changes shared request state visible to later code. Scalar header properties do not validate syntax, authenticate a user, decompress content or enforce a maximum body size.

**Security and implementation cautions**

- Treat every value as untrusted. `Authorization` is merely a header string; it is not proof that Velox or Indy authenticated it.
- Cookies and authorization values can grant access. Do not log them, place them in error text or persist them without a specific protected design.
- `RemoteAddr`/`RemoteIP`, `Host`, `From`, forwarded headers and URL fields are not trustworthy identity/authority inputs by themselves, especially behind proxies.
- The bridge exposes legacy mappings. In particular, `Cookie` always returns empty and `ContentVersion` looks for `CONTENT_VERSION` rather than the conventional hyphenated field.
- `ContentLength` reports current stream size and narrows native Int64 to script `Integer`; very large bodies can raise a range error.
- Whole-body properties allocate attacker-controlled sizes. Enforce request limits outside or before script-level materialisation.

**Related entries**

- [`Request`](../../Variables/Helpers/Request.md) documents the host helper and `nil` behavior.
- [`TvxAPIResponse`](TvxAPIResponse.md) is the paired live response object.
- [`TvxHTTP`](TvxHTTP.md) is the outbound client and has different ownership and state.

**External references**

- [Embarcadero DocWiki: `Web.HTTPApp.TWebRequest`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest)
- [Embarcadero DocWiki: `System.TObject.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TObject.Create)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)

<small>Created 2026-07-15</small>
