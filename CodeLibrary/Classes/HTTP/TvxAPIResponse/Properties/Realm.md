---
title: Realm
description: Sets Indy's authentication realm, which forces status 401 at header write and supplies a Basic challenge when no explicit challenge list exists.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, authentication, realm, basic]
---

```Delphi
property Realm: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    Response.Realm := 'Velox API';
    Value := Response.Realm;
  end;
end;
```

### Usage

Sets Velox's authentication realm, which forces status 401 at header write and supplies a Basic challenge when no explicit challenge list exists.

### Additional Technical Info
`Realm` maps to Indy's `AuthRealm` and has active send-time behavior, not just metadata. When it is nonempty, `WriteHeader` forces `StatusCode := 401` after Velox's normal post-action status selection.

If neither [`ContentString`](ContentString.md) nor [`Content`](Content.md) is present, Indy also creates an HTML 401 status body and sets `text/html; charset=utf-8`. Existing text/stream content is retained, but the final status is still 401.

At header construction:

- if [`WWWAuthenticate`](WWWAuthenticate.md) contains one or more challenges, those entries are emitted and take precedence; or
- if that list is empty, Indy creates `WWW-Authenticate: Basic realm="<Realm>"`.

The realm is inserted into the quoted Basic challenge without application-level escaping. Never include a quote, backslash, CR/LF, control character, secret or attacker-controlled text. A realm identifies a protection space; it is not a credential, authorisation decision or login prompt, and setting it does not authenticate the caller.

Clear Realm to avoid the forced-401/Basic fallback. If a modern scheme such as Bearer is required without Basic fallback, leave Realm empty, set a complete [`WWWAuthenticate`](WWWAuthenticate.md) challenge and ensure the action's final status is 401. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.Realm`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.Realm)
- [RFC 9110 section 11.5: Protection Spaces](https://www.rfc-editor.org/rfc/rfc9110#section-11.5)
- [RFC 7617: Basic HTTP Authentication](https://www.rfc-editor.org/rfc/rfc7617)

<small>Created 2026-07-15</small>
