---
title: Version
description: Returns the inbound request version; writes are silently ignored, leak an exception object, and never change the hard-coded HTTP/1.1 response line.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, version, defect, memory-leak]
---

```Delphi
property Version: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
    Value := Response.Version
  else
    Value := '';
end;
```

### Usage

Returns the inbound request version; writes are silently ignored, leak an exception object, and never change the hard-coded HTTP/1.1 response line.

### Additional Technical Info
Despite its writable declaration and generic WebBroker name, this property does not control the Velox response protocol.

The getter returns `FRequestInfo.Version`, the protocol-version text from the inbound request information. It is effectively another view of [`Request.ProtocolVersion`](../../TvxAPIRequest/Properties/ProtocolVersion.md), subject to the same live request lifetime. It does not report a separately negotiated response version.

The setter contains a source defect. Its Version branch calls `EWBBInvalidStringVar.Create(...)` but omits `raise`, discards the new exception reference and performs no assignment. Each write is therefore silently ignored and leaks one exception object. Do not write this property, even repeatedly with its existing value.

Indy's server writer always emits a status line beginning `HTTP/1.1`, independently of this value. When the inbound request version is empty, the native response constructor itself attempts `Version := '1.0'`; that attempt is also ignored and leaks, though normal parsed requests have a version.

This property does not negotiate HTTP/2/HTTP/3, change connection behavior or validate version syntax. Use it only as read-only diagnostic request metadata and do not base security policy on it. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.Version`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.Version)
- [RFC 9112 section 2.3: HTTP Version](https://www.rfc-editor.org/rfc/rfc9112#section-2.3)
- [RFC 9112 section 4: Status Line](https://www.rfc-editor.org/rfc/rfc9112#section-4)

<small>Created 2026-07-15</small>
