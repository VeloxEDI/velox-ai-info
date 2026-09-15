---
title: "Configure LAN input"
description: "Configure local or UNC folder input, service-account permissions, waiting and source-file handling."
sidebar_position: 60
classification: public
status: approved
owner: Cam Hart
keywords: [LAN input, UNC path, network share, after receiving]
---

LAN input collects files from a local folder or Windows share.

| Setting | Default | Effect |
| --- | --- | --- |
| UNC path | Empty | Folder path; supports `<DEFAULTDIR>` and runtime tags and is normalised before save. Validate the evaluated path. |
| After receiving | Delete | Deletes or leaves the source after copying. |
| Wait for | `0` | Inbound wait setting. The class does not make its unit explicit, so verify the setup label/runtime behaviour in the installed version. |

Use a UNC path for service access rather than an interactive user's mapped drive. Grant the service account only required list/read/create/move/delete rights. Test incomplete/locked files, same-name collision, share outage, restart, leave/delete behaviour and multiple worker threads. Copy success is not end-to-end Flow success; determine what happens when later processing fails. See [File Connection locking](../../connections/file/locking-retries-and-failure.md) and [operate Transports](../operate-transports.md).
