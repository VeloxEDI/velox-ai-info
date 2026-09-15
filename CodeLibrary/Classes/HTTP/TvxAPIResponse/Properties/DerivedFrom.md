---
title: DerivedFrom
description: Reads or writes a transient legacy Derived-From value that automatic response sending clears before transmission.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, derived-from, legacy, quirk]
---

```Delphi
property DerivedFrom: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    { Only for a private contract that still defines this obsolete field. }
    Response.SetCustomHeader('Derived-From', 'example-source-2');
    Value := Response.CustomHeaders.Values['Derived-From'];
  end;
end;
```

### Usage

`DerivedFrom` reads or writes a transient legacy Derived-From value that automatic response sending clears before transmission.

### Additional Technical Info
`DerivedFrom` maps to `FResponseInfo.CustomHeaders.Values['Derived-From']`. Like [`Allow`](Allow.md), this is the wrong collection for the bridge's automatic-send sequence: immediately before sending, `MoveCookiesAndCustomHeaders` clears that Indy list and replaces it with WebBroker [`CustomHeaders`](CustomHeaders.md).

An assignment can therefore be read back during the action but is normally absent from the wire. If a private compatibility contract genuinely requires the old field, use [`SetCustomHeader`](../Methods/SetCustomHeader.md) as shown in the example.

Derived-From appeared in obsolete HTTP/1.1 material and is not a current HTTP semantic field. Velox does not interpret it as data lineage, content negotiation, cache validation or an audit relationship. Modern designs should carry provenance in a documented application representation/field rather than assume generic clients understand this value.

No syntax, URI, version or control-character validation occurs. Do not put internal paths, identifiers or untrusted text into a public field without a specific disclosure/encoding policy. An empty direct value removes only the transient entry. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.DerivedFrom`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.DerivedFrom)
- [Historic RFC 2068 section 14.15: Derived-From](https://www.rfc-editor.org/rfc/rfc2068#section-14.15)
- [RFC 9110: current HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110)

<small>Created 2026-07-15</small>
