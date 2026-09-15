---
title: "Configure IMAP input"
description: "Configure IMAP mailbox collection, filters, SASL, TLS and post-receive mark/move/delete behaviour."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [IMAP input, mailbox, SASL, move after receiving]
---

| Setting | Default | Effect |
| --- | --- | --- |
| Host / port | Empty / `0` | IMAP endpoint. The class does not assign a conventional port; configure the reviewed server/TLS port explicitly. |
| Mailbox | Empty | Mailbox/folder to poll. |
| After receiving | Delete | Mark read, move, delete or do nothing after download. Select only with a duplicate/recovery design. |
| Move-to mailbox | Empty | Required when post-receive action is move. |
| Use SASL | Cleared | Enables the SASL authentication path. |
| From / To filter | Empty / empty | Sender and recipient filters. Treat headers as untrusted and test exact matching. |

Shared user/password/OAuth/TLS/timeouts apply, subject to the concrete client. Test mailbox rights, unread/seen flags, attachment selection, duplicate messages, move/delete failure, malformed/large messages, TLS and service restarts. Email `Message-ID` is useful correlation but not a universal uniqueness guarantee. Preserve the original message until downstream processing and replay behaviour are proved. See [shared security](../authentication-tls-proxy-timeout-and-retry.md).
