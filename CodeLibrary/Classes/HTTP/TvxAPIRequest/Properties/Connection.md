---
title: Connection
description: Returns the first raw Connection header selected by Indy, without controlling socket persistence or end-to-end behavior.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, connection, hop-by-hop]
---

```Delphi
property Connection: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.Connection
  else
    Value := '';
end;
```

### Usage

Returns the first raw Connection header selected by Velox, without controlling socket persistence or end-to-end behaviour.

### Additional Technical Info
`Connection` returns the first `Connection` raw-header value selected case-insensitively by Indy. It is an unparsed string; duplicate fields are not combined by this getter.

`Connection` is hop-by-hop HTTP metadata. A proxy is expected to consume the nominated connection options before forwarding a message, so the value seen by Velox describes at most the immediately received hop. It is not an end-to-end client preference, caller identity, TLS-state indicator or durable record of how every intermediary handled the request.

Reading the property does not close, keep alive or otherwise control the socket. Connection persistence is managed by the HTTP server/Indy response path. Do not copy this value into forwarded requests or responses without standards-aware filtering, because nominated hop-by-hop field names must also be removed by intermediaries.

Treat the value as untrusted and possibly empty. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`; use server/network configuration and trusted proxy data rather than this string for operational connection decisions.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Connection`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Connection)
- [RFC 9110 section 7.6.1: Connection](https://www.rfc-editor.org/rfc/rfc9110#section-7.6.1)

<small>Created 2026-07-15</small>
