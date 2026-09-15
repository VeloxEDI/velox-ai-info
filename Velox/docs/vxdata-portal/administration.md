---
title: "Administer the VxData portal"
description: "Manage supported users, parties, products, settings and reference data"
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [portal-admin, party, product]
---

Current Administration pages require the `Administrator` role. The deployed application can expose account/user-party assignment, settings/issues, Velox Flow mappings, parties and relationships, products/UOM/temperature data, addresses, interfaces, applications, partners and shipment reference data.

## Administration families

| Family | Typical impact |
| --- | --- |
| Accounts, users and user-party assignments | Portal sign-in/role and which party-owned records a user can access. |
| Settings and issues | Deployment/application behaviour; values can include Velox service host/port configuration. Treat unknown system settings as deployment-owned. |
| Velox Flows | Maps portal action codes to Action FIDs, labels and display/download behaviour. |
| Parties and relationships | Ownership, billing, customer/supplier/carrier/location/consignor/consignee relationships and external codes. |
| Products, quantities, UOM and temperature | Transaction choices and party-specific codes/units. |
| Addresses and geographic mapping | Transaction address selection/normalisation and related lookup data. |
| Interfaces, applications, partners and shipment reference data | Integration routing, defaults, types, services, statuses and partner mappings. |

## Change reference data safely

1. Confirm the production/test portal and obtain business-data approval.
2. Search for an existing record before creating one; verify code, name, party and effective use.
3. Check dependent transactions, portal filters/ownership, mappings and Velox integrations.
4. Make the smallest change and save once.
5. Reopen the record and test one affected portal and integration workflow.

Role membership does not replace data ownership. Codes and relationships can be used by Velox integrations and external partners; renaming, disabling or duplicating them can change routing and reporting. Do not enter secrets in ordinary settings or reference fields. Treat **System Setting** records as deployment-owned unless the relevant runbook explicitly authorises a change.

If a change causes errors, stop related actions, restore the previous governed value where safe and retain record identifiers, timestamps and error evidence. Database/schema repair belongs to the database runbook, not portal editing.

- [Access and navigation](access-and-navigation.md)
- [Transaction workflows](transaction-workflows.md)
- [Run Flow actions](flow-actions.md)
- [Troubleshoot the portal](troubleshooting.md)
