---
title: TvxHTTPResponse
description: Represents the client-owned outbound HTTP response facade with a buffered final body and live Indy response metadata.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, status, headers, body]
---

```Delphi
TvxHTTPResponse = class(TObject)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Http: TVxHTTP;
  Response: TvxHTTPResponse;
begin
  Http := TVxHTTP.Create(Log);
  try
    Http.Get('https://api.example.invalid/v1/status');
    Response := Http.Response;  // Borrowed; Http owns it.
    if Response.Success then
      Value := Response.ContentAsUTF8
    else
      Value := IntToStr(Response.ResponseCode) + ': ' +
        Response.ResponseText;
  finally
    Http.Free;
  end;
end;
```

### Usage

`TvxHTTPResponse` represents the client-owned outbound HTTP response facade with a buffered final body and live Velox response metadata.

### Additional Technical Info
`TvxHTTPResponse` is the script-visible view of an outbound [`TVxHTTP`](TvxHTTP.md) client's most recent response. A client creates one facade, returns that same object from `Http.Response` throughout its lifetime and frees it when the client is destroyed. Treat the reference as borrowed: do not call inherited `Free` on it and do not retain it after its owning client has been freed.

Do not construct this class directly. Its native constructor requires the associated Indy client, but that constructor is not registered for scripts; the inherited no-argument constructor visible through `TObject` cannot initialise the required HTTP reference or content stream. The native `Clear` routine is also not registered.

The facade combines two kinds of state:

- [`Content`](TvxHTTPResponse/Properties/Content.md) is an owned `TMemoryStream` containing the captured terminal response body. The body is fully buffered in process memory and remains mutable through the stream and six `ContentAs...` properties.
- status, typed content metadata and raw headers are live views of the associated Indy's response object. They are not copied into an immutable snapshot.

`SendRequest` first initialises the proxy, intercept and local SSL objects, then clears only `Content`, and then configures SSL/authentication and applies headers. A failure in one of the three initialisers can therefore leave the entire preceding response, including its body. A later setup failure leaves the body empty while metadata can still describe the previous request. An exception during transfer can leave partially refreshed state. Use response values only after the request has reached its expected terminal, and record enough request context in workflow logs to identify that terminal.

Indy normally discards intermediate authentication and followed-redirect bodies and exposes the final response. Velox retains 4xx and 5xx bodies instead of turning those statuses into protocol exceptions, so check [`Success`](TvxHTTPResponse/Properties/Success.md) or [`ResponseCode`](TvxHTTPResponse/Properties/ResponseCode.md). DNS, socket, TLS, parsing and stream failures can still raise.

The visible properties are:

- body: [`Content`](TvxHTTPResponse/Properties/Content.md), [`ContentAsString`](TvxHTTPResponse/Properties/ContentAsString.md), [`ContentAsANSI`](TvxHTTPResponse/Properties/ContentAsANSI.md), [`ContentAsASCII`](TvxHTTPResponse/Properties/ContentAsASCII.md), [`ContentAsUTF8`](TvxHTTPResponse/Properties/ContentAsUTF8.md), [`ContentAsUTF16`](TvxHTTPResponse/Properties/ContentAsUTF16.md) and [`ContentAsUTF16BE`](TvxHTTPResponse/Properties/ContentAsUTF16BE.md);
- representation metadata: [`ContentLength`](TvxHTTPResponse/Properties/ContentLength.md), [`ContentType`](TvxHTTPResponse/Properties/ContentType.md), [`ContentEncoding`](TvxHTTPResponse/Properties/ContentEncoding.md), [`ContentDisposition`](TvxHTTPResponse/Properties/ContentDisposition.md) and [`Filename`](TvxHTTPResponse/Properties/Filename.md);
- raw fields: [`HeaderCount`](TvxHTTPResponse/Properties/HeaderCount.md), [`Header`](TvxHTTPResponse/Properties/Header.md), [`HeaderByIndex`](TvxHTTPResponse/Properties/HeaderByIndex.md), [`HeaderName`](TvxHTTPResponse/Properties/HeaderName.md) and [`HeaderValue`](TvxHTTPResponse/Properties/HeaderValue.md); and
- terminal status: `Success`, `ResponseCode` and [`ResponseText`](TvxHTTPResponse/Properties/ResponseText.md).

All body bytes, status text, filenames and headers are untrusted remote input. Bound expected response sizes outside this class, validate formats before parsing, never use `Filename` directly as a filesystem path and avoid logging secrets returned in headers or content.

**External references**

- [RFC 9110 section 6: Message abstraction](https://www.rfc-editor.org/rfc/rfc9110#section-6)
- [RFC 9110 section 15: Status codes](https://www.rfc-editor.org/rfc/rfc9110#section-15)
- [Embarcadero `TMemoryStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream)
- [Free Pascal `TMemoryStream`](https://www.freepascal.org/docs-html/rtl/classes/tmemorystream.html) - compatible stream context; Velox executes Delphi and Indy implementations.

<small>Created 2026-07-20</small>
