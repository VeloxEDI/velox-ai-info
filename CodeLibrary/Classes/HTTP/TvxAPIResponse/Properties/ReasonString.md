---
title: ReasonString
description: Gets or sets the HTTP/1.1 status-line reason text, which StatusCode replaces and Velox normally clears after action execution.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, reason-phrase, status, security]
---

```Delphi
property ReasonString: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
    Value := Response.ReasonString
  else
    Value := '';
end;
```

### Usage

`ReasonString` gets or sets the HTTP/1.1 status-line reason text, which StatusCode replaces and Velox normally clears after action execution.

### Additional Technical Info
`ReasonString` maps to Indy's `ResponseText`, the optional text written after the numeric status in the HTTP/1.1 status line. It is not the response body; use [`ContentString`](ContentString.md) for a client-facing error document.

Every [`StatusCode`](StatusCode.md) assignment immediately replaces this value with Indy's known phrase or `Unknown Response Code`. If code controls both, set the status first and reason second. In the normal Velox GET/POST action lifecycle, however, the REST manager assigns the configured result status after the script has finished and then explicitly clears ReasonString. A script assignment is therefore normally not final.

Fatal action exceptions are a notable current exception: Velox assigns the raw `Exception.Message` as the reason. Timeout and manager failures use fixed messages. Avoid raising exceptions containing credentials, customer data, SQL, file paths or other internals because current fatal handling can expose that text in the status line.

Reason phrases are optional in HTTP/1.1 and absent from HTTP/2/HTTP/3 framing; clients must rely on the numeric status and representation. Do not encode business logic into the text. Indy writes it without Velox control-character validation, so never include CR/LF or untrusted text that could corrupt headers/status framing.

Reads expose mutable pre-finalisation state only. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.ReasonString`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.ReasonString)
- [RFC 9112 section 4: Status Line](https://www.rfc-editor.org/rfc/rfc9112#section-4)
- [RFC 9110 section 15: Status Codes](https://www.rfc-editor.org/rfc/rfc9110#section-15)

<small>Created 2026-07-15</small>
