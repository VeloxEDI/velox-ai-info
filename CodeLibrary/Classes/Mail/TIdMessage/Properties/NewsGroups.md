---
title: NewsGroups
description: Exposes the message-owned list projected to and from the comma-separated Newsgroups header without validating group names or destinations.
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, nntp, newsgroups, header, tstrings]
---

```Delphi
property NewsGroups: TStrings read write;
```

### Example

```Delphi
procedure AddressNewsMessage;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.NewsGroups.Clear;
  Msg.NewsGroups.Add('example.technical');
  Msg.NewsGroups.Add('example.integrations');
end;
```

### Usage

Exposes the message-owned list projected to and from the comma-separated Newsgroups header without validating group names or destinations.

### Additional Technical Info
`NewsGroups` returns the live `TStringList` owned by the message. Use it for NNTP newsgroup names; it is independent of email recipient collections. The message creates and frees the list, so scripts must not free it or retain it beyond the message/action lifetime.

Assigning another `TStrings` calls `NewsGroups.Assign(value)` and copies its content into the existing owned list. It does not replace the object. Direct `Clear`, `Add`, `Delete`, `Text` and indexed operations mutate the live list. A nil assignment is not guarded.

[`GenerateHeader`](../Methods/GenerateHeader.md) serializes the list through `CommaText` into the `Newsgroups` header. [`ProcessHeaders`](../Methods/ProcessHeaders.md) parses that header back into the list with Indy's comma-separated helper. Whitespace and quoting are therefore interpreted as list syntax rather than preserved byte-for-byte.

No setter validates NNTP group grammar, server availability, access rights, duplicates or whether the current Velox action actually posts news. Empty input clears the generated header value. [`ClearHeader`](../Methods/ClearHeader.md) clears the list, and loading replaces it from parsed headers after the message-wide clear.

Treat values as externally supplied addressing data: validate them against the intended server/policy before use and avoid logging confidential routing details unnecessarily. The example is fictional and source-reviewed; it did not connect to an NNTP server.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - owned list, header projection and parsing.
- [Embarcadero DocWiki: `System.Classes.TStrings.CommaText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.CommaText) - Delphi comma-list serialization.
- [Free Pascal: `TStrings.CommaText`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.commatext.html) - compatible list reference; Velox uses Delphi.
- [RFC 5536, Newsgroups header](https://www.rfc-editor.org/rfc/rfc5536#section-3.1.4) - Internet news message field semantics.

<small>Created 2026-07-15</small>
