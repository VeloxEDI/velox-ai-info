---
title: StatusCode
description: Gets or sets Indy's numeric response status, resetting its reason and potentially closing the connection, before Velox normally applies its configured outcome status.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, status-code, lifecycle, connection]
---

```Delphi
property StatusCode: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    Response.StatusCode := 202;
    { This is pre-finalisation; configure the action outcome to match. }
    Value := Response.StatusCode;
  end;
end;
```

### Usage

`StatusCode` gets or sets Velox's numeric response status, resetting its reason and potentially closing the connection, before Velox normally applies its configured outcome status.

### Additional Technical Info
`StatusCode` maps to Indy's `ResponseNo`. A valid response starts at 200. The setter accepts any script `Integer`; it does not enforce the HTTP three-digit range. Known codes select Indy's built-in [`ReasonString`](ReasonString.md), while every other value selects `Unknown Response Code`.

Setting 404 has an additional sticky side effect: Indy sets the connection to close. A later status assignment does not reset that flag, so a script can set 404, have Velox later replace it with success, yet still cause `Connection: close`.

In normal API actions the value is not under final script control. After execution, Velox assigns:

- GET: configured client-error status only for `flsError`; issues and other states use configured success;
- POST: configured client-error status for `flsIssue` or `flsError`; other states use configured success;
- fatal execution: configured server-error status when the action exists, otherwise 500; or
- manager/timeout failure: 500.

Normal configured outcomes then clear ReasonString. A nonempty [`Realm`](Realm.md) later forces 401 at header write. Configure action result codes consistently instead of relying on a transient assignment.

The final status affects body handling: Indy suppresses content for HEAD, all 1xx, 204 and 304 responses. It does not validate that Location, authentication challenges or body semantics agree with the code. Invalid negative/large values are written into the HTTP/1.1 status line and can produce malformed responses.

Assignment does not send immediately. Avoid deriving status directly from untrusted numeric input. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.StatusCode`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.StatusCode)
- [RFC 9110 section 15: Status Codes](https://www.rfc-editor.org/rfc/rfc9110#section-15)
- [RFC 9112 section 4: Status Line](https://www.rfc-editor.org/rfc/rfc9112#section-4)

<small>Created 2026-07-15</small>
