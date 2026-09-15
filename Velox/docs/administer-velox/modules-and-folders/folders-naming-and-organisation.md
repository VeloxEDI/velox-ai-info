---
title: "Configure folders, naming and organisation"
description: "Use Velox Folder modules and naming conventions to organise shared configuration safely."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [Velox folders, module naming, organisation]
---

A Folder is a module that controls tree organisation and the module types that can appear beneath it. It does not create a separate security boundary, database transaction or service runtime.

| Setting | Type/default | Effect |
| --- | --- | --- |
| Folder name | string / `New Folder` | Display name used in the Designer tree and propagated to relation/display rows |
| Parent folder | Folder identity / unassigned | Creates the organisational hierarchy |
| Module mask | set of module types / reviewed default includes Folder, File Connection, DB/File Definition, inbound/outbound Transport, Report, SQL Script, Scriptlet, Map and Flow | Controls which object types the Folder accepts/displays; availability can vary with the current UI/version |

## Naming guidance

- Name objects by stable business/technical purpose rather than a temporary ticket or person's name.
- Distinguish direction and environment-sensitive endpoint role where it prevents selection errors, but do not encode credentials or production identifiers.
- Keep shared dependencies discoverable; avoid duplicating a Connection or Definition merely to place it in another folder.
- Use Folder depth only when it improves navigation for operators and implementers.

## Delete behaviour

Deleting a Folder reparents child module rows to the deleted Folder's parent in the reviewed implementation. It does not delete every contained module. Before deleting, record the current hierarchy, check usage and verify the tree and relations after save.
