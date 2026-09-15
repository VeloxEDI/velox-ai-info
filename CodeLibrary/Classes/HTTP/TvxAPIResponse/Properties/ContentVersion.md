---
title: ContentVersion
description: Gets or sets the legacy Content-Version response field without interpreting or enforcing its application-specific value.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, content-version, legacy]
---

```Delphi
property ContentVersion: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    { Use only where a private API contract explicitly defines this field. }
    Response.ContentVersion := 'example-schema-2';
    Value := Response.ContentVersion;
  end;
end;
```

### Usage

`ContentVersion` gets or sets the legacy Content-Version response field without interpreting or enforcing its application-specific value.

### Additional Technical Info
`ContentVersion` maps directly to Indy's entity-header value. A nonempty value is emitted as `Content-Version`; an empty value omits the field.

The field is a legacy extension and is not defined by current HTTP semantics. Velox and Indy do not parse, compare, negotiate or enforce the value, and it does not select a [`ContentType`](ContentType.md), API schema, representation, deployment or protocol version. Its meaning exists only if the endpoint and client share an explicit application contract.

Prefer a standard registered response field, media-type parameter or versioned resource/API design where appropriate. Do not confuse this property with [`Version`](Version.md), which reflects the bridge's request protocol-version mapping, or with validators such as ETag that support standard conditional requests.

No syntax or control-character validation occurs. The response is host-owned and mutable; assignment performs no network I/O by itself. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.ContentVersion`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.ContentVersion)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)

<small>Created 2026-07-15</small>
