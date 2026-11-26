---
title: Velox UI accessibility reference
description: How computer-use agents should combine source-derived Velox form metadata with live observations.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
public_export: velox-uia
---

# Using this reference

This reference gives computer-use agents a map of Velox Designer forms before they inspect the application. Start with the [form index](forms.md), search by form caption or task, then read the relevant form page. Do not load the entire folder into context for every task.

The authority is the Delphi source in the `velox` repository. This first version extracts text DFM controls and explicit Pascal automation assignments, including inherited controls, adapter attachments and tab metadata. It has **not been verified against a running executable**. Source fingerprints on each page identify the working-tree files used; the installed version may differ. No Velox executable was built to produce this reference.

## Before each task

1. Identify the required form and expected controls from this folder.
2. Inspect the running Velox window to confirm the configuration database, Production or Test environment, open module and any modal dialog.
3. Match the observed accessible names and AutomationIds against the source clues where the tool exposes them. Use only current observations for element indexes, handles and coordinates.
4. Check current visibility, enabled state and values. DFM states are defaults, not live facts. Select the appropriate tab or expand a tree branch before looking for its children.
5. Perform the intended action and observe the result. Refresh accessibility information whenever the visible element tree may have changed.

An AutomationId identifies a source-configured element; it is not a computer-use element index. Never reuse saved indexes, fabricate runtime handles, or assume that a documented control is currently present. This reference does not grant authorisation to run flows, delete modules, change configuration, send messages or start services; follow the user's task scope and the computer-use tool's action rules.

## Main navigation

The [main form](frmmain.md) defines these navigation clues in `Forms/frmMain.pas`, method `TMain.InitialiseAutomation`:

| AutomationId | Intended use from source metadata |
|---|---|
| `Navigation.ConfigurationDatabase` | Select the configuration database connection. |
| `Navigation.Environment` | Switch between Production and Test. |
| `Navigation.ProductionTree` | Browse Production modules and folders. |
| `Navigation.TestTree` | Browse Test modules and folders. |
| `Navigation.Search` | Search navigation modules by name; Enter searches the database and Ctrl+Enter loads and searches the full navigation tree. |
| `Navigation.WorkspaceTabs` | Select an open module, editor or management window. |
| `Navigation.GeneralSetup` | Open General Setup for the current environment. |
| `Navigation.Logs` | Open logs for the current environment. |

Navigation row IDs are built at runtime from the tree prefix and node identity. Module rows use class/group information and module GUIDs; some structural rows use captions. Workspace tab IDs use the `Navigation.WorkspaceTab` prefix and a runtime tab ID. Discover these live; do not construct IDs from examples. Evidence: `Forms/frmMain.pas`, `NavigationNodeId`; `Classes/GUI/vxTreeAutomation.pas`, `TvxTreeItemProvider.Create`; `Classes/GUI/vxPageAutomation.pas`, `TabSettings`.

## Reading form pages

- **Explicit automation metadata** comes from `InitialiseAutomation`, adapter configuration, tab assignments and DFM automation properties. Descendant assignments override inherited assignments for the same component.
- **Name** is an explicit automation name. **NamedBy** identifies a label used for naming. **Caption** is a design-time caption that may inform the runtime name. They are intentionally distinguished.
- **Other controls and commands** lists DFM clues where no explicit metadata was extracted. A Delphi component name is not evidence of an AutomationId.
- **Container / DFM state** helps locate tabs and groups. A parent can hide or disable a child even when the child has no such flag in the table.
- **Source evidence** uses repository-relative file paths and line numbers. Source files are not included in the public export. Line numbers can move; use the component and method names when investigating a newer source revision.

Descriptions are copied from source metadata. Generic wording such as “Perform Save” is not a full description of validation, persistence or other side effects. Runtime-created controls, grid rows, list items, popup entries, editor values and provider-supported UIA patterns require live inspection. Custom controls without useful accessible children may require the computer-use tool's visual interaction path. No runtime accessibility coverage or reliability is claimed by this inventory.

## Maintenance and publication

The canonical folder is `velox-kb/VeloxPKB/docs/velox/velox-uia/`. It is grouped under the owning `velox` repository. Hand-maintain this introduction; regenerate the form pages and form index with:

```powershell
cd C:\_GIT\Velox\velox-kb
npm.cmd run uia:generate
```

The generator reads the sibling `velox/Forms` folder by default. An alternative checkout can be supplied with `node Scripts/VeloxPKB/generate-uia.mjs --source <checkout-path>`. It records source hashes, omits values such as Text, Lines, connection strings and credentials, and removes only obsolete generated form pages. Review captions, hints and descriptions before publishing source changes; these fields must remain free of secrets and customer data.

The PKB build regenerates the reference when the sibling source checkout is present. Without source, it builds the checked-in reference. After a successful PKB build, the exporter updates the sibling `velox-ai-info/velox-uia/` folder if that repository exists. It also updates the computer-use pointer in that repository's root `AGENTS.md`. This local copy does not commit or push.

The `publish-ai-info.yml` workflow mirrors the folder on relevant pushes to `main` or manual dispatch, alongside the existing Code Library and user docs copies. It uses the checked-in reference; it does not check out private product source. Regenerate and review form pages before committing source-related documentation updates.

This folder's export is explicitly requested by Cam Hart for publicly accessible AI use. The PKB originals retain `classification: internal`; only pages in this folder with `public_export: velox-uia` are eligible for the public projection. The exporter validates the whole folder before replacing the destination, writes `classification: public` in the copies, and rejects unrecognised files or missing metadata. This exception does not permit exporting other PKB folders. The export owner is Cam Hart; its audience is AI assistants and Velox users. Refresh and deletion follow full folder replacement; removing a source page removes its exported copy on the next successful sync. Public indexing should accept only the public copies.
