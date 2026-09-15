---
title: "Use the VxData portal"
description: "Work with supported transaction and master-data workflows in the current portal"
sidebar_position: 10
classification: public
status: approved
owner: Cam Hart
keywords: [vxdata, portal, transactions]
---

The VxData portal is the current browser interface for selected VxData transactions, reference data and configured Velox Flow actions. Available pages, fields, workflows and labels depend on the deployed build, VxData schema/application configuration, assigned parties and role.

## Boundaries

| Layer | Purpose |
| --- | --- |
| Portal identity/role | Authenticates the user; current Administration and Dashboard controllers require the `Administrator` role. |
| User-party assignment | Filters access to supported shipment, product, UOM and related party-owned records. |
| VxData | Stores transaction/reference data used by the portal and integrations. |
| Velox Flow mapping | Maps a portal action code to a Velox Flow FID and controls selected display/download behaviour. |
| Velox/API/Transport runtime | Executes configured actions and separately records Flow/Transport outcomes. |

## Start here

1. [Access and navigate the portal](access-and-navigation.md).
2. [Search and work with supported transactions](transaction-workflows.md).
3. Administrators can [maintain portal reference data](administration.md).
4. Where configured, [run Velox actions](flow-actions.md).
5. Use [portal troubleshooting](troubleshooting.md) for access, data, save and Flow-action symptoms.

The portal complements Velox Designer; it does not replace integration configuration, service administration or Flow/Transport logs. A page or action being visible does not grant business ownership of every record or prove downstream delivery. Use only the URL and account supplied by your organisation. Do not use documentation examples as production identifiers.

- [What Velox does](../getting-started/what-is-velox.md)
- [Operate and troubleshoot Velox](../operate-and-troubleshoot/index.md)
