---
title: "Configure IBM MQ input"
description: "Configure IBM MQ connection manager, channel, queue and receive buffer for inbound messages."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [IBM MQ input, connection manager, channel, receive buffer]
---

| Setting | Default | Effect |
| --- | --- | --- |
| Connection manager | Empty | IBM MQ manager/connection identity used by the client. |
| Queue name | Empty | Inbound queue. |
| Channel name | Empty | Client/server channel. |
| Receive buffer length | `32768` | Buffer used for received message data. Set only after maximum-message tests; truncation/rejection behaviour must be verified. |
| After receiving | Nothing | Current enum exposes only no extra post-receive action. |
| Shared host/port/auth/TLS/timeouts | Base defaults | Configure according to the deployed IBM MQ client/channel policy. |

Verify IBM MQ client availability/architecture on every runtime host, channel authentication/TLS, queue rights, message size/encoding, empty queue, poison messages, network loss and restart. Document when a get becomes final relative to Flow processing and the queue's rollback/redelivery design. Do not infer transactional delivery from the absence of an error.
