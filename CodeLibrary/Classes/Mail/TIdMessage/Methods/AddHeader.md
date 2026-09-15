---
title: AddHeader
description: Appends one raw line to the internal header list without parsing it, replacing typed properties or preventing duplicate field names.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, headers, add-header, raw]
---

```Delphi
procedure AddHeader(const AValue: string);
```

### Example

```Delphi
procedure AddCorrelationHeader;
var
  Message: TIdMessage;
begin
  Message := Email;
  if Message <> nil then
    Message.AddHeader('X-Velox-Correlation-ID: example-123');
end;
```

### Usage

`AddHeader` appends one raw header line. It does not parse the line, update the corresponding typed property or prevent duplicate header names.

### Additional Technical Info
`AddHeader` passes `AValue` directly to the message's internal `TIdHeaderList.Add`. Supply a complete raw header line, normally `Field-Name: field value`. The method does not split the name/value, MIME-decode the value, validate RFC grammar, prevent CR/LF content or reject a duplicate name.

Appending a raw line does not update Subject, recipients, ContentType, Date or other typed message properties. Call [`ProcessHeaders`](ProcessHeaders.md) only when you deliberately want the complete raw header list projected back into typed state; that method can replace many existing values and has its own normalization/failure rules.

[`GenerateHeader`](GenerateHeader.md) begins by copying the raw Headers list into its output list, then sets standard fields from typed properties. For a duplicate standard field, Indy's `Values[name]` setter changes/removes the first matching line while later duplicates can remain. Treat duplicates as deliberate protocol behavior, not as an override mechanism.

The header is stored in memory and the call is normally amortized O(1), but allocation can fail after earlier message edits. The list is message-owned and not thread-safe. Never include secrets in diagnostic/custom headers unless the recipient and retention policy explicitly permit them.

The source-reviewed example uses a fictional correlation value and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.AddHeader`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - direct list append implementation.
- [RFC 5322 section 2.2](https://www.rfc-editor.org/rfc/rfc5322.html#section-2.2) - header-field structure and field ordering.
- [Embarcadero DocWiki: `System.Classes.TStrings.Add`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Add) - terminal list operation.
- [Free Pascal: `TStrings.Add`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.add.html) - compatible core reference; Velox uses Delphi/Indy.

<small>Created 2026-07-15</small>
