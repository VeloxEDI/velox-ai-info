---
title: LastModified
description: Gets or sets a UTC representation-modification time, emitting Last-Modified only for an effective positive native value.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, last-modified, utc, cache]
---

```Delphi
property LastModified: TDateTime read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    { Omit unless the representation has a reliable modification time. }
    Response.LastModified := -1;
    Value := Response.LastModified;
  end;
end;
```

### Usage

`LastModified` gets or sets a UTC representation-modification time, emitting Last-Modified only for an effective positive Velox value.

### Additional Technical Info
`LastModified` supplies metadata for when the selected representation was last changed. The valid response constructor initialises it to `-1`.

The script value is treated as UTC by this bridge. Set converts UTC to server-local time for Indy; get converts the stored local value to UTC. `-1` is preserved and reliably omits the field. Indy emits only a stored local value greater than zero; because other values are converted first, zero can become positive east of UTC and emit an ancient 1899 date.

Set the property only from a reliable source modification time for the exact response representation. It does not compare [`Request.IfModifiedSince`](../../TvxAPIRequest/Properties/IfModifiedSince.md), automatically produce 304, generate an ETag or stop the body. Conditional handling and validator precedence must be implemented as a coherent endpoint policy.

HTTP dates have one-second granularity, while `TDateTime` can hold fractions below a second; clients/caches can therefore observe a rounded value. The timezone-free UTC convention and local conversion can be ambiguous around daylight-saving transitions. Assignment accepts any representable value without checking chronology.

Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.LastModified`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.LastModified)
- [RFC 9110 section 8.8.2: Last-Modified](https://www.rfc-editor.org/rfc/rfc9110#section-8.8.2)
- [RFC 9110 section 13.1.3: If-Modified-Since](https://www.rfc-editor.org/rfc/rfc9110#section-13.1.3)

<small>Created 2026-07-15</small>
