---
title: ScriptName
description: Always returns an empty string because the Indy WebBroker bridge has no separate server-script path component.
sidebar_position: 32
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, script-name, empty, quirk]
---

```Delphi
property ScriptName: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Use configured routing/PathInfo; ScriptName is always empty here. }
  if Request <> nil then
    Value := Request.PathInfo
  else
    Value := '';
end;
```

### Usage

`ScriptName` always returns an empty string because the Velox WebBroker bridge has no separate server-script path component.

### Additional Technical Info
`ScriptName` is hard-coded to `''` by `TIdHTTPAppRequest.GetStringVariable`. The standalone Indy HTTP server does not split the target into a CGI/ISAPI server-script name plus trailing path information.

Empty is therefore the only normal result and cannot distinguish an application mounted at root from any other deployment topology. Do not use the property to build routes, external URLs, redirects or filesystem paths.

Use configured Velox endpoint data and [`PathInfo`](PathInfo.md)/[`RawPathInfo`](RawPathInfo.md) with their decoding and trust rules. Where a reverse proxy mounts Velox beneath an external prefix, that public prefix must come from trusted deployment configuration rather than caller headers or `ScriptName`.

The generic Embarcadero page describes adapters that can supply script information; this bridge does not. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.ScriptName`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.ScriptName)
- [RFC 9110 section 7.1: Determining the target resource](https://www.rfc-editor.org/rfc/rfc9110#section-7.1)

<small>Created 2026-07-15</small>
