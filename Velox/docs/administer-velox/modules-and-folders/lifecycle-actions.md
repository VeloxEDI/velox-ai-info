---
title: "Manage Velox modules"
description: "Create, edit, copy, archive, restore, delete and inspect module usage"
sidebar_position: 50
slug: /administration/module-lifecycle
classification: public
status: approved
owner: Cam Hart
keywords: [module, archive, usage]
---

Modules are shared configuration objects. Before editing, renaming, archiving or deleting one, use **Check Usage** or the available relations view and record its callers.

1. Confirm the configuration context and module identity.
2. Check usage and dependent modules.
3. Make and test changes in the test context. Copying creates a separate identity; renaming does not make a safe independent copy.
4. Save and retest every affected caller.
5. Archive unused modules before permanent deletion where the current module type supports it.
6. Restore and retest if an archive was premature. Delete only after backup, usage and retention checks pass.

Exports/templates can contain dependency and environment information. Protect them and promote dependencies together. If callers fail, restore the previous configuration, reload affected services and verify each caller.

- [Configuration templates](../../promote-and-govern/configuration-templates.md)
- [Maintenance tools](../../technical-reference/maintenance-tools.md)
