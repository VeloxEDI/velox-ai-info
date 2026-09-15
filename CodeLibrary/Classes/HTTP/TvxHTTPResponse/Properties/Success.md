---
title: Success
description: Returns true exactly when the current parsed response code is in the 2xx status family.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, success, status]
---

```Delphi
property Success: Boolean read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Post('https://api.example.invalid/v1/order');
  if Http.Response.Success then
    Value := Http.Response.ContentAsUTF8
  else
    Value := 'HTTP ' + IntToStr(Http.Response.ResponseCode) + ': ' +
      Http.Response.ResponseText;
end;
```

### Usage

`Success` returns true exactly when the current parsed response code is in the 2xx status family.

### Additional Technical Info
`Success` is implemented exactly as:

```Delphi
(FHTTP.Response.ResponseCode div 100) = 2
```

It returns `True` for integer response codes 200 through 299 and `False` for every other normal status family and Indy's `-1` parse sentinel. It includes statuses such as 204 that deliberately carry no response body.

The property is a status-family convenience, not proof that the integration succeeded. It does not confirm that content exists, that a JSON/XML payload is valid, that a business transaction was accepted, that an asynchronous operation later completed, or that workflow persistence occurred. Apply the endpoint's exact accepted-code and representation contract; some APIs use an expected 3xx, 4xx or multi-status response as part of a valid flow.

HTTP error statuses normally remain inspectable because Velox retains protocol-error content. Operational exceptions can still raise before this property is safely current. If a caller catches such an exception, do not use `Success` as the outcome: the underlying code may be stale or partially refreshed.

When redirects are followed, the predicate applies to the final target status. Velox clears `Content` only after proxy/intercept/SSL object initialisation and never clears the Indy status here, so a later setup failure can expose the prior predicate beside an empty body; an earlier initialiser failure can retain the old body as well.

**External references**

- [RFC 9110 section 15.3: Successful 2xx responses](https://www.rfc-editor.org/rfc/rfc9110#section-15.3)
- [IANA HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)

<small>Created 2026-07-20</small>
