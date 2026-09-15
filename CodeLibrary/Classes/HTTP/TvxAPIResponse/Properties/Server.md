---
title: Server
description: Gets or sets the transmitted Server product field, which Velox API Service initialises with its product name and current Velox version.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, server, disclosure, header]
---

```Delphi
property Server: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    Response.Server := 'Velox API';
    Value := Response.Server;
  end;
end;
```

### Usage

Gets or sets the transmitted Server product field, which Velox API Service initialises with its product name and current Velox version.

### Additional Technical Info
`Server` maps directly to Indy's standard response field. A nonempty value is emitted as `Server`; an empty value omits it.

Before request handling, the Indy HTTP server copies its configured `ServerSoftware` into the response. Production Velox API Service configures that value as `Velox API Services v.` followed by the current Velox version; the product test host uses `Velox API Services v.(TEST)`. Unless a script replaces or clears it, the response therefore discloses the deployed Velox version rather than Indy's default software token. That can aid diagnostics but also exposes version information unnecessarily. Set a deliberate stable product token or clear it according to deployment policy.

The field is self-reported metadata. It does not authenticate the Velox service, identify the Windows host, select software behavior or provide a trustworthy version endpoint. Intermediaries can remove or replace it.

No token/comment syntax or control-character validation occurs. Avoid detailed build paths, internal component inventories, credentials and untrusted text. Do not also add a `Server` entry through [`CustomHeaders`](CustomHeaders.md), which could create conflicting/duplicate fields. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.Server`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.Server)
- [RFC 9110 section 10.2.4: Server](https://www.rfc-editor.org/rfc/rfc9110#section-10.2.4)

<small>Created 2026-07-15</small>
