---
title: CustomHeaders
description: Exposes the live persistent WebBroker response-field list that replaces Indy's custom fields immediately before sending.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, custom-headers, tstrings, ownership]
---

```Delphi
property CustomHeaders: TStrings read write;
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

`CustomHeaders` exposes the live persistent WebBroker response-field list that replaces Velox's custom fields immediately before sending.

### Additional Technical Info
`CustomHeaders` returns WebBroker's actual host-owned `TStringList`. Each normal entry uses `Name=Value` because the list's name/value separator is `=`. Mutating the returned object immediately changes shared pre-send response state; do not free, retain or replace the object reference.

Writing another `TStrings` value calls `Assign`: it copies the source list's contents and relevant settings into the existing host list rather than transferring ownership of the source object. This includes `NameValueSeparator`/options; a `TStringList` source also copies case-sensitivity, sorting and duplicate policy. A non-default separator can stop `Name=Value` entries being parsed as intended, case-sensitive lookup can create differently cased duplicates, and sorting/duplicate rules can alter order or reject data. Prefer `SetCustomHeader` over assigning a configured list. A nil/incompatible source can raise. The response still owns its original list.

This is the authoritative persistent additional-field store for the current bridge. Immediately before automatic send, the bridge:

1. clears Indy's existing custom-header list;
2. iterates every WebBroker `CustomHeaders` entry; and
3. adds each entry whose parsed name and value are both nonempty to Indy.

That replacement explains why direct [`Allow`](Allow.md), `DerivedFrom` and `Title` property assignments can disappear. Use [`SetCustomHeader`](../Methods/SetCustomHeader.md) or `CustomHeaders.Values[Name]` when such a field must survive.

`SetCustomHeader` provides single-name replacement/removal semantics and should be preferred for ordinary fields. Direct `Add('Name=Value')` can retain duplicate names/order in the WebBroker list, and the bridge can transfer those as repeated fields. Only use repetition when the specific HTTP field permits it; generic comma-combination rules do not apply safely to every field.

The list validates neither HTTP token syntax nor field semantics. Reject CR, LF and other control characters; do not add secrets, `Content-Length`, `Transfer-Encoding`, `Connection`, `Host` or ad-hoc `Set-Cookie` fields. Use the response's content/cookie interfaces and let Indy create framing. Empty values are dropped during transfer rather than emitted as empty fields.

List iteration/mutation can raise and is not thread-safe. Automatic sending uses its state only after the action completes. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.CustomHeaders`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.CustomHeaders)
- [Embarcadero DocWiki: `System.Classes.TStrings.Assign`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStrings.Assign)
- [RFC 9110 section 5: Fields](https://www.rfc-editor.org/rfc/rfc9110#section-5)
- [RFC 9112 section 6: Message Body and Transfer Codings](https://www.rfc-editor.org/rfc/rfc9112#section-6)

<small>Created 2026-07-15</small>
