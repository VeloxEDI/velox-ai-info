---
title: "Configure MSMQ input"
description: "Configure Microsoft Message Queuing input queue format, delivery, transactions, authentication and receive timeout."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [MSMQ input, Message Queuing, direct format, transaction]
---

| Setting | Default | Effect |
| --- | --- | --- |
| Visibility | Private | Private or public queue format. |
| Queue name | Empty | Queue identity. Validate machine/queue scope and service-account rights. |
| Delivery type | Express | MSMQ delivery mode; choose durable behaviour according to the queue design. |
| Use transaction | Cleared | Uses MSMQ transactional operations. Queue type and operation must be compatible. |
| Use direct format name | Cleared | Uses direct format rather than ordinary queue name resolution. |
| Direct format type | OS | Direct-format variant. |
| Authenticate | Cleared | MSMQ authentication flag; also configure Windows/queue permissions. |
| Read timeout | `1` | Receive wait. A source comment notes future zero/unlimited behaviour, so do not assume `0` is currently a monitor-safe indefinite wait. |
| After receiving | Nothing | Current enum exposes only no additional post-receive action. |

Test empty queue, one/many messages, transaction compatibility, permissions, poison/invalid messages, timeout and service restart. Establish when a message is removed/committed relative to downstream Flow success and how it is redelivered or dead-lettered; the base setting alone does not prove exactly-once processing.
