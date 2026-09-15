---
title: ContentVersion
description: Looks up the legacy nonstandard raw-header key CONTENT_VERSION, so a normal Content-Version field remains invisible.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, content-version, legacy, quirk]
---

```Delphi
property ContentVersion: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.ContentVersion
  else
    Value := '';
end;
```

### Usage

`ContentVersion` looks up the legacy nonstandard raw-header key CONTENT_VERSION, so a normal Content-Version field remains invisible.

### Additional Technical Info
`ContentVersion` is a legacy WebBroker-compatible property with a bridge-specific defect. `TIdHTTPAppRequest.GetStringVariable` queries Indy's raw headers using the exact field name `CONTENT_VERSION` (underscore). Header-name comparison is case-insensitive, but underscore and hyphen are different characters. A conventional `Content-Version` field therefore does not populate this property.

Only a nonstandard incoming field literally named `CONTENT_VERSION` can normally produce a value. The returned text is unparsed and selected from the first matching field. Velox does not interpret it, perform version negotiation or connect it to [`ProtocolVersion`](ProtocolVersion.md).

Do not use this property for new API versioning. Use an explicitly governed endpoint path, media-type parameter or purpose-built header and document its validation/fallback rules. Existing scripts that rely on `ContentVersion` should be reviewed because an empty result is expected for the normal hyphenated header.

Treat any nonempty value as untrusted. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`. The Embarcadero page describes the intended `Content-Version` abstraction; the underscore lookup is the actual Velox/Indy implementation quirk.

**External references**

- [Embarcadero DocWiki: `TWebRequest.ContentVersion`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.ContentVersion)
- [RFC 9110 section 5.1: Field Names](https://www.rfc-editor.org/rfc/rfc9110#section-5.1)

<small>Created 2026-07-15</small>
