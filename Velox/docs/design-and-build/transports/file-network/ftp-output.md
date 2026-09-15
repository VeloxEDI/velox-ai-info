---
title: "Configure FTP output"
description: "Configure FTP or FTPS upload, passive/transfer behaviour, temporary names, indicator files and remote post-send movement."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [FTP output, FTPS, temporary filename, indicator file]
---

FTP output uploads a file registered by a Flow Outbound Transport step. Flow success records outbound work; Transport execution and receiver acceptance occur separately.

| Setting | Default | Runtime effect |
| --- | --- | --- |
| Host / port / path | Empty / `21` / empty | Remote FTP destination. Path is normalised before save. |
| SSL client type | No SSL | Plain FTP unless FTPS is explicitly selected and verified. |
| Transfer type | Binary | Binary or ASCII upload. |
| Passive / protect data port / CCC | Selected / selected / cleared | Data connection and FTPS channel behaviour. |
| Control / transfer timeout | `15` / `0` | Protocol waits. |
| Use temporary filename | Cleared | Uploads under a temporary name before final publication where supported. Prefer this when receivers watch the target directory. |
| Send indicator file | Cleared | Sends a separate completion/ready indicator. |
| Indicator filename | Empty | Tag-processed indicator name; make it unique and contract-approved. |
| Move after sending | Cleared | Moves the remote file after upload where the implementation/server supports it. |
| Move-to folder | Empty | Remote target for post-send movement. |

Test byte equality, final rename atomicity, collision behaviour, indicator ordering and an interrupted upload. Confirm the Transport log and receiver state before retry; a timeout can follow a completed remote upload. See [shared security/retry](../authentication-tls-proxy-timeout-and-retry.md) and [operate Transports](../operate-transports.md).
