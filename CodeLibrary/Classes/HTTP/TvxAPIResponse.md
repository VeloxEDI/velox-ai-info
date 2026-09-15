---
title: TvxAPIResponse
description: Exposes the current host-owned API response through 21 writable properties and two WebBroker response methods.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, api, response, headers, body]
---

```Delphi
TvxAPIResponse = class(TObject)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    Response.ContentType := 'application/json; charset=utf-8';
    Response.ContentString := '{"result":"accepted"}';
    Value := True;
  end
  else
    Value := False;
end;
```

### Usage

`TvxAPIResponse` exposes the current Velox-provided API response through 21 writable properties and two WebBroker response methods.

### Additional Technical Info
`TvxAPIResponse` is Velox's script-facing wrapper over the live Indy `TIdHTTPAppResponse`/WebBroker `TWebResponse` used to answer the current inbound API call.

The declaration above is manufactured PascalScript inheritance, not the complete native Delphi ancestry. Velox attaches the script class directly to `TObject` and manually registers selected native response members so the WebBroker/Indy ancestor tree is not exposed.

**Acquisition, ownership and lifetime**

Obtain the object from [`Response`](../../Variables/Helpers/Response.md). The helper reads the current action's externally assigned reference on every call. The web thread waits while the Velox action runs, but the response, its Indy request/response information, custom-header list, cookie collection and content stream remain coordinated by the host.

Test `Response` for `nil`; it can be unavailable outside an API execution. Use the object only during the synchronous execution, never free it, and do not cache it for another event or asynchronous task.

Do **not** call `TvxAPIResponse.Create`. The script class inherits the visible no-argument `TObject.Create`, but a valid native object requires request, context, request-info and response-info arguments. The no-argument constructor bypasses that initialisation and leaves required fields nil; ordinary property access can then fail. Inherited `Free` is not for the host object.

**Initial and final state**

Native creation builds the WebBroker custom-header and cookie collections, sets `FreeContentStream` true, sets `StatusCode` to 200, and initialises `Date`, `Expires` and `LastModified` to `-1`. Velox assigns a new response memory stream when the REST action thread receives the object.

After the action finishes, Velox normally chooses the configured success/client-error status from the action log and clears `ReasonString`; fatal exceptions and timeouts receive their own status/reason. A script's earlier `StatusCode` or `ReasonString` assignment can therefore be overwritten. Other response content and headers proceed to WebBroker/Indy automatic sending.

Automatic sending resets native `ContentLength` to `-1`, transfers cookies and the persistent [`CustomHeaders`](TvxAPIResponse/Properties/CustomHeaders.md) list into Indy, applies a default content type when needed, writes headers/body, clears text content and releases the content stream. Do not expect changes made after the action finishes to participate.

**Exposed surface**

All 21 properties are read/write:

| Area | Properties |
|---|---|
| Status/protocol | `ReasonString`, `StatusCode`, `Version` |
| Standard response fields | `Allow`, `Date`, `Expires`, `LastModified`, `Location`, `Realm`, `Server`, `WWWAuthenticate` |
| Content | `Content`, `ContentEncoding`, `ContentLength`, `ContentString`, `ContentType`, `ContentVersion`, `DerivedFrom`, `FreeContentStream`, `Title` |
| Additional fields | `CustomHeaders` |

The two class-specific methods registered to scripts are:

```Delphi
procedure SetCustomHeader(const Name, Value: string);
procedure SetCookieField(Values: TStrings; const ADomain, APath: string;
  AExpires: TDateTime; ASecure: Boolean; AHttpOnly: Boolean = False);
```

[`SetCustomHeader`](TvxAPIResponse/Methods/SetCustomHeader.md) has a generated member page. `SetCookieField` is usable in the current compiler/runtime but is absent from the generated Markdown inventory and `_Index.json`; the missing page is a generator defect tracked as future work, not a reason to hide the callable here.

`SetCookieField` adds one cookie per input list entry, applying the same domain, path, expiry, Secure and HttpOnly settings. The script signature cannot set SameSite. WebBroker obtains each cookie's value through `Values[Name]`, so duplicate names can create multiple cookies containing the first matching value. The bridge URL-encodes cookie names and values at send time. Treat cookie values as sensitive, use appropriate scope/security attributes, and do not rely on this method for modern SameSite policy.

**Body selection and ownership**

[`ContentString`](TvxAPIResponse/Properties/ContentString.md) maps to native string content, while [`Content`](TvxAPIResponse/Properties/Content.md) maps to `ContentStream`. Contrary to the generic WebBroker documentation, this particular Indy bridge checks nonempty text first: nonempty `ContentString` wins over `Content`; otherwise the stream is sent from position zero. If neither is supplied for an ordinary body-bearing response, Indy generates a small HTML status body. HEAD, 1xx, 204 and 304 responses do not send a body.

Stream assignment can transfer ownership and free a previously assigned stream. Text encoding depends on the Indy charset derived from [`ContentType`](TvxAPIResponse/Properties/ContentType.md). Content type, content encoding and character encoding are independent; declaring a content coding does not transform the bytes.

**Header and security cautions**

- Validate all body data, media types, status values, redirect locations, authentication challenges, cookie attributes and field values before assignment.
- Never place CR, LF, secrets, internal paths or exception details in response field names/values.
- Use `SetCustomHeader`/`CustomHeaders` for additional transmitted fields. Some legacy property mappings—notably `Allow`, `DerivedFrom` and `Title`—write directly to an Indy list that the bridge clears before automatic send.
- Do not set a `Content-Length` field manually in `CustomHeaders`; let automatic send calculate it from the selected encoded text or stream.
- Response objects and their lists/streams are mutable and not documented as thread-safe.

**Related entries**

- [`Response`](../../Variables/Helpers/Response.md) documents helper availability and lifetime.
- [`TvxAPIRequest`](TvxAPIRequest.md) exposes the paired inbound request.
- [`TvxHTTPResponse`](TvxHTTPResponse.md) is an outbound-client result with different ownership and behavior.

**External references**

- [Embarcadero DocWiki: `Web.HTTPApp.TWebResponse`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse)
- [Embarcadero DocWiki: `TWebResponse.SetCookieField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.SetCookieField)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 6265: HTTP State Management Mechanism](https://www.rfc-editor.org/rfc/rfc6265)

<small>Created 2026-07-15</small>
