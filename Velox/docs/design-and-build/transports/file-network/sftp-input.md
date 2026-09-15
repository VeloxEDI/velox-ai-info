---
title: "Configure SFTP input"
description: "Configure SFTP polling with password or private-key authentication, version negotiation and post-download handling."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [SFTP input, SSH key, SFTP version, after receiving]
---

| Setting | Default | Runtime effect |
| --- | --- | --- |
| Host / port | Empty / `22` | SSH/SFTP endpoint. Verify server host identity in the deployed client path. |
| Remote path | Empty | Normalised remote source directory. |
| SFTP version | Auto | Negotiation preference; UI values include Auto and SFTP v1-v6. Pin only for a tested compatibility requirement. |
| Authentication | Password | Password or private key. Key files/password/reference must be available to the runtime service account. |
| Control / transfer timeout | `15` / `0` | SSH/control and transfer waits. |
| After receiving | Delete | Delete, leave or move the remote file after download. |
| Move-to folder | Empty | Remote destination used by move-after-receive. |

Test password/key failure, host/key trust, listing/mask, locked/partial upload behaviour, exact bytes, duplicate file names and delete/move rights. If the source is left or a move fails, establish a durable correlation/duplicate rule before polling again. Certificate-style shared TLS controls are not a substitute for SSH host-key verification; prove the actual deployed behaviour. See [shared authentication](../authentication-tls-proxy-timeout-and-retry.md).
