---
title: Flags
description: Stores IMAP mailbox state such as seen or answered separately from the message headers and body serialized by TIdMessage.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, imap, flags, seen, answered]
---

```Delphi
property Flags: TIdMessageFlagsSet read write;
```

### Example

```Delphi
procedure MarkMessageForLocalProcessing;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.Flags := Msg.Flags + [mfSeen, mfAnswered];
  Msg.Flags := Msg.Flags - [mfDeleted];
end;
```

### Usage

`Flags` stores IMAP mailbox state such as seen or answered separately from the message headers and body serialized by TIdMessage.

### Additional Technical Info
`Flags` is a set of [`TIdMessageFlags`](../../../../Types/Enumerations/TIdMessageFlags.md) values representing IMAP mailbox state. Its type is [`TIdMessageFlagsSet`](../../../../Types/Sets/TIdMessageFlagsSet.md). The available system flags are:

| Value | IMAP spelling | Meaning |
|---|---|---|
| `mfAnswered` | `\Answered` | The message has been answered. |
| `mfFlagged` | `\Flagged` | The message is specially marked. |
| `mfDeleted` | `\Deleted` | The message is marked for removal, not necessarily expunged. |
| `mfDraft` | `\Draft` | The message has not completed composition. |
| `mfSeen` | `\Seen` | The message has been read. |
| `mfRecent` | `\Recent` | The server considers the message recent for the session. |

The property is a direct value field. Reading returns a set value; assigning replaces the entire set. Use set union (`+`) and difference (`-`) when changing one flag without discarding the others, as in the example.

#### Mailbox metadata, not a message header

Flags is not an RFC message header. [`GenerateHeader`](../Methods/GenerateHeader.md), [`ProcessHeaders`](../Methods/ProcessHeaders.md), [`SaveToFile`](../Methods/SaveToFile.md) and [`LoadFromFile`](../Methods/LoadFromFile.md) do not project it into or recover it from the saved message. Copying an `.eml` file therefore does not preserve this property.

Indy's IMAP retrieval paths assign the server response to both Flags and [`UID`](UID.md). IMAP store operations translate the first five values to system flags. The server-side store implementation does not accept `mfRecent` in its add/remove list because `\Recent` is server/session managed. Merely assigning this property changes only the in-memory `TIdMessage`; it does not issue an IMAP `STORE` command or update a remote mailbox.

#### Lifecycle and safe use

New and cleared messages have `[]`. [`ClearHeader`](../Methods/ClearHeader.md) resets Flags even though it does not reset every message setting. A later IMAP fetch can replace the complete set with the flags returned by the server.

Treat the value as a snapshot. Another client, server rule or subsequent operation can change mailbox state after it was fetched. Before destructive actions, distinguish `mfDeleted` from actual expunging and apply the mailbox API's concurrency and UID rules. Do not infer message content, trust or delivery status from these flags.

The example is source-reviewed only and changes only the current in-memory message; no IMAP operation was executed.

**External references**

- [Indy upstream: `TIdMessage`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - flag storage and clearing.
- [Indy upstream: `TIdIMAP4`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdIMAP4.pas) - flag parsing, retrieval and store mapping.
- [RFC 3501 section 2.3.2](https://www.rfc-editor.org/rfc/rfc3501.html#section-2.3.2) - IMAP message flags and the special `\Recent` rules implemented by this Indy generation.

<small>Created 2026-07-15</small>
