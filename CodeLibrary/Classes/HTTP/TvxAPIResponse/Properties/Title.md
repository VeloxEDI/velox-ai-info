---
title: Title
description: Reads or writes a transient legacy Title value that the response bridge clears before automatic transmission.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, title, legacy, quirk]
---

```Delphi
property Title: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    { Only for a private contract that still defines this obsolete field. }
    Response.SetCustomHeader('Title', 'Example representation');
    Value := Response.CustomHeaders.Values['Title'];
  end;
end;
```

### Usage

Reads or writes a transient legacy Title value that the response bridge clears before automatic transmission.

### Additional Technical Info
`Title` maps to `FResponseInfo.CustomHeaders.Values['Title']`. Automatic sending clears that Indy list and replaces it with WebBroker [`CustomHeaders`](CustomHeaders.md), so a direct assignment can read back during the action yet normally does not reach the client.

If a private legacy contract requires the field, use [`SetCustomHeader`](../Methods/SetCustomHeader.md). This is the same bridge defect as [`Allow`](Allow.md) and [`DerivedFrom`](DerivedFrom.md).

Title appeared in obsolete HTTP/1.1 material and is not a current general HTTP field. It does not set an HTML `<title>`, a JSON property, filename, content label or Docusaurus title. Put human-readable representation metadata inside the declared content format or a current documented application field.

No encoding or control-character validation occurs. Do not expose sensitive/internal labels, and never include CR/LF or untrusted text. An empty direct value removes only the transient entry. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.Title`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.Title)
- [Historic RFC 2068 section 14.46: Title](https://www.rfc-editor.org/rfc/rfc2068#section-14.46)
- [RFC 9110: current HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110)

<small>Created 2026-07-15</small>
