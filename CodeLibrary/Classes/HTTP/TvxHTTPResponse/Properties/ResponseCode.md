---
title: ResponseCode
description: Returns the integer status parsed from the terminal HTTP response status line.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, status-code]
---

```Delphi
property ResponseCode: Integer read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://api.example.invalid/v1/order/DEMO-1001');
  case Http.Response.ResponseCode of
    200: Value := Http.Response.ContentAsUTF8;
    404: Value := 'Order was not found';
  else
    Value := 'HTTP ' + IntToStr(Http.Response.ResponseCode);
  end;
end;
```

### Usage

`ResponseCode` returns the integer status parsed from Velox HTTP response status line.

### Additional Technical Info
`ResponseCode` returns Indy's integer status parsed from [`ResponseText`](ResponseText.md), the complete response status line. Normal values follow the three-digit HTTP status-code registry. If parsing cannot obtain a number, Indy uses `-1`.

Indy consumes interim 1xx responses until it reaches a non-informational response, except that `101 Switching Protocols` is final. When redirects are enabled and followed, this property describes the final target rather than the discarded redirect response. If redirects are not followed or the redirect limit is reached normally, the visible result can be a 3xx status.

Velox suppresses Indy's usual HTTP protocol exception for error status codes and asks it to keep protocol-error content. A completed 4xx or 5xx response therefore normally returns to the script with this property and the body available for inspection. Network, TLS, proxy, parsing and stream failures remain operational exceptions.

Do not treat a particular code as sufficient business validation. Apply the endpoint's documented contract, validate the representation and distinguish retryable status responses from operations whose delivery outcome is uncertain.

The value is live Indy state. Velox clears [`Content`](Content.md) only after proxy/intercept/SSL object initialisation, so a later authentication/setup failure before a new status line can leave the previous response code beside an empty body; an earlier initialiser failure can preserve the body too. An exception during the exchange can also leave partially updated state.

**External references**

- [RFC 9110 section 15: Status codes](https://www.rfc-editor.org/rfc/rfc9110#section-15)
- [IANA HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)

<small>Created 2026-07-20</small>
