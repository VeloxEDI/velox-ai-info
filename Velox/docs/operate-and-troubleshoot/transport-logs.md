---
title: "Review Transport Logs"
description: "Monitor queue status, attempts and Transport outcomes"
sidebar_position: 40
slug: /operations/transport-logs
classification: public
status: approved
owner: Cam Hart
keywords:
  - "transport-log"
  - "queue"
  - "retry"
---

Transport Logs are separate from Flow completion and show queued work, attempts, next-attempt time and Transport outcome. An outbound Flow step can register/queue work and finish before the Transport service sends it.

## Find a Transport record

1. Confirm context, direction, Transport and expected service host.
2. Filter by Transport, status, create/attempt time, Flow/action identity and filename/message identifier.
3. Record the Transport-log number, current status, attempts and next-attempt date before changing it.
4. Correlate its linked Flow/file log with remote acknowledgement or destination state.
5. Inspect HTTP/Transport communications only when capture was enabled and sharing is authorised.

## Status interpretation

| Status | Meaning and checks |
| --- | --- |
| Sending | A sender has claimed/started work. If stale, check service/thread and remote state before releasing or retrying. |
| Completed | Velox's Transport operation completed according to the protocol adapter. This is not universal business acknowledgement; verify the receiver. |
| Cancelled | Processing deliberately stopped/cancelled. Read the recorded reason and confirm whether any remote effect began. |
| Failed | Attempt failed. Review attempt count, next-attempt date, first error and remote state. |
| Test | Test-path record; do not confuse with production delivery. |

Transport records persist attempts, next-attempt date, handled state/date, save/send-status filters, notification recipients and capture flags. The outbound manager normally polls on the General Setup Transport attempt interval. A future next-attempt value is not a stuck item by itself.

## Escalation evidence

Do not manually retry/resend until the receiver is checked: timeouts and connection loss can occur after acceptance. Preserve the file/message hash or business identifier, protocol response and sanitised communication excerpt.

## Recovery boundary

See [operate Transports](../design-and-build/transports/operate-transports.md), [file and Transport troubleshooting](file-and-transport-troubleshooting.md) and [reprocess and recover](reprocess-and-recover.md).
