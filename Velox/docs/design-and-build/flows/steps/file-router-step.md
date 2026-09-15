---
title: "Configure a File Router step"
description: "Configure ordered route formulas and File Connection destinations for first-match file routing in a Flow."
sidebar_position: 70
classification: public
status: approved
owner: Cam Hart
keywords: [File Router step, route formula, first match, File Connection]
---

A File Router step opens a source file data item, evaluates child route formulas in order and copies the file to the first matching route's File Connection. The step itself has no additional published scalar settings; its route items own the destinations and formulas.

| Route item setting | Default | Effect |
| --- | --- | --- |
| **Route name** / `ItemName` | `<New Route Item>` | Descriptive rule identity. |
| **File Connection** / `FileConFIDS` | Empty | Destination path/naming module for a match. |
| **File Connection name** | Empty | Stored display name; the FID is the relationship authority. |
| **Formula** | Route template | Velox script condition evaluated for the current source context. |

## Configure deterministically

1. Select a File Definition source and create route items in priority order.
2. Make route formulas mutually understandable; place specific rules before broad catch-alls.
3. Select a tested destination File Connection for every route.
4. Compile each formula and test matched, unmatched, overlapping and error cases.
5. Verify the first-match result and final name/path with sanitised files.

Only the first matching route copies. In Test Run the router evaluates the logic but suppresses its normal copy, so use log/formula evidence and a controlled live test before activation. A formula error or missing source/destination can fail/cancel the step. Route destinations use the service identity and can overwrite/collide according to File Connection naming behaviour. See [route/command overview](../file-routing-and-commands.md) and [File Connection naming](../../connections/file/paths-masks-and-naming.md).
