---
title: URL
description: Always returns an empty string because the Indy WebBroker bridge deliberately maps URL to the application root.
sidebar_position: 35
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, url, empty, quirk]
---

```Delphi
property URL: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { URL is empty; use the configured authority plus RawPathInfo/Query deliberately. }
  if Request <> nil then
    Value := Request.RawPathInfo
  else
    Value := '';
end;
```

### Usage

Always returns an empty string because the Velox WebBroker bridge deliberately maps URL to the application root.

### Additional Technical Info
`URL` is hard-coded to `''` by `TIdHTTPAppRequest.GetStringVariable`; the source describes this as the root, matching its ISAPI-compatibility expectation. It does not return the request target, absolute URI, [`PathInfo`](PathInfo.md), [`RawPathInfo`](RawPathInfo.md), [`Host`](Host.md) or [`Query`](Query.md).

Empty is therefore the only normal result and does not mean the client targeted an empty URI. Do not use `URL` for routing, signatures, callback validation, canonical links or redirects.

If a flow must reconstruct an external URL, use trusted deployment configuration for scheme/public authority/base path and combine only validated target components. Request Host/forwarding fields are caller or proxy metadata and the bridge's Host/ServerPort parsers have IPv6 and authority limitations. Avoid reconstructing a value for security checks when the original canonical target is required.

The generic Embarcadero page describes the abstract WebBroker property, not this Indy implementation. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.URL`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.URL)
- [RFC 9110 section 7.1: Determining the target resource](https://www.rfc-editor.org/rfc/rfc9110#section-7.1)
- [RFC 3986: URI Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986)

<small>Created 2026-07-15</small>
