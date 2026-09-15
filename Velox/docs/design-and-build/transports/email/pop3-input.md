---
title: "Configure POP3 input"
description: "Configure POP3 mailbox collection, SASL, TLS and delete-or-leave post-receive behaviour."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [POP3 input, POP, SASL, after receiving]
---

| Setting | Default | Effect |
| --- | --- | --- |
| Host / port | Empty / `110` | POP3 endpoint. Configure the approved TLS/port combination rather than assuming port 110 is appropriate. |
| Use SASL | Cleared | Enables SASL authentication. |
| After receiving | Delete | Delete or leave the message on the server after retrieval. |
| Shared authentication/TLS/timeouts | Base defaults | See the shared Transport reference and prove actual peer verification/negotiation. |

POP3 offers fewer mailbox-state controls than IMAP. Leaving messages can retrieve them again; deleting immediately can reduce recovery options if later processing fails. Test unique correlation, attachment extraction, malformed/large mail, network loss after retrieval, delete failure and restart behaviour. Do not enable repeated automatic retrieval without a durable duplicate rule. See [operate Transports](../operate-transports.md).
