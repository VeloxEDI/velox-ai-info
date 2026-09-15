---
title: Mail
description: Source-backed guidance for Velox's modified Indy message, address, MIME-part, boundary and file-attachment classes.
sidebar_position: 9
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, mail, email, indy, mime, attachments]
---

The Mail branch exposes the mutable object model that Velox uses while parsing, transforming and generating Internet messages. It is based on Indy but includes Velox modifications and a deliberately restricted PascalScript surface. Use these pages for the current product behavior rather than assuming that every upstream Indy member or constructor is available.

## Where to start

Most scripts begin with the [`Email`](../Variables/Helpers/Email.md) helper, which returns the current borrowed [`TIdMessage`](Mail/TIdMessage.md) or nil. Re-resolve it for each action/record/event because the host can replace the message between executions. Do not free it or retain it outside its owning execution scope.

`TIdMessage` owns or coordinates the other Mail objects:

| Need | Class | Main boundary |
|---|---|---|
| Read or alter message headers, body, recipients and MIME layout | [`TIdMessage`](Mail/TIdMessage.md) | Raw headers and typed properties synchronize only through explicit processing/generation. |
| Work with one parsed/formatted address | [`TIdEMailAddressItem`](Mail/TIdEMailAddressItem.md) | Normally collection-owned and permissively parsed; not an address validator. |
| Work with an ordered address collection | [`TIdEMailAddressList`](Mail/TIdEMailAddressList.md) | Parsing replaces/extends mutable items and sorting swaps item contents rather than identities. |
| Inspect metadata common to MIME parts | [`TIdMessagePart`](Mail/TIdMessagePart.md) | Abstract collection-owned base; fields do not all map directly to generated headers. |
| Inspect and count message parts | [`TIdMessageParts`](Mail/TIdMessageParts.md) | Owns concrete parts; its exposed base Add path is disabled and cached counts require recounting. |
| Work with a text MIME part | [`TIdText`](Mail/TIdText.md) | Owns a mutable Body list and remains owned by MessageParts. |
| Understand attachment transfer operations | [`TIdAttachment`](Mail/TIdAttachment.md) | Abstract contract; complete load/save operations are synchronous and nontransactional. |
| Work with a file-backed attachment | [`TIdAttachmentFile`](Mail/TIdAttachmentFile.md) | Outgoing paths stay live; received files can be destructor-managed temporary files. |
| Inspect nested MIME boundary state | [`TIdMIMEBoundary`](Mail/TIdMIMEBoundary.md) | Mutable LIFO parsing/generation state, not a stable content collection. |

## State model and ownership

Mail objects are mutable, unsynchronized and heavily owner-coupled. `TIdMessage` owns its address lists, body/news-group lists, header lists, MessageParts and MIME-boundary stack. MessageParts owns every attached `TIdText` or attachment part; address lists own their address items. Getters normally return borrowed references. Never free a borrowed child, and expect clear, reparse, removal, message replacement or owner destruction to invalidate it.

Loading, processing headers, generating headers and saving are separate state transitions. Raw `Headers` can contain values not yet projected into typed properties. `ProcessHeaders` parses them into typed state. `GenerateHeader` rebuilds output headers and can recount parts, resolve default encoding, infer content type, replace MIME-boundary state and normalize transfer encodings. These operations are not transactional: an exception can leave partially changed state.

## Message, envelope and MIME distinctions

Header recipients (`To`, `CCList`, `BccList`) are message content. SMTP envelope recipients and explicit transport overrides are separate delivery concepts. `Bcc` is normally omitted from generated public headers, but raw-header copying and some file-save routes can re-expose it if misused. Treat envelope construction and privacy as transport design concerns, not merely list formatting.

Message-level charset, transfer encoding and ContentType do not describe every MIME part. Multipart layouts delegate content headers to parts, and parsing/generation can normalize fields. Derived properties and cached counts are snapshots of current mutable state, not independent truth.

## Files, security and concurrency

An outgoing `TIdAttachmentFile` can retain a source path and read it later during transport; changing/deleting that file changes or breaks the send. A received attachment can point at a temporary file removed when the part is destroyed. Copy required data to an approved durable path while the part is live, validate names independently and never trust message-provided filenames as paths.

Mail content is untrusted input. Apply size/count limits before expensive parsing or copying, sanitize filenames, validate addresses according to the real business/transport requirement, avoid logging bodies/credentials/personal data, and do not construct raw headers from unchecked text. The class layer does not itself send mail or establish TLS; transport configuration and send helpers define network behavior.

Do not share one message or its children between concurrent flows. Do not mutate lists/parts while a transport is parsing or serializing them. Snapshot primitive values if later owner mutation is possible.

## External references

- [Indy upstream source](https://github.com/IndySockets/Indy) - vendor baseline; Velox's shipped modified source remains authoritative for differences.
- [RFC 5322](https://www.rfc-editor.org/rfc/rfc5322.html) - Internet message syntax.
- [RFC 2045](https://www.rfc-editor.org/rfc/rfc2045.html) and [RFC 2046](https://www.rfc-editor.org/rfc/rfc2046.html) - MIME content and media types.
- [RFC 6532](https://www.rfc-editor.org/rfc/rfc6532.html) - internationalized message headers; support still depends on the exact Velox/Indy encoding path.

<small>Created 2026-07-15</small>
