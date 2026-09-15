---
title: "Configure FTP input"
description: "Configure FTP or FTPS polling, transfer mode, passive/data-channel protection and post-download handling."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [FTP input, FTPS, passive mode, after receiving]
---

FTP input downloads files from a remote directory into the runtime File Connection so a linked Flow can process them.

| Setting | Default | Runtime effect |
| --- | --- | --- |
| Host / port | Empty / `21` | FTP server endpoint. |
| SSL client type | No SSL | Plain FTP unless explicitly configured for FTPS. Select TLS mode/certificates and prove negotiation/peer identity. |
| Remote path | Empty | Normalised with web-style delimiters before save. |
| Transfer type | Binary | Binary or ASCII. Use Binary unless the interface specifically requires FTP text conversion. |
| Passive | Selected | Uses passive data connection. |
| Protect data port | Selected | FTPS data-channel protection. |
| Clear Command Channel (CCC) | Cleared | Clears FTPS control-channel protection after authentication. Enable only for a reviewed server/network requirement. |
| Control / transfer timeout | `15` / `0` | FTP control and data-transfer waits. Test zero/units with the deployed library/server. |
| After receiving | Delete | Delete, leave or move remote source after successful download. |
| Move-to folder | Empty | Required remote destination when move is selected. |
| Use LIST | Cleared | Uses the alternative FTP listing behaviour where implemented. |

Test listing, masks, partial/locked files, binary byte equality, duplicate names and delete/move permission. Leaving remote files requires an explicit duplicate-prevention rule; deleting before downstream business completion changes recovery. Confirm how download success and Flow failure are reconciled, then use [Transport operations](../operate-transports.md).
