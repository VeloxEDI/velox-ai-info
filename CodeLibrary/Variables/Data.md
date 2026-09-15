---
title: "Data"
description: "Action-owned client datasets for explicit queries, in-memory workspaces and Velox business-data conventions."
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - data
  - dataset
---

Data variables expose the action-owned `TvxClientDataSet` objects available to Velox scripts. They are mutable in-memory datasets: a friendly name communicates an intended business role, but it does not automatically choose a table, open a connection, execute SQL, create fields, join related rows or persist changes.

## Choosing a dataset

- Use `DATA1` through `DATA10` for general-purpose schemas whose meaning is local to the script.
- Use a friendly name when it makes the intended role clearer to maintainers. The name remains a convention, not schema validation.
- Treat header, line, batch and related friendly datasets as independent unless an entry explicitly documents an alias. Velox does not automatically maintain parent/current-row relationships between them.
- Use `DATA_Self`, `DATA_Self2`, `DATA_SelfLine` and `DATA_SelfLine2` as separate reusable workspaces; their names do not create hierarchy.
- Keep `DATA_Temp` strictly short-lived. Current helper implementations reuse it for incompatible result shapes and a nested helper call can overwrite it.
- Use `DATA_Dataview` and `DATA_Field` only with their documented map-processing contexts.

## Population and schema

Every action constructs these objects, but they normally begin inactive and without fields. Populate one explicitly with [`CreateData`](../Functions/Data/CreateData.md), [`GetData`](../Functions/Data/GetData.md), [`GetDataFromDB`](../Functions/Data/GetDataFromDB.md), another documented load method or direct dataset operations. Each population path can replace the current fields, records, indexes, filters and cursor position.

A database-oriented name does not guarantee the current VxData base-table schema. Configuration, custom SQL and customer extensions can expose a subset, aliases or additional columns. Check optional fields with `FindField`, validate types at the integration boundary and document the schema expected by reusable scripts.

## Runtime lifecycle and ownership

- Query helpers normally request the complete result, copy it into client memory and detach/close the provider-side SQL dataset. Large or binary results therefore consume action-process memory.
- All references to the same object observe one shared schema, cursor, filter, index and edit state. Nested code can move or recreate the dataset.
- `Append`, `Edit`, `Post` and `Delete` change the client dataset. `Post` alone is not proof that an external database, file, API or transaction was updated.
- Helper functions may catch and log query or creation failures, leaving a dataset inactive or reset. Invalid field, conversion and state operations can still raise Delphi dataset exceptions.
- Action cleanup closes the friendly datasets. Velox owns them: scripts must not free them or retain their fields, rows or references beyond the action.
- The datasets are not thread-safe. Do not pass them to asynchronous work or concurrently mutate them.

## Aliases and independence

Some public names deliberately bind to the same underlying object. For example, order-oriented aliases and certain application, branch/location, host, customer and ASN conventions share state as documented on their individual pages. Closing, filtering, navigating or recreating one alias affects every alias of that object.

Conversely, related names such as product/product quantity, shipment/shipment line, remittance/remittance line and the Self workspaces are normally separate objects. Matching suffixes do not perform joins, enforce keys or synchronise cursor positions.

## Security and resource boundaries

Dataset names do not authenticate users, authorise parties, enforce application or tenant scope, validate records or redact sensitive values. Scope every query explicitly, minimise selected columns, avoid logging credentials or personal data and treat rows according to their actual source. Validate row counts before full materialisation when a query could be unbounded.

See [`Datasets`](../ScriptingGuide/Datasets.md) for the scripting cursor, field and edit model. Each child page documents the exact runtime binding, current product convention, aliases and implementation quirks for that public name.

<small>Created 2026-07-19</small>
