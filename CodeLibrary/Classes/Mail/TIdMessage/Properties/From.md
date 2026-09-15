---
title: From
description: Aliases the first FromList item and creates a blank item merely when read from an empty list, with SMTP sender fallback implications.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, from, author, alias, side-effect]
---

```Delphi
property From: TIdEmailAddressItem read write;
```

### Example

```Delphi
procedure SetMessageAuthor;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.From.Address := 'integration@example.invalid';
  Msg.From.Name := 'Velox Integration';
end;
```

### Usage

Aliases the first FromList item and creates a blank item merely when read from an empty list, with SMTP sender fallback implications.

### Additional Technical Info
`From` is an alias for the first item of [`FromList`](FromList.md), not a separately owned sender. It returns a borrowed [`TIdEMailAddressItem`](../../TIdEMailAddressItem.md) owned by that list.

#### Reading has a mutation side effect

If FromList is empty, the getter calls `FromList.Add` before returning item zero. Merely evaluating `Msg.From`, `Msg.From.Address` or `Msg.From.Text` changes `FromList.Count` from zero to one and creates a blank owned item. Code that uses an empty list as a state signal must account for this.

Assigning another address item calls `GetFrom.Assign(value)`: it creates item zero when necessary and copies only the source Address and Name. It does not replace the object. Nil assignment is not guarded.

[`GenerateHeader`](../Methods/GenerateHeader.md) encodes the entire FromList, not just this alias. For this header only, Indy's encoder handles a missing display name by assigning `Name := Address` **on the live item** before encoding. Generation therefore permanently changes blank-name author items and usually emits a quoted display name plus the same address. Multiple items can appear in `From`, while this property continues to expose only the first.

Indy's default SMTP path chooses `Sender.Address` for the MAIL FROM envelope; if blank, it reads `From.Address`. That fallback can trigger the blank-item side effect. Header author and SMTP envelope sender remain separate concepts, and custom send overloads can provide another envelope sender.

[`ProcessHeaders`](../Methods/ProcessHeaders.md) repopulates FromList from the raw `From` header and decodes display names. [`ClearHeader`](../Methods/ClearHeader.md) clears the whole list, invalidating a retained From item. [`NoEncode`](NoEncode.md) does not project changes into raw headers.

The example uses a reserved `.invalid` address and was source-reviewed only; it did not send mail.

**External references**

- [Indy upstream: `TIdMessage.GetFrom`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - first-item alias and read-side creation.
- [Indy upstream: `TIdSMTPBase.Send`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdSMTPBase.pas) - Sender-first envelope fallback.
- [RFC 5322 section 3.6.2](https://www.rfc-editor.org/rfc/rfc5322#section-3.6.2) - originator fields.
- [RFC 5321 section 3.3](https://www.rfc-editor.org/rfc/rfc5321#section-3.3) - envelope MAIL FROM context.

<small>Created 2026-07-15</small>
