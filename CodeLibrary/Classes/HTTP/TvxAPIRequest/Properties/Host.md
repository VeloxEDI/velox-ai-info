---
title: Host
description: Returns Indy's request authority truncated before the first colon, stripping normal ports but corrupting bracketed IPv6 hosts.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, host, authority, ipv6, security]
---

```Delphi
property Host: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.Host
  else
    Value := '';
end;
```

### Usage

Returns Velox's request authority truncated before the first colon, stripping normal ports but corrupting bracketed IPv6 hosts.

### Additional Technical Info
Indy initially selects the `Host` request-header value and can fall back to the host parsed from an absolute-form request target when that header value is empty. The WebBroker bridge then returns everything before the **first** colon using `Fetch(Value, ':', False)`.

For a normal `example.test:8443`, this returns `example.test`; read [`ServerPort`](ServerPort.md) separately for the bridge's port result. The algorithm is not IPv6-aware: `[2001:db8::1]:8443` returns only `[`. It also performs no lowercasing, trailing-dot removal, IDNA conversion, allowed-host validation or proxy authority reconciliation.

Treat Host as untrusted routing metadata. Never use it alone to select filesystem paths, credentials, tenants, redirect destinations or privileged configuration. Validate against an explicit allow-list after standards-aware authority parsing, and configure trusted reverse proxies to reject conflicting/malformed authority information before Velox.

Empty or malformed values remain possible. The property describes the bridge's selected/truncated text, not a verified DNS name or the actual local server interface. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Host`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Host)
- [RFC 9110 section 7.2: Host and :authority](https://www.rfc-editor.org/rfc/rfc9110#section-7.2)
- [RFC 3986 section 3.2.2: Host](https://www.rfc-editor.org/rfc/rfc3986#section-3.2.2)

<small>Created 2026-07-15</small>
