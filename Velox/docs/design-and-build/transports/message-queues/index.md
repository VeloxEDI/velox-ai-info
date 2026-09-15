---
title: "Configure message-queue Transports"
description: "Configure verified MSMQ and IBM MQ inbound and outbound exchange"
sidebar_position: 10
slug: /transports/message-queue-transports
classification: public
status: approved
owner: Cam Hart
keywords: ["msmq", "ibm-mq", "transport"]
---

Configure inbound or outbound Microsoft Message Queuing (MSMQ) or IBM MQ exchange against an administrator-provisioned test queue.

## Scope

| Family | Verified configuration controls |
| --- | --- |
| MSMQ | **Host**, **Queue Name**, **Queue Visibility**, **Delivery Method**, authentication, transaction and direct-format-name choices; inbound also has **Read Timeout** |
| IBM MQ | **Connection Manager**, **Queue Name** and direction-specific server/channel or buffer controls shown by Designer |

Queue names, transaction modes, delivery methods and client libraries are infrastructure contracts. Obtain them from the queue administrator; do not invent or copy production values.

## Controlled setup

1. Confirm the required client/runtime components are installed on the Velox host and compatible with the target queue manager.
2. Create the correct inbound or outbound Transport and leave **Active** clear.
3. Enter the approved host/manager, queue and channel or visibility settings.
4. Configure authentication and transaction/delivery options exactly as agreed with the queue administrator.
5. Use **Test with...** and a unique sanitised message. Verify queue depth, message identity and consuming-system outcome independently.
6. Save and link the Transport only after confirming that failure and duplicate handling are safe.

## Constraints and failure behaviour

- The active configuration screens do not establish compatibility with every MSMQ/IBM MQ version or deployment mode.
- A send return value, queue presence and consumer completion are separate checkpoints.
- Transactional and non-transactional queues are not interchangeable.
- A receive failure can leave a message available, removed or uncertain depending on the queue transaction boundary. Inspect the queue and logs before replay.
- Increasing message/buffer sizes can affect memory and truncation behaviour; test with the largest approved payload.

## Related references

- [Configure MSMQ input](msmq-input.md) and [MSMQ output](msmq-output.md)
- [Configure IBM MQ input](ibm-mq-input.md) and [IBM MQ output](ibm-mq-output.md)
- [Test and operate Transports](../operate-transports.md)
- [Review Transport Logs](../../../operate-and-troubleshoot/transport-logs.md)
- [File and Transport troubleshooting](../../../operate-and-troubleshoot/file-and-transport-troubleshooting.md)
