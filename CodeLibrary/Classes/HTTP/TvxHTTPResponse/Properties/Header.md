---
title: Header
description: Looks up the first response field by case-insensitive name and returns its unfolded value.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, header, fields]
---

```Delphi
property Header[const aName: String]: String read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  RequestId: string;
begin
  Http.Get('https://api.example.invalid/v1/status');
  RequestId := Http.Response.Header['X-Request-Id'];
  if RequestId = '' then
    Value := 'No request identifier returned'
  else
    Value := RequestId;
end;
```

### Usage

`Header` looks up the first response field by case-insensitive name and returns its unfolded value.

### Additional Technical Info
`Header[name]` performs Indy's case-insensitive named lookup over the current response `RawHeaders` list and returns the first matching field value. The field name is supplied without the colon. Continuation lines are unfolded into the value. If the name is absent, the result is `''`; a present field with an empty value is indistinguishable from absence through this property.

Repeated fields are not returned as a collection and are not reliably comma-combined: this accessor selects only the first matching raw entry. Use [`HeaderCount`](HeaderCount.md) with [`HeaderByIndex`](HeaderByIndex.md) and [`HeaderName`](HeaderName.md) when every physical occurrence matters. Do not use `HeaderValue[index]` for that purpose because duplicate names resolve back to the first value.

Trailer fields appended after a chunked body are visible in `RawHeaders` and can therefore become available through this lookup. By contrast, typed properties such as `ContentType` are processed from the initial headers and are not recalculated after trailers.

Headers are live, untrusted metadata and can include credentials, cookies, personal data, malicious values or large input. Validate the expected syntax and bound downstream use. Avoid copying authorization and cookie fields into general logs.

After proxy/intercept/SSL initialisation Velox clears only the response body. If any later setup fails before Indy reads a new status line and headers, this lookup can still return a value from the previous response; an earlier initialiser failure can also leave the old body.

**External references**

- [RFC 9110 section 5: Fields](https://www.rfc-editor.org/rfc/rfc9110#section-5)
- [RFC 9110 section 5.1: Field names](https://www.rfc-editor.org/rfc/rfc9110#section-5.1)
- [RFC 9110 section 5.2: Field lines and combined values](https://www.rfc-editor.org/rfc/rfc9110#section-5.2)

<small>Created 2026-07-20</small>
