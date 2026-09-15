---
title: "Configure IBM MQ output"
description: "Configure IBM MQ connection manager, channel and outbound queue and verify message delivery boundaries."
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [IBM MQ output, connection manager, channel, outbound queue]
---

IBM MQ output adds no published fields beyond the IBM MQ base and shared Transport properties.

| Setting | Default | Required decision |
| --- | --- | --- |
| Connection manager | Empty | Reviewed queue-manager/client connection. |
| Queue name | Empty | Outbound destination queue. |
| Channel name | Empty | Approved channel with least-privilege access. |
| Shared endpoint/auth/TLS/timeouts | Base defaults | Match the deployed IBM MQ channel policy and prove negotiation/identity. |

Test client installation, channel/queue permissions, message size/encoding, unavailable/full queue, ambiguous network result, duplicate message and consumer acknowledgement. Queue put success is not business consumption. Use a stable message/business identifier and reconcile queue/consumer state before Transport retry or Flow replay.
