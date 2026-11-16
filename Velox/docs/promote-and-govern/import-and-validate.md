---
title: "Import and validate configuration"
description: "Review importer actions, save the intended module graph and prove the target configuration."
sidebar_position: 50
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T22:56:36Z"
keywords: [import, CFG, Add, Update, Duplicate, Ignore, Same]
---

Import is available from **File > Import** and may also be invoked for accepted dropped or pasted template files. Use only a trusted `.CFG` package whose source, checksum, product compatibility and intended target are known.

For AI-authored packages, follow [CFG import packaging](../../../instructions/cfg-packaging.md). A `TvxConfigTemplate` wrapper is not the primary real module: review its wrapper identity/state, the first requested module and the expected dependency graph before import. A requirement to keep Processes disabled does not mean disabling the wrapper and every supporting module.

## Import actions

| Displayed action | Effect | Review question |
| --- | --- | --- |
| **Add** | Saves a new module when the FID is not present. | Are its name, folder, dependencies and environment settings correct? |
| **Update** | Saves over the existing module with the matching identity. | Which current consumers will see changed behaviour? |
| **Add Duplicate** | Creates a new identity when a module already exists. | Will references point to the intended original or duplicate? |
| **Ignore** | Does not save that included module. | Is the existing target object genuinely compatible? |
| **Same** | Import comparison considers the module unchanged. | Have environment-owned values and runtime behaviour also been checked? |

The importer may initially mark existing folders, Transports and DB Connections as **Ignore**, other changed existing modules as **Update**, matching/default modules as **Same**, and missing modules as **Add**. Review every row; defaults are not deployment approval.

## Procedure

1. Back up the target configuration, confirm target context and pause affected processing where required.
2. Open the package and confirm the expected root module and expected module/dependency count against the package manifest. Reconcile discrepancies before proceeding.
3. Review every **Add**, **Update**, **Add Duplicate**, **Ignore** and **Same** decision, including supporting modules. Assign explicit actions where required and do not set the primary/root module to **Ignore**.
4. Select **Import** once. Do not repeat an uncertain import without first inspecting the target.
5. Confirm each expected module exists under the correct folder, resolves its dependencies and retains intended target-specific values and activation state. Keep requested Processes disabled; distinguish their state from required supporting modules.
6. Refresh/restart the relevant runtime and run controlled functional checks through Flow, Transport or API boundaries.
7. Record resulting identities, validation results and deviations from the package manifest.

Import saves module families in an internal dependency order and is not an all-or-nothing transaction. If a result is uncertain, stop affected work, preserve logs/comparison artefacts and follow [rollback and recovery](rollback-and-recovery.md).

## Separate validation results

Record static CFG checks, actual successful import, native **Test Compile** and functional execution as separate results. Run native Test Compile on the applicable imported modules before describing compilation as successful. Authored `CompiledStatus` values do not prove compilation, and a completed import dialog does not prove the expected module graph was saved correctly. If a check was not performed, record that explicitly; keep Processes disabled until activation is intended.

The packaging guide records a user-observed combined correction that imported successfully. Its wrapper identity, wrapper state, primary-module order and supporting-module activation changes were tested together; no individual change was independently proven to cause or fix that failure.
