---
title: DerivedFrom
description: Returns the first unparsed legacy Derived-From header without applying resource-version or merge semantics.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, derived-from, legacy, version]
---

```Delphi
property DerivedFrom: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.DerivedFrom
  else
    Value := '';
end;
```

### Usage

`DerivedFrom` returns the first unparsed legacy Derived-From header without applying resource-version or merge semantics.

### Additional Technical Info
`DerivedFrom` performs a case-insensitive Indy raw-header lookup for `Derived-From` and returns the first selected value as text. Velox does not remove quotes, validate a version tag, connect it to [`ContentVersion`](ContentVersion.md), retrieve a base representation or perform a merge/conflict check.

The field came from an obsolete HTTP/1.1 specification for describing the resource version from which an entity had been derived. It is not part of current HTTP semantics. Most requests will return empty, and a nonempty value has only application-defined meaning unless a governed legacy protocol explicitly specifies it.

Do not use this property as an optimistic-concurrency control by itself. Prefer current validators such as ETag/`If-Match`, or an explicit signed application version field with server-side state comparison. Treat the value as untrusted and length-bound it before diagnostics or persistence.

Multiple physical fields are not combined by this getter. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`; reading the property has no versioning side effect.

**External references**

- [Embarcadero DocWiki: `TWebRequest.DerivedFrom`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.DerivedFrom)
- [RFC 2068 section 19.6.2.3: Derived-From (obsolete)](https://www.rfc-editor.org/rfc/rfc2068#section-19.6.2.3)
- [RFC 9110 section 13.1.1: If-Match](https://www.rfc-editor.org/rfc/rfc9110#section-13.1.1)

<small>Created 2026-07-15</small>
