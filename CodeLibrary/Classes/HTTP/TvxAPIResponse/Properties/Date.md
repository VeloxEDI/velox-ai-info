---
title: Date
description: Gets or sets the response origination time as a timezone-free UTC TDateTime, with nonpositive values replaced by current time when sent.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, date, utc, timestamp]
---

```Delphi
property Date: TDateTime read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    { Let the server generate the actual send time. }
    Response.Date := -1;
    Value := Response.Date;
  end;
end;
```

### Usage

Gets or sets the response origination time as a timezone-free UTC TDateTime, with nonpositive values replaced by current time when sent.

### Additional Technical Info
`Date` represents the HTTP response origination time. The valid native response constructor initialises it to `-1`.

This Indy bridge differs from generic WebBroker documentation: the script-facing `TDateTime` is treated as UTC. A setter converts the supplied UTC value to the server's local time for Indy; a getter converts Indy's local value back to UTC. The `TDateTime` itself contains no timezone marker, so callers must maintain that convention explicitly. The special value `-1` passes through without conversion.

When headers are written, any native Date value `<= 0` is replaced with the server's current local `Now`, then formatted as an HTTP date in GMT. `-1` is the reliable request for automatic send-time dating. Other values, including zero, are converted to local time first; near the `TDateTime` epoch that conversion can make zero positive on a server east of UTC and emit an ancient 1899 date instead. A script read occurs before the later send-time replacement and can still return `-1`.

Positive explicit dates are accepted without checking whether they are sensible, current or monotonic. Daylight-saving conversion and the timezone-free representation can make ambiguous local clock transitions unsuitable for exact archival identity. Prefer automatic dating unless the endpoint has a specific source-backed reason to reproduce another origin time.

The property does not set caching, expiry or [`LastModified`](LastModified.md), and assignment performs no I/O. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.Date`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.Date)
- [Embarcadero DocWiki: `System.TDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TDateTime)
- [RFC 9110 section 6.6.1: Date](https://www.rfc-editor.org/rfc/rfc9110#section-6.6.1)

<small>Created 2026-07-15</small>
