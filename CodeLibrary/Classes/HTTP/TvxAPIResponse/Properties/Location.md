---
title: Location
description: Gets or sets the transmitted Location field without selecting or preserving a redirect or creation status code.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, location, redirect, uri]
---

```Delphi
property Location: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    Response.Location := '/status/example-123';
    { Configure the action's final outcome status consistently. }
    Value := Response.Location;
  end;
end;
```

### Usage

Gets or sets the transmitted Location field without selecting or preserving a redirect or creation status code.

### Additional Technical Info
`Location` maps directly to Indy's standard response field. A nonempty value is emitted as `Location`; an empty value omits it. Unlike Indy's separate redirect method, this property does not set `StatusCode` to 302 and performs no immediate send.

Use it with a final status whose semantics define Location—for example, a suitable 3xx redirect or 201 Created. In a normal Velox API action, the REST manager selects `StatusCode` after the script completes from the configured success/client/server outcome. A direct status assignment made by the script can be overwritten, so the action's configured result code must agree with this field.

The value is not parsed, resolved, normalised or checked against the request origin. HTTP permits a URI reference, which can be relative, but clients handle different statuses and schemes according to their own rules. Do not copy an untrusted Host, path or query directly into an absolute redirect: validate the destination against an allowlist to prevent open redirects and field injection.

Setting Location does not create a resource, alter routing, add a response body or prove that a client followed the reference. Avoid CR/LF and other control characters. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.Location`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.Location)
- [RFC 9110 section 10.2.2: Location](https://www.rfc-editor.org/rfc/rfc9110#section-10.2.2)
- [RFC 9110 section 15.4: Redirection](https://www.rfc-editor.org/rfc/rfc9110#section-15.4)

<small>Created 2026-07-15</small>
