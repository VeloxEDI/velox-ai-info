---
title: "Troubleshoot file and Transport processing"
description: "Diagnose monitored files and queued, failed or unsent Transport work"
sidebar_position: 100
slug: /operations/file-and-transport-troubleshooting
classification: public
status: approved
owner: Cam Hart
keywords:
  - "file-monitor"
  - "transport"
  - "troubleshooting"
---

File monitoring and Transport processing cross service-account, filesystem, queue and remote-system boundaries. Diagnose the owning stage: remote receive/download, local file lifecycle, file-monitor registration, Flow processing, outbound queue registration or actual Transport send.

## File does not trigger a Flow

- Confirm the active Flow, execution type, monitor File Connection and correct production/test service manager.
- Resolve the effective folder/pattern and verify the service account sees it.
- Check whether the file existed before monitor start, is still being written/locked, fails the pattern, or moved to audit/error/issue/duplicate/transport folders.
- Record filename, size, timestamps and hash before moving/copying it.
- Use a new controlled file for reproduction; do not repeatedly rename a production file without understanding duplicate/hash logic.

## Inbound Transport failure

Confirm direction/type, service manager load, credential/auth/TLS/proxy/key/certificate settings and remote availability. Check whether a remote item was downloaded before a local save/move failed. Preserve remote message/file identity and local partial/temp evidence; avoid deleting the remote source until successful local processing is proven.

## Outbound Transport failure

Start from the [Transport Log](transport-logs.md): status, attempts, next attempt, file/message identity, first protocol error and communication trace if enabled. Verify the source file still exists and is the expected content. For HTTP/email/queue/file-transfer timeouts or lost responses, ask the receiver whether it accepted the item before retrying.

## Controlled recovery

Correct one cause, test one item, verify local lifecycle plus receiver state, then release the backlog gradually. Distinguish Flow retry from Transport retry and do not recreate a queued item by rerunning the Flow unless all Flow side effects are replay-safe.

## Escalation evidence

Provide Transport type/direction, module/log numbers, effective host/path (sanitised), filename/message/hash, attempts/times, service account/host, protocol status and receiver confirmation. Redact credentials, tokens and payloads.

## Recovery boundary

See [Transport concepts](../design-and-build/transports/transport-concepts.md), [shared Transport settings](../design-and-build/transports/authentication-tls-proxy-timeout-and-retry.md) and [reprocess and recover](reprocess-and-recover.md).
