---
title: mfSeen
description: Represents IMAP Seen state and the read flag affected by Velox's non-PEEK full-message retrieval.
sidebar_position: 172
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, imap, seen, read, flags]
---

```Delphi
mfSeen = 4
```

### Example

```Delphi
procedure CheckReadState(Message: TIdMessage; var HasBeenSeen: Boolean);
begin
  HasBeenSeen := mfSeen in Message.Flags;
end;
```

### Usage

`mfSeen` represents IMAP Seen state and the read flag affected by Velox's non-PEEK full-message retrieval.

### Additional Technical Info
`mfSeen` maps to IMAP `\Seen` and represents read state in the retrieved [`TIdMessage.Flags`](../../Classes/Mail/TIdMessage/Properties/Flags.md) snapshot.

The example tests that snapshot. It is source-reviewed and is not executed by the documentation workflow.

**Velox retrieval quirk**

Velox first retrieves flags by UID, then downloads the full message with Indy's `UIDRetrieve`. That method explicitly uses the non-PEEK IMAP fetch path (`RFC822`, not `BODY.PEEK`), which asks the server to set `\Seen` as part of retrieval.

The full retrieval happens before Velox finishes sender, recipient and custom-script filtering. Consequently a message that is later skipped can already be marked Seen, regardless of the configured `AfterReceiving` action. Do not assume only successfully handled messages become read.

When `AfterReceiving` is Read, Velox initially skips messages whose fetched snapshot already contains `mfSeen`, then batches an explicit UID STORE add for handled UIDs. On a normal compliant server that final add is often redundant after non-PEEK retrieval, but it is still a separate command that can fail and affect the flow result.

**State boundaries**

- Local set assignment sends no IMAP command.
- Seen does not prove Velox processing succeeded, attachments were saved or a person read the content.
- A server/client can add or remove it concurrently, subject to permanent flags and policy.
- Use an external processing/audit key for exactly-once workflow decisions; read state alone is not a durable transaction marker.

**Errors, performance and concurrency**

Local testing is constant-time. Flag retrieval, full-message fetch and explicit STORE are separate network operations with separate failure points and snapshots.

**Related entries**

- [`mfRecent`](mfRecent.md) is session-managed arrival state, not unread state.
- [`mfDeleted`](mfDeleted.md) participates in Velox delete/move handling.
- [`TIdMessageFlagsSet`](../../Types/Sets/TIdMessageFlagsSet.md) documents local replacement and remote boundaries.

**External references**

- [RFC 3501 Seen and BODY.PEEK semantics](https://www.rfc-editor.org/rfc/rfc3501.html#section-6.4.5)
- [RFC 9051 FETCH command](https://www.rfc-editor.org/rfc/rfc9051.html#name-fetch-command)

<small>Created 2026-07-15</small>
