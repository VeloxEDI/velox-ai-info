---
title: RemoteAddr
description: Returns the immediate Indy socket peer IP and does not resolve forwarded client addresses or authenticate the peer.
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, remote-address, peer-ip, proxy]
---

```Delphi
property RemoteAddr: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.RemoteAddr
  else
    Value := '';
end;
```

### Usage

`RemoteAddr` returns the immediate Velox socket peer IP and does not resolve forwarded client addresses or authenticate the peer.

### Additional Technical Info
`RemoteAddr` returns `TIdHTTPRequestInfo.RemoteIP`, captured from the connection socket binding's `PeerIP`. It normally identifies the immediate TCP peer seen by the Velox HTTP server and contains no port. If the socket/binding is unavailable, Indy stores an empty string.

[`RemoteIP`](RemoteIP.md) returns the same field in this bridge. Neither property examines `Forwarded`, `X-Forwarded-For` or similar headers. Behind a reverse proxy/load balancer the value is normally that proxy's address, not the originating client. Without a proxy it is still a network address, not an authenticated user or device.

Do not use the string alone for authorisation, tenant identity, nonrepudiation or security-rate-limit evasion protection. If originating addresses are required, configure a known trusted-proxy boundary that discards inbound spoofed forwarding fields and derives one canonical client address; keep the immediate peer as separate audit context.

Parse with an IP-address parser rather than string prefixes, account for IPv4/IPv6 forms and define privacy/retention controls. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.RemoteAddr`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.RemoteAddr)
- [RFC 9110 section 7.6: Message Forwarding](https://www.rfc-editor.org/rfc/rfc9110#section-7.6)
- [RFC 7239: Forwarded HTTP Extension](https://www.rfc-editor.org/rfc/rfc7239)

<small>Created 2026-07-15</small>
