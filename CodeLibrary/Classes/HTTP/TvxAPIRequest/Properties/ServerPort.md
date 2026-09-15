---
title: ServerPort
description: Parses text after the first colon in Host or falls back to the local socket port, returning -1 for malformed suffixes and IPv6.
sidebar_position: 33
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, server-port, host, ipv6, authority]
---

```Delphi
property ServerPort: Integer read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.ServerPort
  else
    Value := -1;
end;
```

### Usage

`ServerPort` parses text after the first colon in Host or falls back to the local socket port, returning -1 for malformed suffixes and IPv6.

### Additional Technical Info
The Indy bridge starts with `FRequestInfo.Host`, removes everything through the first colon and examines the remainder. If no remainder exists (no colon or an empty suffix), it uses the active connection socket binding's local port. Otherwise it converts the entire suffix through `StrToInt64Def(..., -1)` and Velox exposes the result as script `Integer`.

Examples:

| Selected Host | Result |
|---|---|
| `example.test:8443` | `8443` |
| `example.test` | local binding port |
| `example.test:` | local binding port |
| `example.test:not-a-port` | `-1` |
| `[2001:db8::1]:8443` | `-1` because parsing starts after the first IPv6 colon |

The value before the colon comes from caller-controlled authority text. The parser does not enforce the valid TCP range `0..65535`; any signed 32-bit number is returned, including negative values. A syntactically valid Int64 outside the scripting Integer range raises `ERangeError` during the Velox property-helper assignment rather than returning `-1`. A numeric supplied port can also differ from the actual listening/public port, and a reverse proxy can terminate on another external port. Use server/proxy deployment configuration for authoritative URL generation and allow-list decisions, not this property alone.

Normal TCP ports fit the exposed Integer, but `-1` is an error sentinel and must not be treated as a port. [`Host`](Host.md) has the matching first-colon IPv6 defect. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.ServerPort`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.ServerPort)
- [RFC 3986 section 3.2.3: Port](https://www.rfc-editor.org/rfc/rfc3986#section-3.2.3)
- [RFC 9110 section 7.2: Host and :authority](https://www.rfc-editor.org/rfc/rfc9110#section-7.2)

<small>Created 2026-07-15</small>
