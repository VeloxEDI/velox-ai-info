---
title: WWWAuthenticate
description: Gets or sets a CRLF-delimited list of authentication challenges that Indy emits as separate WWW-Authenticate fields.
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, www-authenticate, challenge, security]
---

```Delphi
property WWWAuthenticate: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    Response.Realm := '';
    Response.WWWAuthenticate := 'Bearer realm="Velox API"';
    { Configure the action's final outcome as 401. }
    Value := Response.WWWAuthenticate;
  end;
end;
```

### Usage

`WWWAuthenticate` gets or sets a CRLF-delimited list of authentication challenges that Velox emits as separate WWW-Authenticate fields.

### Additional Technical Info
`WWWAuthenticate` maps a script string to `FResponseInfo.WWWAuthenticate.Text`, where the native object is an Indy header list. Assigning the string parses line breaks into list entries; reading returns `TStrings.Text`, normally including CRLF separators and a trailing line break for nonempty content.

At header construction, Indy emits each nonempty entry as a separate `WWW-Authenticate` field. Use one complete challenge per line. A challenge itself can contain comma-separated authentication parameters, so a comma is not the delimiter between native list entries despite generic WebBroker wording.

This property alone does not change [`StatusCode`](StatusCode.md). With [`Realm`](Realm.md) empty, the action's final result must be 401 for a normal authentication challenge response. With Realm nonempty, Indy forces 401; an explicit challenge list wins over its generated Basic challenge, while Realm still causes the status/body side effects.

An empty string clears the explicit challenge list. No scheme, token68, quoted-string, realm or control-character validation occurs. Build challenges only from trusted configuration with scheme-specific encoding; never include credentials or concatenate attacker-controlled text. Malformed challenges can prevent clients authenticating, and exposing detailed error parameters can leak security information.

The field advertises how a client can authenticate; it does not authenticate or authorise the current request. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.WWWAuthenticate`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.WWWAuthenticate)
- [RFC 9110 section 11.6.1: WWW-Authenticate](https://www.rfc-editor.org/rfc/rfc9110#section-11.6.1)
- [RFC 9110 section 11.3: Challenge and Response](https://www.rfc-editor.org/rfc/rfc9110#section-11.3)
- [RFC 6750 section 3: Bearer Challenge](https://www.rfc-editor.org/rfc/rfc6750#section-3)

<small>Created 2026-07-15</small>
