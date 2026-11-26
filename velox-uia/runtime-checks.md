---
title: Velox UI accessibility runtime checks
description: Observed runtime differences, coverage and computer-use recovery guidance for the checked Designer build.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
public_export: velox-uia
review_date: 2026-11-26
version_applicability: "Designer 310.9826.35233 (Nov 26), 64-bit development build"
---

# Runtime checks

These notes compare the source-derived reference with the running 64-bit development Designer, version **310.9826.35233 (Nov 26)**, on **26 November 2026**. They record observed UI structure and navigation, with source corroboration where available. They do not certify every control or supported UI Automation pattern.

## Coverage and limits

Ten form resources were inspected: main navigation, General Setup, Flow setup, DB Endpoint setup, File Endpoint setup, Manage Logs, About, Code Library, File Search and Create XSD. General Setup's nine exposed tabs, the Flow editor's five exposed tabs, the DB Endpoint editor's three tabs and the File Endpoint editor's two tabs were visited. Detail panels dependent on other selections and connection types were not exhaustively exercised. Other forms in the [form index](forms.md) remain source-only.

The session stayed in **Test**. Production was not selected and the configuration database was not changed. Forms opened during the check were closed through Cancel, Close or the modal close button. No settings were typed or saved, no Flow was run, no connection test was started, no files were generated and no service-control command was invoked. Opening forms can load data and populate navigation branches. This is a structural check, not execution testing.

Only product-level labels, control IDs, build information and general observations are recorded here. Configuration values, customer module names, module GUIDs, credentials, raw accessibility dumps and screenshots are deliberately excluded. The notes describe the checked states and build; future builds and other configurations can differ.

## Common runtime differences

| Source reference clue | Observed runtime behaviour | Computer-use guidance |
|---|---|---|
| Editor base AutomationId | The actionable inner editor often uses the base ID plus `.Input`, while the outer element can be omitted from the tool's tree. | Locate the actual live editor; do not require an exact match to the base ID. Do not add `.Input` indiscriminately to buttons, tabs or checkboxes. |
| DFM control and state | Some controls are hidden by environment, module type, selection or settings. | Absence alone does not prove a missing provider or stale build. Check the active tab, selected item and relevant state. |
| Source label or DFM caption | Labels and workspace titles can change at runtime. | Prefer the observed ID and surrounding context; a static caption is not a guaranteed runtime name. |
| Labelled list-view adapter | The stable named adapter appears as a **group**, with a native **list** child. | Descend to the list and its current rows; the group is not itself a selectable data row. |
| Source component without explicit metadata | Native controls can expose unnamed children or numeric IDs. | Use current structure, focus and visual evidence. Never preserve numeric IDs as selectors. |

Examples of observed editor IDs include `Navigation.Search.Input`, `GeneralSetup.EdtAdminAddress.Input`, `SetupActions.cbFolder.Input`, `SetupDBCon.EdtDBConName.Input`, `SetupFileCon.EdtFileUserName.Input`, `ManageLogs.DateFrom.Input`, `CodeLibrary.edtSearchText.Input`, `FileSearch.cbFileLocation.Input` and `CreateXSD.cbXSDFolder.Input`.

The `.Input` behaviour is corroborated by `velox/Modified/DevExpress/dxUIABase.pas`, method `TdxUIARawElementProviderSimple.GetAutomationIdPropertyValue`: where `UsesParentNameAndDescription` applies and the child has no explicit ID, the provider derives the ID from its parent's AutomationId with the `.Input` suffix. This is a provider rule with conditions, not a promise for every control.

## Computer-use tool recovery

These observations apply to the Windows `@oai/sky` tool used for this check; they should not be treated as permanent Velox defects.

- An initial text-only observation was sufficient for reading metadata, but an indexed input failed with `coordinate input geometry is unavailable`. A fresh screenshot-backed observation made that input possible. Capture current geometry when the tool needs it, then use the newly observed element index.
- The navigation tree exposed off-screen rows. Attempting to click one failed with `has no cached bounds`. Scroll the tree until the intended row is visible and refresh before acting. A row's presence in the accessibility text does not imply that it is on screen.
- Expanding a navigation branch could return before its children were populated. Take another observation before deciding that the branch is empty; do not repeat the activating click without checking.
- Main-menu items and a modal title-bar Close button appeared in the tree, but some indexed clicks failed with `not available in cached app state`. The observed recovery was a freshly inspected screenshot or keyboard navigation through the open menu. Do not repeatedly submit the same unavailable index.
- For an owned modal, the parent window can be disabled while its capture includes the modal and a separate modal screenshot. In this session the modal was not returned separately by `list_windows()`. Closing through the modal's own current screenshot succeeded. Targeting the parent with Alt+F4 did not dismiss that modal. Do not fabricate a window handle from a tree element index.

Keep only the recovery procedure. Element indexes, screenshot IDs, coordinates and native IDs from this session are intentionally not recorded for reuse.

## frmMain

Checked [main navigation](frmmain.md), the footer buttons, environment control, workspace tabs, menus and expanded module branches.

- The live navigation tree was `Navigation.TestTree`, named **Test navigation**. `Navigation.ProductionTree` was not exposed in the active Test state. The environment switch appeared as a **checkbox** named **Environment**; determine the active environment from current UI evidence rather than its control type alone.
- Search appeared as a combo box with `Navigation.Search.Input`, not an editable element carrying the base `Navigation.Search` ID.
- `Navigation.GeneralSetup`, `Navigation.Logs` and `Navigation.WorkspaceTabs` matched the source IDs and descriptions. `Navigation.ConfigurationDatabase` and `Navigation.Restore` were not exposed in the observed layout; their source entries remain valid clues for other states.
- Open forms appeared as selectable children of the workspace tab adapter. Their `Navigation.WorkspaceTab` IDs were generated at runtime and their captions reflected the opened module or tool.
- Tree rows could be present in accessibility text while scrolled off screen. Child loading and menu-index limitations are described in the recovery section above.

## frmSetupGeneral

Checked [General Setup](frmsetupgeneral.md) through the footer **General Setup** button, then visited **Email Settings**, **General**, **Config GIT**, **AI**, **Azure**, **Service**, **API**, **Proxy Settings** and **Notes**. Closed using Cancel.

- The tab container was `GeneralSetup.Tabs`. The source page `GeneralSetup.tsAPIService` was named **API** at runtime.
- The source contains `GeneralSetup.tsMCPService`, but that tab was absent in Test. This matches `TSetupGeneral.RefreshEdits`, assignment `tsMCPService.TabVisible := not EnvironmentTestMode`. This check does not verify MCP controls in Production.
- Save and Cancel used `GeneralSetup.Save` and `GeneralSetup.Cancel`. Source pages should be regenerated if they still show the older component-based IDs for these buttons.
- Editors, combo boxes, spinners, the service-user list and Notes exposed `.Input` IDs. Buttons, labels, checkboxes and tab items used their configured base IDs.
- Only the automatic-proxy checkbox was exposed on Proxy Settings in the observed automatic-detection state. Manual proxy controls in the source table were not exposed in that state.
- The Service and API pages exposed controls appropriate to the current service state rather than every Install, Uninstall, Start and Stop control simultaneously. None was invoked.
- Status and endpoint labels can contain computed or persisted text. Their displayed names are not fixed to the DFM caption. Do not copy those values into reusable documentation.

## frmSetupActions

Checked an existing [Flow editor](frmsetupactions.md): **Data**, **Action Steps**, **Execution**, **Notification** and **Notes**. Selected an existing action row to inspect its detail panel, then closed with Cancel.

- The exposed tabs used `SetupActions.tsSources`, `SetupActions.tsActions`, `SetupActions.tsExecution`, `SetupActions.tsNotification` and `SetupActions.tsNotes`. The inherited General page was not exposed.
- `SetupActions.lvSources` and `SetupActions.lvActions` were named **Flow data sources** and **Flow actions**, exposed as groups containing native lists. Their rows required live inspection.
- The action detail panel was absent before selecting a row and appeared after selection. For a map action, `SetupActions.labelActionName` was named **Map**, although the source metadata description says **Action**. The linked combo box used `SetupActions.comboActionId.Input` and was also named **Map**.
- The Notification email editors were present but disabled in the observed use-default-email state. This matches `TSetupActions.cbUseDefaultEmailClick`, which changes `EdtAdminEmail.Enabled` and `EdtNotifyEmail.Enabled` from the checkbox state. No checkbox was changed during the check.
- Folder, Flow Name and Notes used `.Input` editor IDs. The Save, Cancel, Delete, Quick Save and Run Flow buttons retained their configured base IDs. Only Cancel was invoked.

## frmSetupDBCon

Checked an existing [DB Endpoint editor](frmsetupdbcon.md): **General**, **Advanced** and **Notes**. Closed with Cancel; the Test button was not invoked.

- The form's product caption was **Setup DB Endpoint**, while the workspace title used the loaded module name and its module-type suffix. Do not search only for the DFM caption as a top-level window title.
- Folder, endpoint name, authentication, server/database editors, isolation-level combo boxes, spinners and Notes exposed `.Input` IDs. Radio groups retained their configured base IDs.
- Advanced **Other Parameters** (`leOtherParams`, `TValueListEditor`) exposed a native pane with an unnamed editable child and runtime numeric IDs. The adjacent `SetupDBCon.LabelOtherParams` label was available, but no stable configured AutomationId for the editor was observed. Use the label, current layout and focus; do not treat the source component name as a selector.
- Only the controls relevant to the selected database server and authentication appeared. Other provider/authentication configurations were not selected.

## frmSetupFileCon

Checked the default [File Endpoint editor](frmsetupfilecon.md): **General** and **Notes**. Closed with Cancel; no folder-opening or directory-creation button was invoked.

- Folder, endpoint name, file-name/path editors, the wait spinner and Notes exposed `.Input` IDs. Directory browse/open buttons and checkboxes retained their source IDs.
- Save and Delete were absent for the default module. This matches `TSetupFileCon.RefreshEdits`, which sets `btnSave.Visible` and `btnDelete.Visible` to `not FFileCon.DefaultModule`. Their absence must not be generalised to ordinary modules.
- **Create Dirs** and Cancel were present. The source inventory lists command availability for other states as well; it is not a simultaneous runtime button list.

## frmManageLogs

Opened [Manage Logs](frmmanagelogs.md) through the footer **Logs** button, inspected the filters and results structure, then closed it. No log record was opened or changed and no additional search was submitted. Opening Logs uses its normal initial data-loading behaviour.

- Search/filter editors, Flow and date controls exposed `.Input` IDs.
- `ManageLogs.gLogs` appeared as a group and `ManageLogs.vLogs` as a list. Configured column IDs such as `ManageLogs.vLogsId` and `ManageLogs.vLogsStartDate` appeared as **split button** headers. They identify column controls, not editable record values.
- Filter checkboxes and Search/Close buttons matched their source base IDs. Grid records and action results remain outside this check.

## frmAboutVelox

Opened [About Velox](frmaboutvelox.md) through **Help > About Velox**, inspected its version/labels, then used its Close button.

- About opened in a **workspace tab**, not as a separate top-level modal dialog.
- The version and copyright label names contained runtime text rather than just **Version** and **Copyright**. The version matched the build recorded at the top of this page.
- The memo exposed `AboutVelox.Memo.Input`; the Close button used `AboutVelox.cxButton1`. Visit Web was not invoked.

## frmCodeLibrary

Opened [Code Library](frmcodelibrary.md) through **Help > Code Library**, inspected its initial state, then closed it.

- Search used `CodeLibrary.edtSearchText.Input`. Back and Forward were present but disabled in the initial history state.
- The category tree exposed native tree items with product category names, without stable configured IDs on those rows. Use the current tree; do not invent CodeLibrary-prefixed row IDs.
- The content area initially exposed panes without document text in the captured tree. No content navigation or CSS editor was exercised. The source-only `CodeLibrary.CSS.*` entries describe controls for another state and should not be expected on the main Code Library surface.

## frmFileSearch

Opened [File Search](frmfilesearch.md) through **Tools > File Search**, inspected it and closed it without submitting a search.

- File Name Filter, File Location and Search Text used `FileSearch.cbFileNamePattern.Input`, `FileSearch.cbFileLocation.Input` and `FileSearch.cbTextPattern.Input`.
- Search, Close, the option checkboxes and folder browse/open controls matched their base source IDs.
- The form appeared in a workspace tab. Search results and file-opening behaviour were not exercised.

## frmCreateXSD

Opened [Create XSD](frmcreatexsd.md) through **Tools > Create XSD**, inspected the empty input state and closed the modal without adding samples or generating files.

- This form opened as a **modal window**, disabling the main Designer. The modal caption was **Create XSD from XML**.
- `CreateXSD.lvXMLFiles` was an **XML source files** group containing a native list and its **Sample XML Files** header. No file rows were present in the checked state.
- The folder/name editors used `CreateXSD.cbXSDFolder.Input` and `CreateXSD.cbXSDFileName.Input`. The generating OK button used `CreateXSD.aUpdate`; it was not invoked.
- The window title-bar Close appeared in accessibility text but its indexed action failed in this tool session. The modal was not listed as a separate targetable window; using its own current screenshot to close it succeeded. See the tool recovery guidance above.

## Maintaining these notes

This file is hand-maintained and survives form-page regeneration. The generator links checked forms to their sections here and marks other forms as uninspected. A section means only that its stated states were observed; it is not an assertion that all source controls were checked.

After checking another build, update the date, build identity, environment, exact coverage and differences. Preserve source IDs in the source tables and record runtime aliases or conditions here. Recheck observations against the newly built executable rather than assuming that source regeneration revalidates the runtime notes. Keep configuration values and customer identifiers out of this public-export-eligible file.
