---
title: "Common module properties"
description: "Understand identity, folder, revision, state and notes shared by Velox modules."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [module properties, active, revision, folder, notes]
---

Concrete Velox modules inherit a common identity and lifecycle. Not every technical property is directly editable in every setup form, but it affects import, promotion, relationships or runtime selection.

| Property | Initial/allowed state | Effect and safe-use guidance |
| --- | --- | --- |
| Module name | Type-specific new name, such as `New Map` | User-visible identity. Use a stable, descriptive name; changing it does not create an independent object. |
| Folder | Empty/unassigned or one Folder | Organises the Designer tree and relations. It is not an access-control or runtime-isolation boundary. |
| FID | Assigned GUID identity | Relations use identity, not only name. Do not hand-edit or reuse it. |
| Version / Velox version | Assigned from the running product/schema | Used by load/upgrade logic. Do not treat it as a user release note. |
| Production/Test revision | Production starts at `1`; test revision initially `0` in reviewed defaults | Supports comparison/promotion history; verify the target context before save. |
| Active | `true` for a new module | Disabled objects may be excluded from relevant runtime managers/use. Disable only after checking dependants. |
| Archived | Lifecycle state controlled by module actions | Removes an object from normal active views without proving that deletion is safe. |
| Module notes | Empty list initially | Record public-safe operational context; never store credentials or customer data. |

## Persistence and runtime

Modules are persisted in type-specific VxConfig tables with streamed component data and relations. A successful save confirms persistence, not that every consuming service has reloaded the object. Use the concrete page's reload/restart guidance and test each caller.

Before rename, disable, archive or delete, follow [module lifecycle actions](lifecycle-actions.md) and inspect usage/relations.
