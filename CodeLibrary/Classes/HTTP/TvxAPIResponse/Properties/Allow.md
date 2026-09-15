---
title: Allow
description: Reads or writes a transient Allow value that the Indy bridge clears unless it is also stored as a custom header.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, allow, methods, quirk]
---

```Delphi
property Allow: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    { Use the persistent list so Allow survives automatic sending. }
    Response.SetCustomHeader('Allow', 'GET, POST');
    Value := Response.CustomHeaders.Values['Allow'];
  end;
end;
```

### Usage

Reads or writes a transient Allow value that the Velox bridge clears unless it is also stored as a custom header.

### Additional Technical Info
`Allow` maps to `FResponseInfo.CustomHeaders.Values['Allow']` in the native Indy response. The setter and getter therefore appear to work during the action: assigning a value and immediately reading it returns that value.

However, Velox uses `TIdHTTPAppResponse.SendResponse`. Immediately before automatic sending, `MoveCookiesAndCustomHeaders` clears `FResponseInfo.CustomHeaders` and repopulates it exclusively from WebBroker's separate [`CustomHeaders`](CustomHeaders.md) list. A value written only through this property is consequently discarded and is normally absent from the wire response.

To transmit the field, use [`SetCustomHeader`](../Methods/SetCustomHeader.md):

```Delphi
Response.SetCustomHeader('Allow', 'GET, POST');
```

Use a comma-separated list of method tokens actually supported by the target resource. `Allow` is required in a 405 response and can also be supplied in successful responses where its semantics apply; setting it does not enable/disable a Velox endpoint or enforce method routing. The property does not validate, uppercase or deduplicate method names.

An empty value removes the current transient Indy entry. Reads reflect current mutable pre-send state only. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `Web.HTTPApp.TWebResponse.Allow`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.Allow)
- [RFC 9110 section 10.2.1: Allow](https://www.rfc-editor.org/rfc/rfc9110#section-10.2.1)
- [RFC 9110 section 15.5.6: 405 Method Not Allowed](https://www.rfc-editor.org/rfc/rfc9110#section-15.5.6)

<small>Created 2026-07-15</small>
