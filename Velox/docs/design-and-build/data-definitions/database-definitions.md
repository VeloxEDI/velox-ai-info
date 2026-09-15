---
title: "Configure a DB Definition"
description: "Define database queries, fields, criteria, parameters and save behaviour"
sidebar_position: 30
slug: /data/db-definitions
classification: public
status: approved
owner: Cam Hart
keywords:
  - "db-definition"
  - "query"
  - "parameters"
---

A DB Definition describes reusable database-backed data for Velox modules. It links one or more DB Connections to designed dataviews, fields, queries and parameters.

## Scope

This reference covers the DB Definition setup form and the configuration decisions needed before opening **Design**. It does not define database-specific SQL syntax or grant database permissions.

## Definition settings

| Setting | Accepted value | Effect and constraints |
| --- | --- | --- |
| **DB Definition Name** | Unique descriptive text | Identifies the Definition wherever it is selected by a Flow, Map, Report or other module. |
| **DB Connections** | One or more existing DB Connections | Makes the selected database endpoints available to the Definition designer. A new Definition adds the default `_Data` Connection when available. |
| **Flag records "as processed" after reading and processing data through this DB Definition** / `UpdateIDFields` | Boolean / cleared | Enables ID/flag-field update behaviour. Older ID-management configuration can migrate into this setting. Do not enable it until each affected dataview, primary key and update rule is verified. |
| **Field name to flag** / `CustomIDField` | Text / empty | Identifies the field updated after processing. A legacy migration can set `XFLO_ID`; do not adopt that value without confirming the deployed schema. |
| **Value to flag as** / `CustomIDValue` | Text or expression / empty | Supplies the update value. A legacy migration can set `XFLO_ID + 1`. Validate expression, type, concurrency and resulting database write. |
| **Design** | Opens the data designer | Defines dataviews, database objects or query text, fields, criteria and parameters. |

## Dataview design

A DB Definition can contain multiple dataviews and can make multiple DB Connections available to them. Give every dataview and field a stable, meaningful name because Maps, Reports and Flows can refer to those names.

Within **Design**:

1. Select the intended DB Connection for each database-backed dataview.
2. Select database objects or enter query logic appropriate to that connection.
3. Expose only the fields needed by consuming modules.
4. Define criteria and parameters rather than embedding environment-specific values in reusable query text.
5. Confirm field data types, sizes and null behaviour against representative test data.
6. Save the design, then save the DB Definition.

## Example

An order-processing Definition might expose an `Orders` dataview with fields such as `OrderNumber`, `OrderDate` and `Status`, plus an `OrderNumber` parameter. These names are illustrative; use the reviewed names and types from your database contract.

## Constraints and failure behaviour

- A DB Definition without a DB Connection cannot open its database-backed dataviews. Velox reports that no DB Connections are configured for the Definition.
- A successful [DB Connection](../connections/database/index.md) test does not validate query permissions, object names, field mappings or representative data.
- Criteria and parameters must be tested with empty, null, boundary and unexpected values that are valid for the business contract.
- Changing a dataview or field name can break consuming modules. Use dependency checking and retest all consumers before saving a shared-definition change.
- Enabling flag behaviour without a dataview configured for flagging produces a configuration error. Test the field, value, primary-key selection and write behaviour in a disposable or controlled database transaction.
- The persisted setting is `UpdateIDFields`; `DoUpdateIDFields` is runtime state. Do not treat a runtime value observed during a run as a saved configuration change.
- A new Definition may add the `_Data` DB Connection when that default module exists. Verify the selected child links rather than assuming `_Data` targets the intended environment.

:::caution Database writes
Definition settings and consuming modules can update data. Use a test database, verify the runtime identity and have an approved recovery method before testing writes.
:::

## Related references

- [Data Definition concepts](definition-concepts.md)
- [Configure a DB Connection](../connections/database/index.md)
- [Connection concepts](../connections/connection-concepts.md)
- [Common Data Definition properties](common-definition-properties.md)
