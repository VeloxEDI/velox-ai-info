---
title: Header
description: Stages one persistent request-header value per name before Velox maps standard fields and transfers custom fields to Indy.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, header, metadata, security]
---

```Delphi
property Header[const aName: string]: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Header['Accept'] := 'application/json';
  Http.Header['Content-Type'] := 'application/json; charset=utf-8';
  Http.Header['X-Correlation-ID'] := 'DEMO-1001';
  Http.Content.Clear;
  Http.ContentAsUTF8 := '{"reference":"DEMO-1001"}';
  Http.Post('https://api.example.invalid/v1/messages');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

Stages one persistent request-header value per name before Velox maps standard fields and transfers custom fields to Velox.

### Additional Technical Info
`Header` is an indexed staging interface for outbound request fields. Assigning a value adds or replaces one entry in a retained `TStringList`; matching is case-insensitive in the current Delphi list. Reading returns the staged value only. It does not expose headers that Indy generates later, such as `Host`, `Content-Length`, cookies, proxy fields or authentication, and it returns `''` for both an absent name and an explicitly blank staged value.

Velox recognises 22 names and maps them to typed Indy request properties immediately before a request. All other names are transferred to `Request.CustomHeaders`.

| Recognised field | Indy property behavior |
|---|---|
| `Accept`, `Accept-Charset`, `Accept-Encoding`, `Accept-Language` | Request content-negotiation strings. |
| `From`, `Referer`, `User-Agent`, `Host`, `Proxy-Connection`, `Range` | Corresponding request strings. `Host` is later derived again from the URL. |
| `If-Modified-Since` | Parsed from an HTTP/GMT date into local `TDateTime` and assigned as `LastModified`. |
| `Cache-control`, `Connection`, `Pragma` | Corresponding control strings; name matching is case-insensitive. |
| `Content-Disposition`, `Content-Encoding`, `Content-Language`, `Content-Type`, `Content-Version` | Corresponding entity strings. |
| `Content-Length` | Converted through RTTI to the integer property, then later recalculated from the actual request stream. |
| `Date`, `Expires` | Parsed from HTTP/GMT date text into local `TDateTime`. |

Only one staged value is retained per field name. Reassigning the same name changes the first matching entry, so the property cannot intentionally represent repeated field lines. Do not join repeated values with commas unless that field's specification permits list combination.

Header state persists across calls, and there is a significant two-layer state quirk. If the staging list is non-empty, Velox clears Indy's custom headers and transfers the current entries, but it does not clear recognised standard properties that are absent from the new list. If the staging list is empty, `ApplyHeaders` returns immediately and clears nothing already applied to Indy. The native class has a `Clear` method that empties the staging list, but Pascal Script does not register it; even native use can leave standard and custom headers from the preceding request active in the underlying client.

For a recognised string field, staging an empty value sets its Indy property blank on the next application. Date fields are parsed, and `Content-Length` is converted to an integer before Indy recalculates it; invalid or blank typed values can instead enter the swallowed-error path. For custom fields, any non-empty staging list causes all previously applied custom fields to be cleared before current values are transferred; a blank custom value is then omitted because Indy's value setter deletes it. There is no script-facing bulk header clear. Overwrite or blank every staged name that must change, or use a fresh caller-owned HTTP client as the safest boundary between calls with materially different sensitive header sets.

Date conversion, integer conversion and custom-header transfer occur inside a broad exception handler. A failure is logged and swallowed after any earlier fields may already have changed; the HTTP request continues with partial or previous header state. `Host` and `Content-Length` values are not reliable override mechanisms because Indy prepares them from the parsed URL and complete source stream after Velox applies the list.

Velox does not validate field names or values for the HTTP token grammar, carriage returns or line feeds. Untrusted CR/LF input can create additional wire header lines when Indy serialises the list. Treat names and values as trusted configuration or strictly validate them before assignment. Header values, including `Authorization` and API keys, can also be captured by Velox raw HTTP request logging. Prefer the governed authentication properties for credentials and never log secrets unnecessarily.

[`HeaderFoldLength`](HeaderFoldLength.md) applies only to custom fields. Keep it zero: generated obsolete folding is forbidden for HTTP/1.1 requests and can be interpreted inconsistently by intermediaries.

**External references**

- [RFC 9110 section 5: Fields](https://www.rfc-editor.org/rfc/rfc9110#section-5)
- [RFC 9110 section 5.5: Field values](https://www.rfc-editor.org/rfc/rfc9110#section-5.5)
- [RFC 9112 section 5.2: Obsolete line folding](https://www.rfc-editor.org/rfc/rfc9112#section-5.2)

<small>Created 2026-07-15</small>
