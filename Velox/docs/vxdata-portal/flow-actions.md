---
title: "Run Velox actions from the VxData portal"
description: "Use configured portal actions that invoke Velox Flows"
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [portal, flow, action]
---

The portal can list non-system Flow mappings and invoke the configured Velox Flow through Velox API Service. Transaction, party and product pages can also expose configured print/action codes. A mapping uses a portal **Code** and Velox **Action FID**; the portal looks up the current Velox configuration to obtain name, description and last-run evidence.

| Mapping field | Purpose |
| --- | --- |
| **Code** | Unique portal action key used by buttons/calls. |
| **Name / Description** | Portal-facing guidance; the linked Velox Flow name/description may be displayed when found. |
| **Action FID** | GUID identity of the Velox Flow in the connected configuration database. |
| **Show** | For supported print actions, selects in-browser display versus file download behaviour. |
| **System Setting** | Separates system/internal mappings from the user Flow list. |

## Run an action

1. Confirm the portal context, selected records and intended action.
2. Check that the action name and description match the business outcome. If the portal reports a missing assignment/Flow, ask an administrator to correct **Administration > Config > Flows** and verify the FID in the connected Velox configuration.
3. Select the action once and wait for its response.
4. Review the returned success/error message or generated output.
5. Verify the affected transaction and, where applicable, Velox execution and Transport outcome.

The current portal uses GET with selected numeric IDs for supported print actions and POST for listed Flow execution. Its application-to-Velox service endpoint is configured separately from the browser URL. An HTTP response or portal message does not prove asynchronous Transport delivery. Do not repeat an action until the previous Flow and external destination state are known. Actions can create files, database changes, messages or reports under the service identity.

Administrators must map only approved active Flows, restrict portal access to intended users, protect the portal-to-Velox network boundary and retest mappings after configuration promotion or service restart. A Flow list entry is not a complete per-action authorisation system.

- [Flow concepts](../design-and-build/flows/flow-concepts.md)
- [Transaction workflows](transaction-workflows.md)
- [Access and navigation](access-and-navigation.md)
- [Troubleshoot the portal](troubleshooting.md)
