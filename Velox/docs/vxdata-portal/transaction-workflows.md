---
title: "Work with VxData transactions"
description: "Search, review and update supported business transactions"
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [transaction, shipment, event, issue]
---

The current portal contains authenticated transaction workflows including configured shipment and consignment views, related lines, events, tracking and status data. Shipment access is filtered through user-party relationships involving parties such as billing, consignor and consignee; exact fields and permitted edits depend on the deployed VxData schema, application defaults and ownership checks.

## Review a transaction

1. Open the relevant Transaction page and apply the narrowest available identifiers, dates, party or status filters.
2. Open the intended record and confirm its manifest/header/consignment identity, party, current status, revision and related lines/events before editing.
3. Understand displayed defaults. New shipments can inherit application/party defaults for billing, consignor/consignee, service/type, dates and temperature; confirm them for the real transaction.
4. Change only fields your business process owns and enter required reason/evidence where the deployment provides it.
5. Save once, follow any configured next/book/price workflow, then reopen or return to the list and confirm the stored result.
6. If a configured print/book/Flow action is required, run it separately and verify its result.

Non-administrator editability can depend on an ownership check for the transaction's party. Do not ask an administrator to bypass ownership merely to force a correction; resolve the party/user assignment or use the governed data-correction process.

Do not use repeated Save, refresh or action clicks to resolve a slow response; they can create duplicate work. If data is missing or wrong, preserve the transaction identifier and timestamp, avoid changing unrelated fields, and escalate through the configured support process.

The portal does not by itself establish whether a downstream partner received a message. Correlate with Velox Flow/Transport evidence where applicable.

- [Run portal Flow actions](flow-actions.md)
- [Access and navigation](access-and-navigation.md)
- [Troubleshoot the portal](troubleshooting.md)
