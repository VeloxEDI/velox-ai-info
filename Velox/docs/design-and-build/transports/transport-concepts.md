---
title: "Transport concepts"
description: "Understand direction, queues, retries, files and security settings"
sidebar_position: 20
slug: /transports/transport-concepts
classification: public
status: approved
owner: Cam Hart
keywords:
  - "transport"
  - "queue"
  - "retry"
---

A Transport is a reusable Velox module for exchanging files or messages with an external system. Each Transport has an inbound or outbound direction and protocol-specific connection, security and processing settings.

## Inbound and outbound direction

An **inbound Transport** polls or receives content from an external system and stores it locally according to its configuration. Further processing commonly depends on a File Connection and a monitored Flow.

An **outbound Transport** sends content created or selected by a Flow. The Flow creates a queued Transport Log item; Velox Service processes that queue separately. Flow completion and external delivery are therefore different checkpoints.

## Confirmed Transport families

Velox contains active configuration and runtime paths for file-transfer, HTTP, message-queue and email protocols. These include FTP, SFTP, LAN, HTTP, MSMQ, IBM MQ, IMAP, POP3 and email/SMTP combinations in the applicable direction.

The presence of a Transport type does not guarantee interoperability with every server, protocol version, cipher, authentication method or installed driver. Confirm the supported matrix for the deployed Velox version and test against the actual external system.

## Configuration layers

Transport configuration commonly combines:

- an endpoint, server, mailbox, queue or network location;
- credentials or certificates held through approved controls;
- an inbound or outbound direction;
- local File Connection and filename behaviour where files are involved;
- polling, queue, retry or timeout settings; and
- logging options used for diagnosis.

Protocol-specific pages own exact settings. Do not reuse a value from one environment as a default for another.

## Queue and retry model

Outbound work is recorded in Transport Logs with state and attempt information. The outbound manager later sends eligible work and applies Transport retry rules. This is separate from retrying the Flow that originally created the item.

:::caution Duplicate delivery
Running a Flow again can create a new outbound item while an earlier item remains queued. Check both execution logs and Transport Logs before retrying or reprocessing work.
:::

## Files and permissions

Transport processing can depend on local input, output, archive or temporary folders. The Velox Service account must be able to reach those locations and the external endpoint. An interactive test in Designer does not prove that the service account has equivalent access.

Use sanitised test files and non-production endpoints for initial verification. Confirm the complete lifecycle: receive or queue, local file handling, Transport result, downstream acknowledgement where applicable, and safe handling of failures.

## Security boundaries

- Do not place passwords, private keys, tokens or connection strings in documentation, scripts or filenames.
- Verify host identity and certificate requirements under the approved deployment policy.
- Grant the runtime account only the required folder, queue, mailbox and network rights.
- Treat endpoint logs and payload samples as potentially sensitive; sanitise them before sharing.
- Obtain security review before publishing compatibility or secure-by-default claims.

## Related tasks

- [Configure file and network Transports](file-network/index.md)
- [Configure HTTP Transports](http/index.md)
- [Configure message-queue Transports](message-queues/index.md)
- [Configure email Transports](email/index.md)
- [Shared authentication, TLS, timeout and retry](authentication-tls-proxy-timeout-and-retry.md)
- [Test and operate Transports](operate-transports.md)
- [Review Transport Logs](../../operate-and-troubleshoot/transport-logs.md)
