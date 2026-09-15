---
title: UserAgent
description: Returns Indy's selected optional User-Agent request-header text without identifying or attesting the client software.
sidebar_position: 36
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, user-agent, client, metadata]
---

```Delphi
property UserAgent: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.UserAgent
  else
    Value := '';
end;
```

### Usage

`UserAgent` returns Velox's selected optional User-Agent request-header text without identifying or attesting the client software.

### Additional Technical Info
`UserAgent` returns the first `User-Agent` value selected by Indy's request-header processing. It is an unparsed optional string and can contain multiple product/comment tokens. Velox does not validate grammar, identify a vendor/version, check a signature or compare it to TLS/network behavior.

Any caller can omit or spoof the field. Do not use it for authentication, authorisation, tenant selection or a permanent compatibility guarantee. If an API must adapt to a known client capability, prefer explicit versioned protocol negotiation and schema rather than fragile substring detection.

For diagnostics/analytics, length-bound the value and treat it as potentially identifying personal/device data. Avoid high-cardinality unsanitised metric labels and prevent control characters from reaching logs. Empty means no selected value; duplicate fields are not combined by this getter.

The property is read-only live request metadata with no behavior side effect. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.UserAgent`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.UserAgent)
- [RFC 9110 section 10.1.5: User-Agent](https://www.rfc-editor.org/rfc/rfc9110#section-10.1.5)

<small>Created 2026-07-15</small>
