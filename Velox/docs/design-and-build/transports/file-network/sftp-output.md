---
title: "Configure SFTP output"
description: "Configure SFTP upload authentication, version, timeouts, temporary names, indicator files and post-send movement."
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [SFTP output, SSH private key, temporary filename, indicator]
---

| Setting | Default | Runtime effect |
| --- | --- | --- |
| Host / port / path | Empty / `22` / empty | SSH/SFTP destination. |
| SFTP version | Auto | Negotiates an SFTP version; pin only after compatibility testing. |
| Authentication | Password | Password or private-key path. Protect key material and service-account access. |
| Control / transfer timeout | `15` / `0` | Protocol waits. |
| Use temporary filename | Cleared | Uploads with a temporary name before the final name where supported. |
| Send indicator file / indicator name | Cleared / empty | Optional ready marker sent after the content; name may contain tags. |
| Move after sending / move-to folder | Cleared / empty | Optional remote movement after send. |

Test final-name collision, interrupted upload, rename/indicator order, key rotation, receiver visibility and ambiguous timeout. Do not retry until the remote directory/receiver state is known. Flow auto-retry can register another item while Transport retry can resend the existing item; use correlation-safe file names and reconciliation. See [operate Transports](../operate-transports.md).
