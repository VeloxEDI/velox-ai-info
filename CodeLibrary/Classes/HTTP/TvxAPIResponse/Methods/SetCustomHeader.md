---
title: SetCustomHeader
description: Adds, replaces or removes one persistent custom response field in the WebBroker header list used at send time.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, header, custom]
---

```Delphi
procedure SetCustomHeader(const Name, Value: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    Response.SetCustomHeader('X-Request-Reference', 'example-123');
    Value := Response.CustomHeaders.Values['X-Request-Reference'];
  end;
end;
```

### Usage

`SetCustomHeader` adds, replaces or removes one persistent custom response field in the WebBroker header list used at send time.

### Additional Technical Info
`SetCustomHeader` calls the inherited WebBroker method on the current [`TvxAPIResponse`](../../TvxAPIResponse.md). It performs this exact list operation:

```Delphi
CustomHeaders.Values[Name] := Value;
```

If `Name` is not present and `Value` is nonempty, the method adds a `Name=Value` entry. If the name exists, it replaces the first matching value. The newly constructed host `TStringList` is case-insensitive by default, but assigning another `TStringList` through [`CustomHeaders`](../Properties/CustomHeaders.md) can copy its case-sensitivity and other list settings; do not change those defaults for an HTTP field list. Supplying an empty value removes the matching entry rather than preserving a field with an empty value.

The method updates WebBroker's persistent [`CustomHeaders`](../Properties/CustomHeaders.md), not the final wire header block immediately. During automatic send, the bridge clears Indy's current custom-header collection and adds each nonempty named value from this list. This makes the method the reliable route for fields such as `Allow` that would otherwise be written to the cleared Indy collection.

`Name` and `Value` receive no Velox business validation. Use a valid HTTP field name, prohibit CR/LF and other control characters, and format the value according to that field's specification. Do not use it to set hop-by-hop framing fields, `Content-Length`, `Transfer-Encoding`, `Connection`, `Host`, or a second `Set-Cookie`; use the corresponding supported response property/cookie method and let the server calculate framing.

Repeated calls with the same name replace rather than create a general multi-valued field. Direct list manipulation can create duplicate `Name=Value` lines, but that is appropriate only when the field specification permits combination/repetition and the downstream Indy conversion has been understood. Empty names or values are discarded by the Indy transfer.

The response and list are host-owned and mutable. The call can raise for a nil/invalid response, allocation failure or list error. It performs no network I/O by itself and does not prove that an intermediary/client will retain the field.

**External references**

- [Embarcadero DocWiki: `TWebResponse.SetCustomHeader`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.SetCustomHeader)
- [Embarcadero DocWiki: `TWebResponse.CustomHeaders`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.CustomHeaders)
- [RFC 9110 section 5: Fields](https://www.rfc-editor.org/rfc/rfc9110#section-5)
- [RFC 9112 section 6: Message Body and Transfer Codings](https://www.rfc-editor.org/rfc/rfc9112#section-6)

<small>Created 2026-07-15</small>
