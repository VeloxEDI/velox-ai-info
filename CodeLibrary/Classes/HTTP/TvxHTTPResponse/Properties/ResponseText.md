---
title: ResponseText
description: Returns the complete received HTTP status line, including protocol version, status code and reason phrase.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, status-line, reason-phrase]
---

```Delphi
property ResponseText: String read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://api.example.invalid/v1/status');
  Value := Http.Response.ResponseText;
  { Example result: HTTP/1.1 200 OK }
end;
```

### Usage

`ResponseText` returns the complete received HTTP status line, including protocol version, status code and reason phrase.

### Additional Technical Info
`ResponseText` returns Indy's complete response status-line string as read from the connection, for example `HTTP/1.1 200 OK`. Despite the property name, it is not just `OK` or another reason phrase. [`ResponseCode`](ResponseCode.md) is parsed from this same string.

Reason phrases are optional in modern HTTP and are not authoritative. Servers and intermediaries can supply empty, nonstandard, localised or attacker-controlled text. Use the integer code and endpoint contract for program decisions; use this full line only for bounded diagnostics after sanitising it for the destination log or message.

For informational responses Indy keeps reading until the terminal response, except that status 101 is terminal. Followed redirects and in-process authentication replace intermediate status lines, so the property normally describes the final response that produced the captured body.

Velox does not clear this Indy field before starting an attempt. If failure occurs after response-content clearing but before a new status line, `Content` is empty while this property can still contain the preceding line. If proxy/intercept/SSL object initialisation fails before that clear, the old body can remain too. A transport/parsing failure can leave either previous or newly read text depending on its timing.

**External references**

- [RFC 9112 section 4: Status line](https://www.rfc-editor.org/rfc/rfc9112#section-4)
- [RFC 9110 section 15: Status codes](https://www.rfc-editor.org/rfc/rfc9110#section-15)

<small>Created 2026-07-20</small>
