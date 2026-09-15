---
title: mfDraft
description: Represents the IMAP Draft system flag for a mailbox message whose composition is not complete.
sidebar_position: 169
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, mail, imap, draft, flags]
---

```Delphi
mfDraft = 3
```

### Example

```Delphi
procedure MarkDraftLocally(Message: TIdMessage);
begin
  Message.Flags := Message.Flags + [mfDraft];
end;
```

### Usage

`mfDraft` represents the IMAP Draft system flag for a mailbox message whose composition is not complete.

**Meaning and boundaries**

- Velox does not derive Draft from missing recipients, an empty body, a Drafts-folder name or message headers.
- Sending or saving a `TIdMessage` does not automatically remove the local member.
- Conversely, a fully formed message may still be flagged Draft by the server/client workflow.
- Velox's receive transport has no special Draft handling; it exposes the retrieved snapshot to processing.

Velox parses `\Draft` from IMAP responses and serializes it in outbound flag sets. Whether the selected mailbox permits changing it is controlled by server capabilities and permanent flags.

### Additional Technical Info
`mfDraft` maps to IMAP `\Draft` and denotes incomplete composition in mailbox metadata. The example preserves other local flags but does not update a mailbox. It is source-reviewed and is not executed by the documentation workflow.

**Local versus remote state**

Changing `Message.Flags` is local only. A remote workflow should address the message by UID and add/remove the single intended flag rather than replace every server flag from a stale snapshot.

**Errors, performance and concurrency**

Local set operations are constant-time. Remote updates can fail due to mailbox state, permissions, UID validity, connection or protocol errors. Another client can complete, move or delete the draft after it was retrieved.

**Related entries**

- [`mfAnswered`](mfAnswered.md) is reply-state metadata.
- [`mfFlagged`](mfFlagged.md) is special-attention metadata.
- [`TIdMessageFlags`](../../Types/Enumerations/TIdMessageFlags.md) defines the complete enum.

**External references**

- [RFC 3501 system flags](https://www.rfc-editor.org/rfc/rfc3501.html#section-2.3.2)
- [RFC 9051 flags message attribute](https://www.rfc-editor.org/rfc/rfc9051.html#name-flags-message-attribute)

<small>Created 2026-07-15</small>
