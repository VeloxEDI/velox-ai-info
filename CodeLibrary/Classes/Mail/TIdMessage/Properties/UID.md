---
title: UID
description: Stores the IMAP server's mailbox-scoped unique identifier as an unvalidated String separate from Message-ID and serialized content.
sidebar_position: 33
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, imap, uid, mailbox, identity]
---

```Delphi
property UID: String read write;
```

### Example

```Delphi
procedure LogMailboxIdentity;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  if Msg.UID <> '' then
    Log('Fetched IMAP UID: ' + Msg.UID);
end;
```

### Usage

`UID` stores the IMAP server's mailbox-scoped unique identifier as an unvalidated String separate from Message-ID and serialized content.

### Additional Technical Info
`UID` stores an IMAP unique identifier associated with a message in a selected mailbox. It is not the Internet message [`MsgId`](MsgId.md): the same message copied to another mailbox can have a different UID, while Message-ID normally remains part of the message content.

The property is a direct String field. Its setter performs no numeric, range, mailbox or UIDVALIDITY check. Empty means no UID is currently recorded. New and cleared messages have an empty value because [`ClearHeader`](../Methods/ClearHeader.md) resets it.

#### How it is populated and used

Indy's IMAP fetch/retrieve paths parse the server's `UID` response token and assign it to this property, often at the same time as [`Flags`](Flags.md). Some UID-based retrieve paths fall back to the caller-supplied UID when the response omits it. Server code also uses UID to locate a mailbox collection item and can construct a temporary `TIdMessage` containing only UID for deletion rollback.

Assigning UID yourself only changes the in-memory object. It does not allocate a server UID, move the message, issue an IMAP command or prove that the record still exists. APIs that accept a UID separately may ignore this property and use their explicit argument.

#### Persistence and identity scope

UID is mailbox metadata. [`GenerateHeader`](../Methods/GenerateHeader.md), [`ProcessHeaders`](../Methods/ProcessHeaders.md), [`SaveToFile`](../Methods/SaveToFile.md) and [`LoadFromFile`](../Methods/LoadFromFile.md) do not serialize or recover it. An `.eml` file cannot preserve the IMAP identity through this property.

A UID is meaningful only with the account/server, mailbox and the mailbox's UIDVALIDITY value. If UIDVALIDITY changes, cached UIDs from the earlier validity epoch must not be reused. Store that context alongside the string in durable integration state; UID alone is not a globally stable key.

Treat incoming UID text as untrusted protocol data when logging or building commands. Prefer the IMAP component's UID-aware methods instead of concatenating command strings. Concurrency still applies: another actor may delete or move the message after retrieval.

The example is source-reviewed only; no IMAP operation was executed.

**External references**

- [Indy upstream: `TIdMessage`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - UID storage and clearing.
- [Indy upstream: `TIdIMAP4`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdIMAP4.pas) - UID parsing and assignment during retrieval.
- [RFC 3501 section 2.3.1.1](https://www.rfc-editor.org/rfc/rfc3501.html#section-2.3.1.1) - UID uniqueness, persistence and UIDVALIDITY rules implemented by this Indy generation.

<small>Created 2026-07-15</small>
