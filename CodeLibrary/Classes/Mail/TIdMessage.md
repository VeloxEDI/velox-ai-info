---
title: TIdMessage
description: Represents the current mutable Internet message, owning its headers, addresses, preamble, MIME parts and boundary state across parsing and generation.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, mail, email, mime, message]
---

```Delphi
TIdMessage = class(TComponent)
```

### Example

```Delphi
procedure ReadCurrentSubject(var Value: Variant);
var
  Message: TIdMessage;
begin
  Message := Email;
  if Message <> nil then
    Value := Message.Subject
  else
    Value := '';
end;
```

### Usage

`TIdMessage` represents the current mutable Internet message, owning its headers, addresses, preamble, MIME parts and boundary state across parsing and generation.

### Additional Technical Info
`TIdMessage` is the mutable message model used by Velox mail-processing scripts. Native Indy derives it from `TIdBaseComponent`; the PascalScript importer deliberately presents `TComponent` as its ancestor. The class combines two representations that are synchronized only by explicit methods:

- the registered-but-ungenerated `Headers` property holds raw message header lines.
- typed properties such as Subject, recipients, ContentType and Date hold parsed/editable state.
- [`ProcessHeaders`](TIdMessage/Methods/ProcessHeaders.md) projects raw headers into typed properties.
- [`GenerateHeader`](TIdMessage/Methods/GenerateHeader.md) builds output headers from the typed state, retained raw headers and the registered-but-ungenerated `ExtraHeaders` property.

The normal script entry point is [`Email`](../../Variables/Helpers/Email.md). It returns the message for the current action or nil when no email is assigned. Velox deliberately resolves the current instance each time because transports replace it between executions. Treat the result as borrowed: do not free it and do not cache it across records, actions, events or script executions. The importer registers no `TIdMessage`-specific constructor; if an available inherited constructor is deliberately used, that separate instance is caller-owned and must be freed. Most integration scripts should use `Email`.

The message owns its Body/NewsGroups string lists, address items/lists, raw and generated header lists, [`MessageParts`](TIdMessage/Properties/MessageParts.md) collection and [`MIMEBoundary`](TIdMessage/Properties/MIMEBoundary.md) stack. Getters return borrowed child objects; clearing/removing content or destroying/replacing the message invalidates affected references.

[`Clear`](TIdMessage/Methods/Clear.md) resets the main header/body model but deliberately retains some configuration and state. [`AddHeader`](TIdMessage/Methods/AddHeader.md) appends raw text only. Load/save methods synchronously parse/serialize the object and are documented separately.

Several methods mutate more state than their names might suggest. Header generation recounts parts, resolves default encoding, normalizes transfer encodings, creates a new MIME boundary, infers ContentType and replaces generated-header state. Header processing can replace address lists, normalize values, change attachment encoder selection and accumulate boundary entries if called repeatedly without clearing.

The object and every owned collection are mutable and unsynchronized. Do not share one instance between threads or mutate it while a transport is parsing/sending. Operations are not transactional; exceptions can leave partially reset, parsed or generated state.

The source-reviewed example safely reads the current borrowed object and was not runtime-tested.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - message model and lifecycle baseline; Velox uses a modified implementation.
- [RFC 5322](https://www.rfc-editor.org/rfc/rfc5322.html) - Internet message syntax and semantics.
- [RFC 2045](https://www.rfc-editor.org/rfc/rfc2045.html) - MIME message headers and transfer encodings.
- [Embarcadero DocWiki: `System.Classes.TComponent`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent) - script-visible Delphi ancestor and ownership context.
- [Free Pascal: `TComponent`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.html) - compatible component model reference; Velox uses Delphi/Indy.

<small>Created 2026-07-15</small>
