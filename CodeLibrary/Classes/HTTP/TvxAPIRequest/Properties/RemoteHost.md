---
title: RemoteHost
description: Returns the first caller-controlled REMOTE_HOST underscore header and performs no reverse-DNS lookup.
sidebar_position: 30
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, remote-host, header, spoofing, quirk]
---

```Delphi
property RemoteHost: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.RemoteHost
  else
    Value := '';
end;
```

### Usage

`RemoteHost` returns the first caller-controlled REMOTE_HOST underscore header and performs no reverse-DNS lookup.

### Additional Technical Info
Contrary to the generic WebBroker description, this Indy bridge does not perform a reverse-DNS lookup. It performs a case-insensitive raw-header lookup for the literal field name `REMOTE_HOST` containing an underscore and returns the first selected value.

Normal HTTP clients do not send this legacy CGI-style field, so the property is usually empty. If a client does send it, the text is caller-controlled. It does not prove a DNS name, relationship to [`RemoteAddr`](RemoteAddr.md), successful forward-confirmed reverse DNS, TLS identity or authenticated caller.

Never use `RemoteHost` for access control, tenant routing or trusted logging labels. If reverse DNS is genuinely needed for diagnostics, perform it in a controlled network service with timeouts/caching and treat the result as advisory; authenticate identities using credentials/certificates, not DNS names.

Because underscore-bearing headers can be handled inconsistently by proxies, configure the front boundary to reject/strip unexpected fields. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.RemoteHost`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.RemoteHost)
- [RFC 9110 section 5.1: Field Names](https://www.rfc-editor.org/rfc/rfc9110#section-5.1)

<small>Created 2026-07-15</small>
