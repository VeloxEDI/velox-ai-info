---
title: FromList
description: Holds all message authors projected into the From header, while the From property aliases and can create its first item.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, from, authors, header, collection]
---

```Delphi
property FromList: TIdEmailAddressList read write;
```

### Example

```Delphi
procedure ReplaceMessageAuthors;
var
  Msg: TIdMessage;
  Author: TIdEmailAddressItem;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.FromList.Clear;
  Author := Msg.FromList.Add;
  Author.Text := 'Velox Integration <integration@example.invalid>';
end;
```

### Usage

`FromList` holds all message authors projected into the From header, while the From property aliases and can create its first item.

### Additional Technical Info
`FromList` is the live [`TIdEMailAddressList`](../../TIdEMailAddressList.md) owned by the message for one or more authors. The returned collection and items are borrowed. The message frees them; `Clear`, replacement assignment and owner destruction invalidate item references.

Assigning another list calls `FromList.Assign(value)` into the existing collection. Direct methods mutate it in place. Nil assignment is not guarded, and the permissive address parser/formatter does not validate mailbox existence or strict conformance.

[`From`](From.md) aliases item zero. Its getter adds a blank item if this list is empty, so reads through the convenience property are observable mutations. Clearing FromList invalidates a previously borrowed From reference; the next From read creates a new object.

[`GenerateHeader`](../Methods/GenerateHeader.md) encodes every list item into the `From` header. Its special missing-name mode does not use a temporary value: it assigns each blank `Name := Address` on the live item before encoding. Header generation therefore mutates the collection permanently. [`ProcessHeaders`](../Methods/ProcessHeaders.md) destructively parses the raw field into the list and MIME-decodes names. `ClearHeader` empties it.

In the default SMTP path, the envelope sender falls back to the Address of the first From item only when [`Sender`](Sender.md) is blank. Additional From authors never become envelope senders. RFC-style multi-author messages normally require a distinct Sender field; Velox/Indy does not enforce that rule for you.

[`NoEncode`](NoEncode.md) writes raw Headers and ignores FromList changes unless raw `From` is also updated. Apply header-length and author-count limits to external data.

The example uses a fictional `.invalid` address and was not executed or sent.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - owned list, alias and header projection.
- [Indy upstream: `IdCoderHeader.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdCoderHeader.pas) - list encoding and display-name decoding.
- [RFC 5322 section 3.6.2](https://www.rfc-editor.org/rfc/rfc5322#section-3.6.2) - From/Sender originator requirements.

<small>Created 2026-07-15</small>
