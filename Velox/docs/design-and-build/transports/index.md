---
title: "Exchange data with Transports"
description: "Choose, configure, test and operate Velox Transports"
sidebar_position: 10
slug: /transports/
classification: public
status: approved
owner: Cam Hart
keywords: ["transport", "inbound", "outbound"]
---

Use Transports to receive files or messages from external systems and to send Flow output. Start with [Transport concepts](transport-concepts.md) to understand direction, queueing, retries and service-account boundaries.

## Choose a Transport

- For FTP, SFTP or network folders, use [file and network Transports](file-network/index.md).
- For web endpoints, use [HTTP Transports](http/index.md).
- For Microsoft Message Queuing or IBM MQ, use [message-queue Transports](message-queues/index.md).
- For mailbox collection or email delivery, use [email Transports](email/index.md).

The available type is not a compatibility promise. Confirm the authentication, protocol, server and client-library requirements for the deployed Velox version and target system.

## Implementation path

1. Create an inactive Transport in Designer and configure a non-production endpoint.
2. Test connectivity with sanitised content and the intended runtime identity.
3. Configure local File Connections and post-receipt handling where required.
4. Add an outbound Transport to a tested Flow, or add an inbound Transport to a monitored Flow.
5. Follow [Test and operate Transports](operate-transports.md) to verify queue and delivery outcomes separately from Flow completion.

## Operate safely

Treat credentials, certificates, payloads and communication traces as sensitive. Before retrying, check both Flow execution and Transport Logs so an earlier queued item is not delivered twice.

Review [shared authentication, TLS, timeout and retry settings](authentication-tls-proxy-timeout-and-retry.md). Use [file and Transport troubleshooting](../../operate-and-troubleshoot/file-and-transport-troubleshooting.md) when a test or queued item fails.
