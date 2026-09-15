---
title: RemoteIP
description: Returns the same immediate Indy socket peer IP as RemoteAddr, without processing trusted-proxy forwarding metadata.
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, remote-ip, peer, proxy]
---

```Delphi
property RemoteIP: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.RemoteIP
  else
    Value := '';
end;
```

### Usage

`RemoteIP` returns the same immediate Velox socket peer IP as RemoteAddr, without processing trusted-proxy forwarding metadata.

### Additional Technical Info
`RemoteIP` returns `TIdHTTPRequestInfo.RemoteIP`, which Indy captures from the active socket binding's `PeerIP`. [`RemoteAddr`](RemoteAddr.md) maps to that same field, so the two properties are aliases in this implementation. Empty is possible if socket/binding state was unavailable.

The value identifies the immediate network peer, not necessarily the original client. A reverse proxy/load balancer makes its own address the peer. Velox does not consume `Forwarded`/`X-Forwarded-For` here, and scripts must not start trusting those caller-set headers independently.

Use a centrally configured trusted-proxy policy if origin IP is operationally required. Preserve both canonical origin and immediate peer, validate address syntax, and understand that IP addresses can be shared, reassigned or translated. They do not authenticate a person/tenant and should not be the only abuse or authorisation control.

Treat addresses as potentially personal data when logging or retaining them. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.RemoteIP`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.RemoteIP)
- [RFC 7239: Forwarded HTTP Extension](https://www.rfc-editor.org/rfc/rfc7239)

<small>Created 2026-07-15</small>
