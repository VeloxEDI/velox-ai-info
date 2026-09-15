---
title: "Common Connection properties"
description: "Understand shared Velox module identity, environment, credential and runtime rules for Connections."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [Connection properties, credentials, module identity, testing]
---

DB and File Connections inherit the [common module properties](../../administer-velox/modules-and-folders/common-module-properties.md): module name, FID, Folder, revision, active/archive state and notes.

| Concern | Contract for every Connection |
| --- | --- |
| Environment | Confirm test/production context before save and test. Endpoint labels are not isolation controls. |
| Identity | Relations use FID, not only module name. Rename does not make an independent copy. |
| Credentials | Use the type-specific encrypted password control where available; protect configuration/export access and never document plaintext. |
| Service access | Test under the runtime account, not only the Designer user's identity. |
| Save/reload | Save persistence is not proof that a running service cache has refreshed. Follow the concrete page's restart/resynchronisation guidance. |
| Dependencies | Use **Check Usage** before changing shared paths, credentials, pooling, transactions or endpoint values. |
| Verification | Test connectivity, then run a controlled Definition/Flow and inspect output plus logs. |

DB Connections add engine/authentication/pool/transaction fields. File Connections add paths, masks, names and file-lifecycle fields. Do not apply a setting from one family to the other.
